import React, { useState, useEffect, useRef } from 'react';
import { Question, GameStatus } from '../types';
import { Button } from './Button';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface MathCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  streak: number;
}

export const MathCard: React.FC<MathCardProps> = ({ question, onAnswer, onNext, streak }) => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset state when question changes
    setInputValue('');
    setStatus(GameStatus.PLAYING);
    // Focus input on new question
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [question]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue) return;

    const userNum = parseInt(inputValue, 10);
    if (isNaN(userNum)) return;

    if (userNum === question.answer) {
      setStatus(GameStatus.CORRECT);
      onAnswer(true);
      // Auto advance after short delay for better UX
      setTimeout(() => {
        // We trigger next via parent, but let's clear local state first visually if needed
        onNext();
      }, 1500);
    } else {
      setStatus(GameStatus.WRONG);
      onAnswer(false);
      // Clear input to try again
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isWrong = status === GameStatus.WRONG;
  const isCorrect = status === GameStatus.CORRECT;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-slate-100">
        
        {/* Status Bar */}
        <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-b border-slate-100">
          <div className="text-slate-500 font-bold text-sm uppercase tracking-wide">Question</div>
          <div className="flex items-center gap-1 text-orange-500 font-bold">
            <span>🔥 Streak: {streak}</span>
          </div>
        </div>

        {/* Math Display */}
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-4 text-7xl font-black text-slate-800 mb-8 font-mono tracking-tighter">
            <span className="text-indigo-600">{question.num1}</span>
            <span className="text-slate-400">{question.operator}</span>
            <span className="text-indigo-600">{question.num2}</span>
            <span className="text-slate-300">=</span>
            <span className="text-slate-800">?</span>
          </div>

          {/* Feedback Overlay or Input Area */}
          <div className="relative min-h-[120px]">
             {isCorrect ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                 <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-2" />
                 <span className="text-2xl font-bold text-emerald-600">Correct!</span>
               </div>
             ) : (
               <div className="space-y-4">
                 <input
                   ref={inputRef}
                   type="number"
                   inputMode="numeric"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder="#"
                   className={`w-full text-center text-4xl font-bold py-4 rounded-2xl border-4 outline-none transition-all placeholder:text-slate-200
                     ${isWrong 
                       ? 'border-red-200 bg-red-50 text-red-600 animate-pulse' 
                       : 'border-slate-200 focus:border-indigo-400 focus:bg-indigo-50 text-slate-700'
                     }`}
                 />
                 
                 {isWrong && (
                    <div className="text-red-500 font-bold animate-bounce">
                      Try Again!
                    </div>
                 )}

                 <Button 
                    fullWidth 
                    onClick={() => handleSubmit()} 
                    disabled={!inputValue}
                  >
                    Submit Answer
                  </Button>
               </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Help Note */}
      <div className="mt-6 text-center text-slate-400 text-sm font-medium">
        Press <kbd className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm mx-1 font-sans">Enter</kbd> to submit
      </div>

    </div>
  );
};
