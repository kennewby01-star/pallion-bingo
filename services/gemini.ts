
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getBingoLingo = async (num: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Minimalist prompt to reduce generation time and latency
  const prompt = `Bingo number ${num}. Short classic rhyme/nickname only. No quotes. Max 4 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    return response.text.trim() || `Number ${num}`;
  } catch (error) {
    console.error("Gemini Lingo Error:", error);
    return `Number ${num}`;
  }
};
