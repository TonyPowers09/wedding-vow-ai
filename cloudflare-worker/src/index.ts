interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
}

type VowPayload = {
  partnerName: string;
  yearsTogether: string;
  specialMemory: string;
  tone: string;
  length: string;
};

const buildPrompt = (payload: VowPayload) => {
  const { partnerName, yearsTogether, specialMemory, tone, length } = payload;
  return `
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
};

async function callGemini(env: Env, payload: VowPayload) {
  if (!env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured on the worker.');
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: buildPrompt(payload),
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${env.GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json<Record<string, unknown>>();
  const candidates = data.candidates as Array<{
    content?: { parts?: Array<{ text?: string }> };
  }> | undefined;

  const text =
    candidates?.flatMap((candidate) => candidate.content?.parts ?? [])?.find((part) => typeof part.text === 'string')
      ?.text ?? '';

  if (!text.trim()) {
    throw new Error('Gemini API returned an empty response.');
  }

  return text.trim();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: corsHeaders(),
      });
    }

    try {
      const payload = (await request.json()) as VowPayload;

      if (!payload?.partnerName || !payload?.specialMemory) {
        return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
          status: 400,
          headers: corsHeaders(),
        });
      }

      const vow = await callGemini(env, payload);

      return new Response(JSON.stringify({ vow }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    } catch (error) {
      console.error('Worker error', error);
      const message = error instanceof Error ? error.message : 'Unexpected error';
      const status = message.includes('Missing required')
        ? 400
        : message.includes('Gemini API error')
          ? 502
          : 500;

      return new Response(JSON.stringify({ error: message }), {
        status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    }
  },
};

const corsHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});
