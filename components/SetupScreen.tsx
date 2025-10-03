
import React, { useState } from 'react';
import { Difficulty } from '../types';
import Spinner from './Spinner';

interface SetupScreenProps {
  onStartQuiz: (topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartQuiz, isLoading, error }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && difficulty) {
      onStartQuiz(topic, difficulty);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
      <h2 className="text-2xl font-semibold text-slate-200 mb-2">Create Your Quiz</h2>
      <p className="text-slate-400 mb-6">Choose a topic and difficulty to begin.</p>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-4 w-full" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <label htmlFor="topic" className="sr-only">Topic</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Computer Networks, Roman History..."
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setDifficulty(Difficulty[key])}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 ${
                difficulty === Difficulty[key]
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              disabled={isLoading}
            >
              {Difficulty[key]}
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={!topic || !difficulty || isLoading}
          className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg disabled:shadow-none"
        >
          {isLoading ? <><Spinner /> Generating Quiz...</> : 'Start Quiz'}
        </button>
      </form>
    </div>
  );
};

export default SetupScreen;
