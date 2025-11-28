import React, { useState, useEffect, useCallback } from 'react';
import { MathCard } from './components/MathCard';
import { AITutor } from './components/AITutor';
import { Question } from './types';
import { Calculator } from 'lucide-react';
import { getEncouragement } from './services/geminiService';

const generateQuestion = (): Question => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const isAddition = Math.random() > 0.5;

  // Ensure simple logic for subtraction (no negative results for beginners)
  if (!isAddition && num1 < num2) {
    return {
      num1: num2,
      num2: num1,
      operator: '-',
      answer: num2 - num1,
    };
  }

  return {
    num1,
    num2,
    operator: isAddition ? '+' : '-',
    answer: isAddition ? num1 + num2 : num1 - num2,
  };
};

const App: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [streak, setStreak] = useState(0);
  const [encouragement, setEncouragement] = useState<string>('');

  const loadNewQuestion = useCallback(() => {
    setQuestion(generateQuestion());
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Every 5 correct answers, ask AI for encouragement
      if (newStreak > 0 && newStreak % 5 === 0) {
        getEncouragement(newStreak).then(msg => setEncouragement(msg));
        setTimeout(() => setEncouragement(''), 4000); // Clear after 4s
      }
    } else {
      setStreak(0);
    }
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
          <Calculator className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tight">
          MathGenius <span className="text-indigo-600">Junior</span>
        </h1>
        <p className="text-slate-500 font-medium">Master math one question at a time!</p>
      </header>

      {/* Encouragement Toast */}
      {encouragement && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full shadow-lg font-bold animate-bounce text-center">
          🎉 {encouragement}
        </div>
      )}

      {/* Main Game Area */}
      <main className="w-full max-w-lg">
        <MathCard 
          question={question} 
          onAnswer={handleAnswer} 
          onNext={loadNewQuestion}
          streak={streak}
        />

        {/* AI Tutor Section - Always available to help */}
        <AITutor 
          key={`${question.num1}-${question.num2}-${question.operator}`} // Remount on new question
          num1={question.num1} 
          num2={question.num2} 
          operator={question.operator} 
        />
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>Simple Practice for School Champions</p>
      </footer>
    </div>
  );
};

export default App;
