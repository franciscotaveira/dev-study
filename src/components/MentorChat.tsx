import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Mic, MicOff, Send, Lightbulb, Search, Loader2, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert audio helper
const pcmToBase64 = (channelData: Float32Array) => {
  const pcm16 = new Int16Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const buffer = new Uint8Array(pcm16.buffer);
  let binary = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
};

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function MentorChat({ activeTopic, isNightMode, isAutoFormatEnabled, onToggleAutoFormat, completedItems }: { activeTopic: string | null, isNightMode?: boolean, isAutoFormatEnabled?: boolean, onToggleAutoFormat?: () => void, completedItems?: string[] }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: 'Manda! Onde você travou?' }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [useHighThinking, setUseHighThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Dictation state
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const exportChatToPdf = async () => {
    if (!chatContainerRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(chatContainerRef.current, {
        backgroundColor: isNightMode ? '#000000' : '#171717',
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Resumo_Estudos_Mentor.pdf');
    } catch (error) {
      console.error("Failed to export PDF", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (isDictating) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsDictating(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    let finalTranscript = input ? input + ' ' : '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          setInput(finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
          setInput(finalTranscript + interimTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsDictating(false);
    };

    recognition.onend = () => {
      setIsDictating(false);
    };

    recognition.start();
    setIsDictating(true);
  };

  const explainTopic = async () => {
    if (!activeTopic) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: `Explique o tópico: "${activeTopic}" de forma rápida e prática.` }] }]);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: activeTopic })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  const feynmanTechnique = async () => {
    if (!activeTopic) return;
    setLoading(true);
    const userMsg = `Quero testar meu aprendizado usando a técnica de Feynman para o módulo: "${activeTopic}". Me dê um micro-desafio de código ou faça apenas UMA pergunta direta para ver se eu entendi. Não quero grandes explicações, apenas o desafio.`;
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', parts: [{ text: userMsg }] }],
          useHighThinking: false,
          useSearch: false
        })
      });
      if (!res.ok) {
        throw new Error('Server error');
      }
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder('utf-8');
      let botMsg = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                botMsg += data.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: 'model', parts: [{ text: botMsg }] };
                  return newMsgs;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch(err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Erro ao invocar técnica de feynman.' }] }]);
    }
    setLoading(false);
  };

  const sendMessage = async (customText?: string) => {
    const textToSend = typeof customText === 'string' ? customText : input;
    if (!textToSend.trim()) return;

    if (isDictating && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsDictating(false);
    }

    const newMsg: Message = { role: 'user', parts: [{ text: textToSend }] };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    if (!customText || typeof customText !== 'string') {
      setInput('');
    }
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          useDeepThinking: useHighThinking,
          searchGrounding: useSearch
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleSendEvent = (e: any) => {
      if (e.detail) {
        sendMessage(e.detail);
      }
    };
    window.addEventListener('send-to-mentor' as any, handleSendEvent);
    return () => {
      window.removeEventListener('send-to-mentor' as any, handleSendEvent);
    };
  }, [messages, useHighThinking, useSearch]);

  const startVoice = async () => {
    try {
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = inputAudioCtx;

      const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputAudioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = inputAudioCtx.createMediaStreamSource(stream);
      const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputAudioCtx.destination);

      nextStartTimeRef.current = 0;

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = async (event) => {
         // handle audio response
         const msg = JSON.parse(event.data);
         if (msg.audio) {
            const binary = atob(msg.audio);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const buffer = bytes.buffer;
            try {
              const audioData = await outputAudioCtx.decodeAudioData(buffer);
              const source = outputAudioCtx.createBufferSource();
              source.buffer = audioData;
              source.connect(outputAudioCtx.destination);
              
              if (nextStartTimeRef.current < outputAudioCtx.currentTime) {
                 nextStartTimeRef.current = outputAudioCtx.currentTime;
              }
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioData.duration;
            } catch(e) {
               console.error("Audio decode error", e);
            }
         }
         if (msg.interrupted) {
            nextStartTimeRef.current = 0; // simplistic interrupt handling
         }
      };

      setIsRecording(true);
    } catch(err) {
      console.error(err);
    }
  };

  const stopVoice = () => {
    if (processorRef.current) processorRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    if (wsRef.current) wsRef.current.close();
    setIsRecording(false);
  };

  const toggleVoiceMode = () => {
    if (mode === 'voice' && isRecording) {
      stopVoice();
    }
    setMode(mode === 'text' ? 'voice' : 'text');
  };

  return (
    <div className={cn("flex flex-col h-[400px] sm:h-[500px] rounded-2xl border backdrop-blur-sm overflow-hidden text-sm transition-colors duration-500", isNightMode ? "bg-black/20 border-neutral-900/50" : "bg-neutral-900/50 border-neutral-800")}>
      <div className={cn("p-4 border-b flex items-center justify-between transition-colors", isNightMode ? "border-neutral-900 bg-neutral-950 text-neutral-500" : "border-neutral-800 bg-neutral-900/80 text-neutral-200")}>
        <h3 className="font-semibold">Mentor IA</h3>
        <div className="flex items-center gap-2">
           <button 
             onClick={exportChatToPdf} 
             disabled={isExporting || messages.length <= 1}
             className={cn("p-1.5 rounded-md transition-colors", isExporting ? "opacity-50" : "text-neutral-500 hover:text-white")}
             title="Baixar Resumo PDF"
           >
             {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
           </button>
           <button onClick={toggleVoiceMode} className={cn("p-1.5 rounded-md transition-colors", mode === 'voice' ? "bg-indigo-500/20 text-indigo-400" : "text-neutral-500 hover:text-white")}>
             <Mic className="w-4 h-4" />
           </button>
        </div>
      </div>

      {mode === 'text' ? (
        <>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-2", m.role === 'user' ? "bg-indigo-600 text-white" : "bg-neutral-800 text-neutral-200")}>
                  {m.role === 'model' ? (
                    <div className="prose prose-invert prose-sm leading-relaxed max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5">
                      <Markdown>{m.parts[0].text}</Markdown>
                    </div>
                  ) : (
                    m.parts[0].text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 text-neutral-400 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ganhando contexto...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 bg-neutral-900/50 border-t border-neutral-800 flex flex-wrap gap-2">
            {activeTopic && (
              <>
                <button onClick={explainTopic} className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-colors flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                  Explique o tópico atual
                </button>
                <button onClick={feynmanTechnique} className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-colors flex items-center gap-1.5 border border-indigo-500/20">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                  Teste de Feynman (Ativo)
                </button>
              </>
            )}
            
            <button 
              onClick={() => {
                const items = completedItems?.length ? completedItems.join(", ") : "nenhum";
                sendMessage(`Analise meu progresso. Eu já concluí os seguintes tópicos/missões: ${items}. Baseado nisso e nos erros comuns que cometi, o que você sugere como próxima missão ou exercício foco para hoje de madrugada? Diga de forma direta seguindo seus princípios de redução de carga cognitiva.`)
              }} 
              className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-colors flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Sugerir Próxima Missão
            </button>
          </div>

          <div className={cn("p-3 border-t", isNightMode ? "bg-black/40 border-neutral-900/50" : "bg-neutral-900/80 border-neutral-800")}>
            <div className="mb-2 flex items-center gap-3 px-2">
               <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer hover:text-neutral-300">
                 <input type="checkbox" checked={useHighThinking} onChange={e => setUseHighThinking(e.target.checked)} className="rounded border-neutral-700 bg-neutral-800 text-indigo-500 focus:ring-offset-0 focus:ring-0" />
                 Pensamento profundo
               </label>
               <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer hover:text-neutral-300">
                 <input type="checkbox" checked={useSearch} onChange={e => setUseSearch(e.target.checked)} className="rounded border-neutral-700 bg-neutral-800 text-indigo-500 focus:ring-offset-0 focus:ring-0" />
                 Pesquisa web
               </label>
               <label title="O Mentor tentará organizar (lint/Prettier) automaticamente o seu código e indentação enquanto você digita no sandbox" className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer hover:text-neutral-300">
                 <input type="checkbox" checked={isAutoFormatEnabled} onChange={onToggleAutoFormat} className="rounded border-neutral-700 bg-neutral-800 text-indigo-500 focus:ring-offset-0 focus:ring-0" />
                 Mentor Linter
               </label>
            </div>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Qual o problema?"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className={cn("w-full border rounded-xl pl-4 pr-20 py-3 text-sm focus:outline-none transition-colors", isNightMode ? "bg-black border-neutral-900 text-neutral-500 placeholder-neutral-700 focus:border-neutral-800" : "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-indigo-500")}
                />
                <button
                  onClick={toggleDictation}
                  className={cn("absolute right-10 top-2 p-1.5 rounded-lg transition-colors", isDictating ? (isNightMode ? "bg-red-900/10 text-red-800" : "bg-red-500/20 text-red-500") : (isNightMode ? "text-neutral-700 hover:text-neutral-500" : "text-neutral-400 hover:text-white hover:bg-neutral-700"))}
                  title="Falar"
                >
                  {isDictating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className={cn("absolute right-2 top-2 p-1.5 text-white rounded-lg transition-colors", isNightMode ? "bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-950 text-neutral-500" : "bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-700")}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center relative">
             <div className={cn("absolute inset-0 rounded-full transition-all duration-1000", isRecording ? "bg-indigo-500/20 scale-125 animate-pulse" : "bg-transparent scale-100")} />
             <Mic className={cn("w-10 h-10 transition-colors z-10", isRecording ? "text-indigo-400" : "text-neutral-500")} />
          </div>
          <div>
            <p className="text-white font-medium mb-1">Conversa por voz</p>
            <p className="text-neutral-400 text-sm">Pratique conceitos falando diretamente comigo. Ideal pra momentos de cansaço visual.</p>
          </div>
          <button 
            onClick={isRecording ? stopVoice : startVoice}
            className={cn("px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-all", isRecording ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-500/20")}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isRecording ? "Encerrar conversa" : "Iniciar conversa"}
          </button>
        </div>
      )}
    </div>
  );
}
