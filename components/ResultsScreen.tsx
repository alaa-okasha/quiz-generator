
import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';
import { getImprovementSuggestions } from '../services/geminiService';
import Spinner from './Spinner';

interface ResultsScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  topic: string;
  onNewQuiz: () => void;
  onStartOver: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, questions, topic, onNewQuiz, onStartOver }) => {
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const score = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);
      try {
        const result = await getImprovementSuggestions(topic, incorrectAnswers);
        setSuggestions(result);
      } catch (error) {
        setSuggestions('Could not load improvement suggestions at this time.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, userAnswers]);

  const scoreColor = scorePercentage >= 70 ? 'text-green-400' : scorePercentage >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-100 mb-2">Quiz Complete!</h2>
      <p className="text-slate-400 mb-6">Here's how you did on "{topic}"</p>
      
      <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
        <p className="text-slate-300 text-lg">Your Score</p>
        <p className={`text-6xl font-bold my-2 ${scoreColor}`}>{scorePercentage}%</p>
        <p className="text-slate-400">{score} out of {totalQuestions} correct</p>
      </div>

      <div className="text-left bg-slate-900/40 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">Areas to Improve</h3>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Spinner />
            <span>Analyzing your results...</span>
          </div>
        ) : (
          <div 
            className="text-slate-300 space-y-2 prose prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-li:marker:text-sky-400" 
            dangerouslySetInnerHTML={{ __html: suggestions.replace(/\n/g, '<br />').replace(/\* /g, '• ') }} 
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onNewQuiz}
          className="w-full sm:w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300"
        >
          New Quiz (Same Topic)
        </button>
        <button
          onClick={onStartOver}
          className="w-full sm:w-auto bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
