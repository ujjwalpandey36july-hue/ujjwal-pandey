import React, { useState } from 'react';
import { getMathExplanation } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, Loader2 } from 'lucide-react';

interface AITutorProps {
  num1: number;
  num2: number;
  operator: string;
}

export const AITutor: React.FC<AITutorProps> = ({ num1, num2, operator }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    setLoading(true);
    const text = await getMathExplanation(num1, num2, operator);
    setExplanation(text);
    setLoading(false);
  };

  if (explanation) {
    return (
      <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold">
          <Sparkles className="w-5 h-5" />
          <h3>AI Tutor Says:</h3>
        </div>
        <p className="text-slate-700 text-lg leading-relaxed font-medium">
          {explanation}
        </p>
        <button 
          onClick={() => setExplanation(null)}
          className="mt-3 text-sm text-purple-600 hover:underline"
        >
          Close Explanation
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Button 
        variant="ai" 
        onClick={handleAskAI} 
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto mx-auto"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {loading ? "Thinking..." : "Explain This!"}
      </Button>
    </div>
  );
};
