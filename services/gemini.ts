
import { GoogleGenAI } from "@google/genai";

export const getBingoLingo = async (num: number): Promise<string> => {
  // Initialize inside the function to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    // If the error is "Requested entity was not found", it usually means an API key issue
    return `Number ${num}`;
  }
};
