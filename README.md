# Adaptive AI Quiz Generator

An intelligent quiz generator that creates adaptive, multiple-choice quizzes on any topic. This application uses the Google Gemini API to dynamically generate questions and provides personalized feedback to help users identify and improve their weak points.

![Adaptive AI Quiz Generator Screenshot](https://storage.googleapis.com/aistudio-project-co-lab-assets/readme_images/adaptive-ai-quiz-generator.png)

## ✨ Features

- **Dynamic Quiz Generation:** Enter any topic you can think of, and the AI will generate a relevant quiz for you in seconds.
- **Selectable Difficulty:** Choose between Easy, Medium, and Hard difficulty levels to tailor the quiz to your knowledge level.
- **Instant Feedback:** See immediately whether your answer was correct or incorrect before moving to the next question.
- **Progress Tracking:** A progress bar keeps you informed of how far you are through the quiz.
- **Personalized Improvement Plan:** After completing the quiz, the AI analyzes your incorrect answers and provides a concise, actionable list of topics to review.
- **Responsive Design:** A clean, modern, and fully responsive UI that works seamlessly on desktop and mobile devices.
- **Restart or Refine:** Easily start a new quiz on the same topic or go back to the beginning to choose a new topic.

---

## 🛠️ Technology Stack

This project is built with a modern, efficient, and serverless frontend stack.

- **Core Library:** **React 19** (using Hooks and functional components)
- **Language:** **TypeScript** for type safety and improved developer experience.
- **AI Engine:** **Google Gemini API** (`gemini-2.5-flash`) for all content generation, utilizing the `@google/genai` SDK.
- **Styling:** **Tailwind CSS** for a utility-first, responsive, and customizable design system.
- **Module System:** **ES Modules** with **Import Maps** to load dependencies directly from a CDN, eliminating the need for a complex build setup.

---

## 🚀 How It Works

The application's logic is centered around a state machine that transitions the user through three main phases: Setup, Quiz, and Results.

1.  **Setup Phase (`components/SetupScreen.tsx`)**:

    - The user provides a topic and selects a difficulty level.
    - On submission, the `generateQuiz` function in `services/geminiService.ts` is called.

2.  **AI Quiz Generation (`services/geminiService.ts`)**:

    - A carefully engineered prompt is sent to the Gemini API, requesting a specific number of questions for the given topic and difficulty.
    - Crucially, this API call uses Gemini's **JSON Mode** by providing a strict `responseSchema`. This forces the model to return a well-structured JSON array of question objects, ensuring data integrity and eliminating the need for fragile text parsing.

3.  **Quiz Phase (`components/QuizScreen.tsx`)**:

    - The generated questions are displayed one by one.
    - The component tracks the user's answers, provides immediate visual feedback (green for correct, red for incorrect), and records the results.

4.  **Results & Feedback Phase (`components/ResultsScreen.tsx`)**:
    - The final score is calculated and displayed.
    - A second API call is made to the `getImprovementSuggestions` function. This prompt is highly contextual—it sends the user's specific incorrect answers back to the AI.
    - The AI then acts as a personalized tutor, analyzing these mistakes to generate a targeted list of improvement areas, offering a much more valuable learning experience than generic feedback.

---

## 📂 Project Structure

The codebase is organized into logical components and services for clarity and maintainability.

```
/
├── components/
│   ├── QuizScreen.tsx       # Renders the active quiz questions and options.
│   ├── ResultsScreen.tsx    # Displays the final score and AI-generated feedback.
│   ├── SetupScreen.tsx      # The initial screen for topic and difficulty selection.
│   └── Spinner.tsx          # A reusable loading spinner component.
├── services/
│   └── geminiService.ts     # Handles all communication with the Google Gemini API.
├── App.tsx                  # Main application component, manages state and routing.
├── constants.ts             # Stores application-wide constants (e.g., number of questions).
├── index.html               # The entry point of the application.
├── index.tsx                # Mounts the React application to the DOM.
├── types.ts                 # Contains all TypeScript type definitions and enums.
└── metadata.json            # Project metadata.
```

---

## 🔧 Getting Started

### Prerequisites

- A modern web browser that supports ES Modules and Import Maps (e.g., Chrome, Firefox, Edge).
- A Google Gemini API key.

### Environment Variables

This application requires a Google Gemini API key to function. The key must be available as an environment variable named `API_KEY`.

Ensure that `process.env.API_KEY` is correctly configured in your deployment or development environment.

### Running Locally

Since this project uses ES Modules and loads dependencies via a CDN, there is no build step required.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Set up your API Key:**
    Make sure your local development environment has the `API_KEY` environment variable set.
3.  **Serve the files:**
    You need to serve the project files from a local web server. A simple way to do this is with Python's built-in server.
    ```bash
    # If you have Python 3 installed
    python -m http.server
    ```
    Or using `npx`:
    ```bash
    npx serve
    ```
4.  **Open the application:**
    Navigate to `http://localhost:8000` (or the URL provided by your server) in your web browser.
