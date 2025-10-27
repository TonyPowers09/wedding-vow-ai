import { GoogleGenAI } from "https://aistudiocdn.com/@google/genai@^1.27.0";
import { VowTone, VowLength } from '../types.ts';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface VowGenerationParams {
  partnerName: string;
  yearsTogether: string;
  specialMemory: string;
  tone: VowTone;
  length: VowLength;
}

export const generateVow = async ({
  partnerName,
  yearsTogether,
  specialMemory,
  tone,
  length,
}: VowGenerationParams): Promise<string> => {
  const prompt = `
    You are a world-class wedding speech writer, renowned for your ability to craft deeply personal and moving vows.
    Please write a wedding vow based on the following details.

    **Instructions:**
    - The vow must be written from the perspective of the person filling out this form.
    - It must be heartfelt, personal, and appropriate for a wedding ceremony.
    - Do NOT include any introductory or concluding remarks like "Here is a vow for you:" or "I hope this is what you were looking for."
    - Respond ONLY with the text of the vow itself.

    **Vow Details:**
    - Tone: ${tone}
    - Desired Length: ${length}
    - My Partner's Name: ${partnerName}
    - We have been together for: ${yearsTogether}
    - A special memory, quality, or feeling I want to include: "${specialMemory}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating vow with Gemini API:", error);
    throw new Error("Failed to generate vow. Please check your API key and try again.");
  }
};