import { VowTone, VowLength } from '../types.ts';

interface VowGenerationParams {
  partnerName: string;
  yearsTogether: string;
  specialMemory: string;
  tone: VowTone;
  length: VowLength;
}

const GEMINI_MODEL = 'models/gemini-2.0-flash';

const resolveWorkerUrl = (): string | null => {
  const configured = import.meta.env.VITE_GEMINI_WORKER_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8787';
  }

  return null;
};

const buildPrompt = ({ partnerName, yearsTogether, specialMemory, tone, length }: VowGenerationParams) => `
You are a world-class wedding speech writer, renowned for your ability to craft deeply personal and moving vows.
Please write a wedding vow based on the following details.

Instructions:
- The vow must be written from the perspective of the person filling out this form.
- It must be heartfelt, personal, and appropriate for a wedding ceremony.
- Do NOT include any introductory or concluding remarks like "Here is a vow for you:" or "I hope this is what you were looking for."
- Respond ONLY with the text of the vow itself.

Vow Details:
- Tone: ${tone}
- Desired Length: ${length}
- My Partner's Name: ${partnerName}
- We have been together for: ${yearsTogether}
- A special memory, quality, or feeling I want to include: "${specialMemory}"
`;

const callWorker = async (endpoint: string, payload: VowGenerationParams): Promise<string> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to generate vow. Please try again later.';
    try {
      const data = await response.json();
      if (typeof data?.error === 'string') {
        message = data.error;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { vow?: string };
  if (!data.vow || data.vow.trim().length === 0) {
    throw new Error('Generated vow was empty. Please try again.');
  }

  return data.vow.trim();
};

const callGeminiDirect = async (apiKey: string, payload: VowGenerationParams): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(payload) }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    let message = 'Failed to generate vow. Please try again later.';
    try {
      const data = await response.json();
      if (typeof data?.error?.message === 'string') {
        message = data.error.message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = await response.json();
  const candidates = data?.candidates as Array<{
    content?: { parts?: Array<{ text?: string }> };
  }> | undefined;

  const vow =
    candidates?.flatMap((candidate) => candidate.content?.parts ?? [])?.find((part) => typeof part.text === 'string')
      ?.text ?? '';

  if (!vow.trim()) {
    throw new Error('Generated vow was empty. Please try again.');
  }

  return vow.trim();
};

export const generateVow = async ({
  partnerName,
  yearsTogether,
  specialMemory,
  tone,
  length,
}: VowGenerationParams): Promise<string> => {
  const payload = { partnerName, yearsTogether, specialMemory, tone, length };

  const workerUrl = resolveWorkerUrl();
  if (workerUrl) {
    try {
      return await callWorker(workerUrl, payload);
    } catch (error) {
      const fallbackKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
      if (!fallbackKey) {
        throw error;
      }
      return await callGeminiDirect(fallbackKey, payload);
    }
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (apiKey) {
    return await callGeminiDirect(apiKey, payload);
  }

  throw new Error(
    'Gemini is not configured. Provide VITE_GEMINI_WORKER_URL or VITE_GEMINI_API_KEY in your environment.',
  );
};
