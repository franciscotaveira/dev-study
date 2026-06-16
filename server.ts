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

function isQuotaError(e: any): boolean {
  const errStr = String(e?.message || e?.stack || JSON.stringify(e) || '').toLowerCase();
  return errStr.includes("429") || errStr.includes("quota") || errStr.includes("exhausted") || errStr.includes("rate_limit");
}

function getQuotaFriendlyResponse(actionType: 'explain' | 'review' | 'chat') {
  if (actionType === 'explain') {
    return {
      text: `## 🎮 Servidor de IA em Cooldown! (Cota Atingida Temporariamente)
      
## O que é
A API inteligente atingiu o limite máximo gratuito de requisições por minuto do Google. No TDAH, recarregar a bateria mental é essencial!

## Analogia rápida
Seu cérebro cozinhou depois de resolver blocos pesados de lógica e precisa respirar por 1 minutinho.

## Micro-desafio de 1 minuto
Afaste-se da tela por 60 segundos. Dê um gole de água e estique as costas.

## Checkpoint
Em 1 minuto a cota será redefinida. Clique para tentar falar com o mentor ou tentar de novo! Estarei te esperando.`
    };
  } else if (actionType === 'review') {
    return {
      text: `Epa! Nosso servidor de IA atingiu o limite de cota temporária (429). Faça uma micro-pausa de 1 minuto e tente novamente! Enquanto isso, responda mentalmente: Qual o papel de um arquivo index.html no navegador?`
    };
  } else {
    return {
      text: `## ☕ Micro-pausa de 1 Minuto do Mentor! (Limite da API atingido)

Muitas perguntas rápidas de madrugada! O Google ativou o sistema de "cooldown" automático de 60 segundos para evitar sobrecarga.

**Seu Desafio de Foco Ativo AGORA:**
1. Descanse a vista (olhe para longe por 20 segundos).
2. Beba um gole de água. Hidratação ajuda a reter conteúdo.
3. Quer continuar no gás? Escreva algumas tags no **CodeSandbox** logo à direita e veja o console!

Estarei pronto para debugar com você de novo em **60 segundos**! ⏳`
    };
  }
}

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
      if (isQuotaError(e)) {
        return res.json(getQuotaFriendlyResponse('explain'));
      }
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
      if (isQuotaError(e)) {
        return res.json(getQuotaFriendlyResponse('review'));
      }
      res.status(500).json({ error: e.message });
    }
  });

  // Chatbot mentor
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, useDeepThinking, searchGrounding } = req.body;
      
      const model = useDeepThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
      let systemInstruction = "You are the 'Mentor TDAH da Madrugada para Programação' as specified in the AGENTS.md system prompt. Keep it short, actionable, and focused on quick dopamine hits.";
      try {
        const agentsMd = require('fs').readFileSync(require('path').join(process.cwd(), 'AGENTS.md'), 'utf-8');
        systemInstruction = agentsMd;
      } catch(e) {}

      const config: any = {
        systemInstruction
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
      if (isQuotaError(e)) {
        return res.json(getQuotaFriendlyResponse('chat'));
      }
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/summary", async (req, res) => {
    try {
      const { logbookEntries, focusData } = req.body;
      const prompt = `You are a SENAI TDAH Mentor. Analyze the following study logbook entries and focus data for the past days.
Write a single, highly encouraging and personalized paragraph (max 4 sentences) praising the student's effort, highlighting any technical topics they learned, and ending with a motivational boost. Keep it concise.
Logbook: ${JSON.stringify(logbookEntries)}
Focus Data: ${JSON.stringify(focusData)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      if (isQuotaError(e)) {
         return res.json({ text: "O limite da API foi atingido temporariamente. Parabéns pelo seu esforço contínuo na trilha, continue codando forte e tente gerar o resumo novamente em alguns instantes! 🏆" });
      }
      res.status(500).json({ error: e.message });
    }
  });

  const server = http.createServer(app);
  
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on("connection", async (clientWs) => {
    try {
      let liveSystemInstruction = "You are a SENAI TDAH Mentor helping a student study late at night. Be extremely encouraging, speak in short sentences, and be practical.";
      try {
        const agentsMd = require('fs').readFileSync(require('path').join(process.cwd(), 'AGENTS.md'), 'utf-8');
        liveSystemInstruction = agentsMd + "\\n\\nIMPORTANT FOR VOICE: Keep answers under 3 short sentences. Be conversational.";
      } catch(e) {}
      
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: liveSystemInstruction,
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
