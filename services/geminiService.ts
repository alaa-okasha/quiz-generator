import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question, UserAnswer } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The quiz question text.",
    },
    options: {
      type: Type.ARRAY,
      description: "An array of 4 possible answers.",
      items: { type: Type.STRING },
    },
    correctAnswer: {
      type: Type.STRING,
      description:
        "The correct answer, which must be one of the strings from the 'options' array.",
    },
  },
  required: ["question", "options", "correctAnswer"],
};

export const generateQuiz = async (
  topic: string,
  difficulty: Difficulty,
  questionCount: number
): Promise<Question[]> => {
  try {
    const prompt = `Generate a ${difficulty} level quiz with exactly ${questionCount} multiple-choice questions on the topic "${topic}". Each question must have exactly 4 options. Ensure one of the options is the correct answer. Do not repeat questions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: `An array of ${questionCount} quiz questions.`,
          items: questionSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);

    // Validate the response
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI returned an invalid or empty quiz structure.");
    }

    return questions.map((q: any) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error(
      "Failed to generate quiz. The AI might be busy or the topic might be too specific. Please try again."
    );
  }
};

export const getImprovementSuggestions = async (
  topic: string,
  incorrectAnswers: UserAnswer[]
): Promise<string> => {
  if (incorrectAnswers.length === 0) {
    return "Amazing job! You answered all questions correctly. Keep up the great work!";
  }

  try {
    const incorrectQuestionsSummary = incorrectAnswers
      .map(
        (answer) =>
          `- Question: "${answer.question}" (Your answer: "${answer.selectedAnswer}", Correct: "${answer.correctAnswer}")`
      )
      .join("\n");

    const prompt = `
      A user took a quiz on the topic "${topic}". They answered the following questions incorrectly:
      ${incorrectQuestionsSummary}

      Based on these incorrect answers, analyze the user's weak points. Provide a concise, encouraging, and helpful summary of the specific sub-topics or concepts they should review. Present the feedback as a bulleted list. Do not just repeat the questions.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting improvement suggestions:", error);
    throw new Error(
      "Failed to get improvement suggestions. Please try again later."
    );
  }
};
