
import React, { useState, useCallback } from 'react';
import { Difficulty, Question, UserAnswer } from './types';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { generateQuiz } from './services/geminiService';
import { NUMBER_OF_QUESTIONS } from './constants';

type GameState = 'setup' | 'quiz' | 'results';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async (selectedTopic: string, selectedDifficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      const newQuestions = await generateQuiz(selectedTopic, selectedDifficulty, NUMBER_OF_QUESTIONS);
      if (newQuestions.length < NUMBER_OF_QUESTIONS) {
        throw new Error(`Failed to generate enough questions. Please try a broader topic.`);
      }
      setTopic(selectedTopic);
      setDifficulty(selectedDifficulty);
      setQuestions(newQuestions);
      setUserAnswers([]);
      setGameState('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setGameState('setup'); // Stay on setup screen if there's an error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQuizComplete = useCallback((answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setGameState('results');
  }, []);
  
  const handleNewQuiz = useCallback(() => {
    if (topic && difficulty) {
      handleStartQuiz(topic, difficulty);
    }
  }, [topic, difficulty, handleStartQuiz]);
  
  const handleStartOver = useCallback(() => {
    setGameState('setup');
    setTopic('');
    setDifficulty(null);
    setQuestions([]);
    setUserAnswers([]);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'quiz':
        return <QuizScreen questions={questions} onComplete={handleQuizComplete} />;
      case 'results':
        return (
          <ResultsScreen
            userAnswers={userAnswers}
            questions={questions}
            topic={topic}
            onNewQuiz={handleNewQuiz}
            onStartOver={handleStartOver}
          />
        );
      case 'setup':
      default:
        return (
          <SetupScreen 
            onStartQuiz={handleStartQuiz} 
            isLoading={isLoading} 
            error={error} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Adaptive AI Quiz Generator
          </h1>
          <p className="text-slate-400 mt-2">Test your knowledge on any topic, powered by Gemini.</p>
        </header>
        <main className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-500">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Quiz Generator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
