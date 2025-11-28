import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getMathExplanation = async (
  num1: number,
  num2: number,
  operator: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Tutor is currently offline (Missing API Key).";

  try {
    const prompt = `Explain how to solve ${num1} ${operator} ${num2} to a 6-year-old student. Keep it very short, encouraging, and simple (under 40 words).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Let's try counting together!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I couldn't reach the AI tutor right now, but you can do it!";
  }
};

export const getEncouragement = async (streak: number): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Great job!";

  try {
    const prompt = `Give a short, enthusiastic one-sentence congratulation to a child who just got ${streak} math questions right in a row.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "You are doing amazing!";
  } catch (error) {
    return "Keep up the great work!";
  }
};
