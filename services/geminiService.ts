import { GoogleGenAI } from "https://esm.sh/@google/genai@0.14.0";
import { VowTone, VowLength } from '../types.ts';

interface VowGenerationParams {
  apiKey: string;
  partnerName: string;
  yearsTogether: string;
  specialMemory: string;
  tone: VowTone;
  length: VowLength;
}

export const generateVow = async ({
  apiKey,
  partnerName,
  yearsTogether,
  specialMemory,
  tone,
  length,
}: VowGenerationParams): Promise<string> => {
  
  if (!apiKey) {
    throw new Error("API key is not provided. Please enter your API key to generate a vow.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

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
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API key is not valid. Please check your key and try again.");
    }
    throw new Error("Failed to generate vow. There might be an issue with the API service.");
  }
};
