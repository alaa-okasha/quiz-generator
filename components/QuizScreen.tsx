
import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    // Reset state for the new question
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    setUserAnswers(prev => [...prev, {
      question: currentQuestion.question,
      selectedAnswer: option,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer
    }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(userAnswers);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-500/80 ring-2 ring-green-400';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500/80';
    }
    return 'bg-slate-700 opacity-60';
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-200">Question {currentQuestionIndex + 1}
          <span className="text-slate-400 font-normal">/{questions.length}</span>
        </h2>
      </div>
      
      <div className="h-1 w-full bg-slate-700 rounded-full mb-6">
        <div 
          className="h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-slate-700/50 p-6 rounded-lg mb-6">
        <p className="text-lg md:text-xl text-slate-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg text-left transition-all duration-200 text-white font-medium disabled:cursor-not-allowed ${getButtonClass(option)}`}
            dangerouslySetInnerHTML={{ __html: option }}
          />
        ))}
      </div>
      
      {isAnswered && (
        <div className="mt-6 text-right">
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
