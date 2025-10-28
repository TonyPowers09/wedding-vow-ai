import { VowTone, VowLength } from '../types.ts';

interface VowGenerationParams {
  partnerName: string;
  yearsTogether: string;
  specialMemory: string;
  tone: VowTone;
  length: VowLength;
}

const resolveWorkerUrl = (): string => {
  const configured = import.meta.env.VITE_GEMINI_WORKER_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8787';
  }

  throw new Error(
    'Gemini worker URL is not configured. Set VITE_GEMINI_WORKER_URL to your deployed Cloudflare Worker endpoint.',
  );
};

export const generateVow = async ({
  partnerName,
  yearsTogether,
  specialMemory,
  tone,
  length,
}: VowGenerationParams): Promise<string> => {
  const endpoint = resolveWorkerUrl();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      partnerName,
      yearsTogether,
      specialMemory,
      tone,
      length,
    }),
  });

  if (!response.ok) {
    let message = 'Failed to generate vow. Please try again later.';
    try {
      const data = await response.json();
      if (typeof data?.error === 'string') {
        message = data.error;
      }
    } catch {
      // Ignore parse errors and use default message
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { vow?: string };
  if (!data.vow || data.vow.trim().length === 0) {
    throw new Error('Generated vow was empty. Please try again.');
  }

  return data.vow.trim();
};
