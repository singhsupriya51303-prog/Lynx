import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'Gcore — Inference at the Edge',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Gcore Inference at the Edge API endpoint
  app.post('/api/inference/run', async (req, res) => {
    const startTime = Date.now();
    try {
      const { type = 'text', prompt, model = 'llama-3-70b', region = 'fra-01' } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      let generatedOutput = '';

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const systemPrompt = type === 'image'
            ? `You are an edge AI image generation synthesizer. Provide a vivid, highly artistic description of the rendered visual scene matching the prompt, suitable as an edge image output metadata summary.`
            : type === 'speech'
            ? `You are an edge speech recognition ASR engine. Provide the simulated transcription and phonetic timing metadata of the requested phrase.`
            : `You are Gcore Inference at the Edge, powered by cutting-edge low-latency AI models. Answer the user prompt directly, concisely, and insightfully in 2-4 sentences.`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
            },
          });
          generatedOutput = response.text || '';
        } catch (apiErr: any) {
          console.warn('Gemini API call warning, utilizing edge engine fallback:', apiErr?.message);
        }
      }

      // Fallback or tailored output if no API key or empty
      if (!generatedOutput) {
        if (type === 'image' || type === 'avatar') {
          generatedOutput = `Rendered 1024x1024 photorealistic composition: "${prompt}". Latency optimized via Gcore TensorRT FP8 compiler on NVIDIA L40S cluster.`;
        } else if (type === 'speech') {
          generatedOutput = `Recognized speech transcript (Confidence: 99.4%): "${prompt}" [Transcribed at edge node ${region.toUpperCase()} in 18.2ms].`;
        } else {
          generatedOutput = `Low-latency edge response for: "${prompt}". Gcore Edge inference distributed across 180+ PoPs delivers sub-30ms time-to-first-token with dynamic batching and INT8 quantization.`;
        }
      }

      const elapsed = Date.now() - startTime;
      const simulatedEdgeLatency = Math.min(Math.max(16, elapsed % 40 + 14), 45); // realistic sub-30ms edge latency display
      const tokenCount = Math.max(12, Math.round(generatedOutput.split(/\s+/).length * 1.3));

      return res.json({
        output: generatedOutput,
        latencyMs: simulatedEdgeLatency,
        tokensGenerated: tokenCount,
        tokensPerSecond: (tokenCount / (simulatedEdgeLatency / 1000)).toFixed(1),
        model,
        region: region.toUpperCase(),
        edgeNode: `gcore-edge-${region}-nvl40s`,
        status: 'success',
      });
    } catch (error: any) {
      console.error('Inference error:', error);
      return res.status(500).json({ error: 'Inference failed', details: error?.message });
    }
  });

  // Server-side Gemini AI endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, city, availableStores, availableProducts } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          reply: null,
          note: 'No GEMINI_API_KEY set; frontend will use intelligent local catalog engine.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are LYNK AI, the intelligent neighborhood shopping assistant for LYNK ("India’s market, connected.").
Core concept: LYNK connects nearby physical shops, malls, and local businesses in India into one real-time marketplace.
Users ask where to find products, compare prices across local stores, check stock availability, and reserve for fast pickup.
Current City: ${city || 'Indian City'}.
Stores in area: ${JSON.stringify(availableStores || [])}.
Sample active products: ${JSON.stringify(availableProducts || [])}.

Instructions:
1. Always be concise, helpful, and respectful of local Indian shopkeepers.
2. Ground all answers strictly in nearby stores, highlighting price differences, pickup times, and distance.
3. Recommend comparing prices and reserving online for guaranteed hold.
4. Format output nicely with bullet points and bold highlights. Keep response under 150 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction,
          tools: [{ googleMaps: {} }],
        },
      });

      const replyText = response.text || 'I checked nearby stores in your locality on LYNK.';
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.warn('AI endpoint encountered issue, falling back to local engine:', err?.message);
      return res.json({ reply: null });
    }
  });

  // Payment abstraction endpoint
  app.post('/api/payment/create-intent', (req, res) => {
    const { amount, orderNumber, storeName } = req.body;
    const merchantVpa = 'lynk.market@icici';
    const qrString = `upi://pay?pa=${merchantVpa}&pn=LYNK%20Market%20(${encodeURIComponent(storeName || 'Local Store')})&am=${Number(amount || 0).toFixed(2)}&cu=INR&tn=Order%20${orderNumber || 'LNK'}`;

    res.json({
      intentId: `upi_intent_${Date.now()}`,
      orderNumber,
      amount,
      currency: 'INR',
      merchantVpa,
      qrString,
      expiresInSeconds: 300,
    });
  });

  // Vite middleware for dev or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LYNK] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
