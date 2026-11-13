import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured. Please check Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const app = express();
app.use(express.json({ limit: '10mb' }));

// 1. Text-to-Speech endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', style = 'Warm, gentle, affectionate personal letter reader' } = req.body ?? {};
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for speech synthesis.' });
      return;
    }

    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 4000),
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      res.status(502).json({ error: 'No audio data returned from Gemini TTS.' });
      return;
    }

    res.json({
      model: 'gemini-3.8-flash-tts',
      audioDataUrl: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate speech.';
    res.status(500).json({ error: message });
  }
});

// 2. High-quality image generation endpoint using gemini-3-pro-image-preview with 1K, 2K, 4K size support
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '1:1' } = req.body ?? {};
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required for image generation.' });
      return;
    }

    const validSizes = ['1K', '2K', '4K'] as const;
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const ai = getGenAIClient();
    const enhancedPrompt = `Warm handmade watercolor and colored-pencil scrapbook illustration on cream textured paper, soft blush pink and muted rose palette, cozy aesthetic: ${prompt}`;

    let response: GenerateContentResponse;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: selectedSize,
          },
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: selectedSize,
          },
        },
      });
    }

    let imageUrl: string | null = null;
    let captionText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        captionText += part.text;
      }
    }

    if (!imageUrl) {
      res.status(502).json({ error: 'No image data returned from Gemini image model.' });
      return;
    }

    res.json({
      model: 'gemini-3-pro-image-preview',
      imageSize: selectedSize,
      imageUrl,
      caption: captionText.trim(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate image.';
    res.status(500).json({ error: message });
  }
});

// 3. Multi-turn Gemini Chatbot endpoint supporting gemini-4-argon, gemini-4-carbon, gemini-4-hydrogen, gemini-3.1-flash-lite
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], taskMode = 'interactive' } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const modelMap: Record<string, string> = {
      interactive: 'gemini-4-argon',
      reasoning: 'gemini-4-carbon',
      general: 'gemini-4-hydrogen',
      fast: 'gemini-3.1-flash-lite',
    };
    const selectedModel = modelMap[taskMode] || 'gemini-4-argon';

    const systemInstruction = `You are the warm, thoughtful Keepsake Companion inside "The Month Between Us — A little scrapbook made for Pallavi."
Context about this scrapbook:
- Lakshya (who calls himself "Capy" and calls Pallavi his "gudiya") created this scrapbook to accompany a physical gift box containing KitKats with tiny message slips, cutout prints, and a chocolate bouquet paid for with his own earned money (₹500 earned from building a proposal website for a friend).
- Lakshya and Pallavi are meeting again after about a month apart, and Pallavi had been unwell.
- Page 1 ("A little message for Pallavi") is playful, energetic, and affectionate about the chocolate box and wanting a cute random picture of her.
- Page 2 ("A quieter chapter — Something I needed to say...") is a sincere, humble, unpressured apology from Lakshya acknowledging his past mistakes without excuses or guilt-tripping, wishing for things to stay healthy, peaceful, and happy between them.
Rules:
- Never invent or fabricate shared memories, dates, photos, or events not mentioned in the letters.
- Keep your tone warm, gentle, emotionally honest, and concise.
- Help Pallavi or Lakshya reflect on the messages, draft a reply note, or brainstorm ideas for upcoming scrapbook pages.`;

    const ai = getGenAIClient();

    const formattedHistory = Array.isArray(history)
      ? history
          .filter(
            (item: { role?: string; text?: string }) =>
              (item.role === 'user' || item.role === 'model') &&
              typeof item.text === 'string' &&
              item.text.trim().length > 0
          )
          .map((item: { role: 'user' | 'model'; text: string }) => ({
            role: item.role,
            parts: [{ text: item.text }],
          }))
      : [];

    const chat = ai.chats.create({
      model: selectedModel,
      history: formattedHistory,
      config: {
        systemInstruction,
      },
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message,
    });

    res.json({
      model: selectedModel,
      reply: response.text ?? '',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get chat response.';
    res.status(500).json({ error: message });
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  let viteMiddleware: express.RequestHandler | null = null;
  const viteReady = import('vite')
    .then(({ createServer: createViteServer }) =>
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      })
    )
    .then((vite) => {
      viteMiddleware = vite.middlewares;
    });

  app.use(async (req, res, next) => {
    if (!viteMiddleware) {
      await viteReady;
    }
    if (viteMiddleware) {
      viteMiddleware(req, res, next);
    } else {
      next();
    }
  });
}

// Bind port 3000 immediately so container readiness checks never time out on cold starts
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Scrapbook server listening on http://0.0.0.0:${PORT}`);
});
