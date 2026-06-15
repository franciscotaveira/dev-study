import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, LiveServerMessage, Modality } from "@google/genai";
import { WebSocketServer } from "ws";
import http from "http";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Quick action: Explain a topic
  app.post("/api/explain", async (req, res) => {
    try {
      const { topic } = req.body;
      const prompt = `You are a SENAI Programming Mentor (Mentor TDAH). 
      Give a quick, gamified, and highly scannable explanation of the following topic for a student studying at night, focusing on high engagement, a real-world analogy, and a quick micro-challenge. 
      Topic: ${topic}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/review", async (req, res) => {
    try {
      const { topic } = req.body;
      const prompt = `You are a SENAI Programming Mentor. Generate exactly ONE quick, practical review question about the topic: "${topic}". The question should be direct and test active recall. Keep it under 2 sentences.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Chatbot mentor
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, useDeepThinking, searchGrounding } = req.body;
      
      const model = useDeepThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
      const config: any = {
        systemInstruction: "You are the 'Mentor TDAH da Madrugada para Programação' as specified in the AGENTS.md system prompt. Keep it short, actionable, and focused on quick dopamine hits."
      };

      if (useDeepThinking) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }
      
      const tools = [];
      if (searchGrounding && model === "gemini-3.5-flash") {
        tools.push({ googleSearch: {} });
      }
      
      if (tools.length > 0) {
        config.tools = tools;
      }

      // Convert messages to history format
      // Note: for chat session, it's easier to manually construct contents array or use ai.chats
      const contents = messages.map((m: any) => ({
        role: m.role, // 'user' or 'model'
        parts: [{ text: m.parts[0].text }],
      }));

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  const server = http.createServer(app);
  
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on("connection", async (clientWs) => {
    try {
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are a SENAI TDAH Mentor helping a student study late at night. Be extremely encouraging, speak in short sentences, and be practical.",
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio) clientWs.send(JSON.stringify({ audio }));
            if (message.serverContent?.interrupted)
              clientWs.send(JSON.stringify({ interrupted: true }));
          },
        },
      });

      clientWs.on("message", (data) => {
        try {
          const { audio } = JSON.parse(data.toString());
          if (audio) {
            session.sendRealtimeInput({
              audio: { data: audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch(e) { console.error(e); }
      });

      clientWs.on('close', () => {
         // handle close if needed
      });

    } catch (err) {
      console.error("Live API Connection error", err);
      clientWs.close();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
