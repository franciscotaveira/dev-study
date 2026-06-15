/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { curriculum } from './data/curriculum';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Target, Play, Pause, RotateCcw, Moon, Sun, Zap, Loader2, BrainCircuit, Trophy, Wind, X, Flame } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MentorChat from './components/MentorChat';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Local Storage Hooks
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function App() {
  const [completedItems, setCompletedItems] = useStickyState<string[]>([], 'senai-completed-items');
  const [activeItem, setActiveItem] = useStickyState<string | null>(null, 'senai-active-item');
  const [expandedModules, setExpandedModules] = useState<number[]>([0, 1]);
  const [isNightMode, setIsNightMode] = useState(false);
  
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewQuestion, setReviewQuestion] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewStatus, setReviewStatus] = useStickyState<Record<string, string>>({}, 'senai-review-status');
  const [microChallenges, setMicroChallenges] = useStickyState<Record<string, string>>({}, 'senai-micro-challenges');
  
  const [evaluatingItem, setEvaluatingItem] = useState<string | null>(null);
  const [evaluationExplanation, setEvaluationExplanation] = useState<string>('');

  const [streak, setStreak] = useStickyState<number>(0, 'senai-study-streak');
  const [lastStudyDate, setLastStudyDate] = useStickyState<string | null>(null, 'senai-last-study-date');

  const [dailyFocusDataRaw, setDailyFocusDataRaw] = useStickyState<Record<string, number>>({}, 'senai-daily-focus-raw');

  const [timeLeft, setTimeLeft] = useStickyState<number>(5 * 60, 'senai-time-left');
  const [isActive, setIsActive] = useStickyState<boolean>(false, 'senai-is-active');
  
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [showErgonomicsTip, setShowErgonomicsTip] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const ERGONOMICS_TIPS = [
    { title: "Postura de Sobrevivência", text: "Endireite as costas, relaxe os ombros e apoie os pés no chão." },
    { title: "Regra 20-20-20", text: "Olhe para algo a 6 metros de distância por 20 segundos para descansar a visão." },
    { title: "Respiração 4-7-8", text: "Inspire por 4s, segure por 7s, expire por 8s. Ajuda a focar." },
    { title: "Movimento Rápido", text: "Levante-se e dê uma pequena caminhada ou alongamento de 1 minuto." },
    { title: "Hidratação", text: "Beba um copo de água agora mesmo para manter o cérebro alerta." },
    { title: "Técnica: Body Doubling", text: "Trabalhar ao lado de alguém, mesmo virtualmente via 'Study with Me', ajuda a manter o foco em tarefas difíceis." },
    { title: "Mini-Blocos de Tempo", text: "Apenas 5 minutos. Não pense no resto da missão. Foque apenas no próximo checkpoint minúsculo." },
    { title: "Ruído de Fundo (White/Brown Noise)", text: "Sons contínuos ajudam a abafar distrações internas e ambientais para mentes aceleradas." }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      
      const today = new Date().toISOString().split('T')[0];
      if (lastStudyDate !== today) {
        const todayDate = new Date(today);
        const lastDate = lastStudyDate ? new Date(lastStudyDate) : null;
        
        if (lastDate) {
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            setStreak(prev => prev + 1);
          } else if (diffDays > 1) {
            setStreak(1);
          }
        } else {
          setStreak(1);
        }
        setLastStudyDate(today);
      } else if (streak === 0) {
        setStreak(1);
      }

      setDailyFocusDataRaw(prev => ({
        ...prev,
        [today]: (prev[today] || 0) + 5
      }));

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4ade80', '#2dd4bf', '#3b82f6']
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    let sessionInterval: NodeJS.Timeout | null = null;
    if (isActive) {
      sessionInterval = setInterval(() => {
        setActiveSessionSeconds(prev => {
          const newSeconds = prev + 1;
          // Trigger tip every 30 minutes (1800 seconds)
          if (newSeconds % 1800 === 0 && newSeconds > 0) {
            setCurrentTipIndex(i => (i + 1) % ERGONOMICS_TIPS.length);
            setShowErgonomicsTip(true);
          }
          return newSeconds;
        });
      }, 1000);
    }
    return () => {
      if (sessionInterval) clearInterval(sessionInterval);
    };
  }, [isActive]);

  const handleAttemptCompletion = (item: string) => {
    if (completedItems.includes(item)) {
      setCompletedItems(prev => prev.filter(i => i !== item));
    } else {
      setEvaluatingItem(item);
      setEvaluationExplanation('');
    }
  };

  const confirmEvaluation = () => {
    if (evaluatingItem) {
      setCompletedItems(prev => [...prev, evaluatingItem]);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#eab308', '#ec4899', '#14b8a6']
      });
      setEvaluatingItem(null);
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(5 * 60);
  };

  const startQuickReview = async () => {
    if (!activeItem) return;
    setIsReviewLoading(true);
    setIsReviewOpen(true);
    setReviewQuestion("");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeItem }),
      });
      const data = await res.json();
      setReviewQuestion(data.text);
    } catch(err) {
      console.error(err);
      setReviewQuestion("Erro ao carregar revisão. Tente novamente.");
    }
    setIsReviewLoading(false);
  };

  const startFocusAfterReview = () => {
    setIsReviewOpen(false);
    setReviewQuestion("");
    setIsActive(true);
    if (activeItem) {
      setReviewStatus(prev => ({
        ...prev,
        [activeItem]: new Date().toISOString().split('T')[0]
      }));
    }
  };

  useEffect(() => {
    // Cleanup invalid data from previous curriculums
    const allValidItems = curriculum.flatMap(c => c.items);
    
    setCompletedItems(prev => {
      const valid = prev.filter(i => allValidItems.includes(i));
      return valid.length !== prev.length ? valid : prev;
    });

    setActiveItem(prev => {
      if (prev && !allValidItems.includes(prev)) return null;
      return prev;
    });
  }, []);

  const totalItems = curriculum.reduce((acc, curr) => acc + curr.items.length, 0);
  const progressPercent = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;

  // Derive last 5 days of focus data
  const chartData = useMemo(() => {
    const today = new Date();
    const result = [];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const minutes = dailyFocusDataRaw[dateString] || 0;
      
      let name = days[d.getDay()];
      if (i === 0) name = 'Hoje';
      
      result.push({ name, minutes });
    }
    return result;
  }, [dailyFocusDataRaw]);

  return (
    <div className={cn("min-h-screen font-sans transition-colors duration-500", isNightMode ? "bg-black text-neutral-600" : "bg-neutral-950 text-neutral-300 selection:bg-indigo-500/30")}>
      
      {/* Peer Evaluation Modal */}
      <AnimatePresence>
        {evaluatingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEvaluatingItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn("relative w-full max-w-lg p-6 rounded-2xl border shadow-2xl overflow-hidden", isNightMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-950 border-neutral-800")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] pointer-events-none rounded-full" />
              <h2 className="text-xl font-bold text-white mb-2">Validação por Pares Simulado</h2>
              <p className={cn("text-sm mb-4", isNightMode ? "text-neutral-500" : "text-neutral-400")}>
                (Estilo École 42 & Técnica Feynman). Explique o conceito principal em suas palavras para consolidar a missão.
              </p>
               
              <div className={cn("mb-5 p-3 rounded-lg border text-xs leading-relaxed", isNightMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-500/5 border-indigo-500/10 text-indigo-400")}>
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  Dica para destravar:
                </span>
                Não sabe o que escrever? Tente completar a frase: <br/>
                "Na prática, isso serve para..."
              </div>

              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-2">Missão Atual</div>
                <div className={cn("p-3 rounded-lg text-sm border", isNightMode ? "bg-neutral-800/50 border-neutral-700/50 text-neutral-300" : "bg-neutral-900/50 border-neutral-800/80 text-neutral-200")}>
                  {evaluatingItem}
                </div>
              </div>

              <textarea 
                value={evaluationExplanation}
                onChange={(e) => setEvaluationExplanation(e.target.value)}
                placeholder="Exemplo: Este código faz um fetch na API e salva a resposta no estado..."
                className={cn("w-full h-28 rounded-xl p-4 text-sm focus:outline-none mb-6 resize-none transition-colors", isNightMode ? "bg-black border border-neutral-800 text-neutral-300 focus:border-neutral-700 placeholder:text-neutral-700" : "bg-neutral-900 border border-neutral-800 text-neutral-200 focus:border-indigo-500/50 placeholder:text-neutral-600")}
              />

              <div className="flex gap-3 justify-end relative z-10">
                <button 
                  onClick={() => setEvaluatingItem(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Ainda não sei
                </button>
                <button 
                  onClick={confirmEvaluation}
                  disabled={evaluationExplanation.trim().length < 5}
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white transition-colors"
                >
                  Validar Missão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ergonomics Tip Popup */}
      <AnimatePresence>
        {showErgonomicsTip && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 w-80 bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start justify-between mb-2 text-teal-400">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <h3 className="font-medium text-sm">{ERGONOMICS_TIPS[currentTipIndex].title}</h3>
              </div>
              <button 
                onClick={() => setShowErgonomicsTip(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              {ERGONOMICS_TIPS[currentTipIndex].text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Absolute Night Mode Exit */}
      {isNightMode && (
        <button 
          onClick={() => setIsNightMode(false)}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-900 bg-neutral-950 text-neutral-500 justify-center hover:text-neutral-300 hover:bg-neutral-900 transition-colors text-sm z-50"
        >
          <Sun className="w-4 h-4" /> Sair do Modo Madrugada
        </button>
      )}

      <div className={cn(
        "mx-auto transition-all duration-500 max-w-5xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12"
      )}>
        
        {/* Left Column - Tracker */}
        <div className={cn("lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500", isNightMode && "opacity-30 hover:opacity-100 transition-opacity duration-500 contrast-75 saturate-0")}>
          <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-medium tracking-tight text-white">Trilha de Estudos</h1>
                <button
                  onClick={() => setIsNightMode(true)}
                  className="p-3 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                  title="Ativar Modo Madrugada (Foco Extremo)"
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-neutral-500 mb-6">Desenvolvimento de Software SENAI. Foco noturno.</p>
              
              {/* Progress Bar */}
              <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-5 mb-8">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="font-medium text-neutral-300">Trilha de Missões Práticas</span>
                  <div className="flex items-center gap-2">
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={progressPercent}
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="text-indigo-400 font-bold"
                      >
                        {progressPercent}% 
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-indigo-400/60 font-medium">completo</span>
                  </div>
                </div>
                <div className={cn("h-2 w-full rounded-full overflow-hidden relative", isNightMode ? "bg-neutral-950" : "bg-neutral-800")}>
                  <motion.div 
                    className={cn("h-full relative", isNightMode ? "bg-neutral-800" : "bg-indigo-500")}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.8 }}
                  >
                    {!isNightMode && (
                       <motion.div
                         className="absolute inset-x-0 top-0 h-full bg-white/30"
                         initial={{ x: "-100%" }}
                         animate={{ x: "100%" }}
                         transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatDelay: 1 }}
                       />
                    )}
                  </motion.div>
                </div>
                <div className="mt-3 text-xs text-neutral-500 flex justify-between items-center">
                  <span>{completedItems.length} de {totalItems} missões concluídas</span>
                </div>
              </div>

              {/* Victory Gallery */}
              {completedItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Galeria de Vitórias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {completedItems.slice().reverse().slice(0, 5).map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/60 border border-neutral-800 rounded-lg text-xs"
                        >
                          <span className="text-neutral-300 truncate max-w-[150px]">{item}</span>
                        </motion.div>
                      ))}
                      {completedItems.length > 5 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center px-3 py-1.5 bg-neutral-900/30 border border-neutral-800/50 rounded-lg text-xs text-neutral-500 font-medium"
                        >
                          +{completedItems.length - 5}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Progress Chart and Streak */}
              <div className={cn("rounded-xl p-5 mb-8 relative overflow-hidden transition-colors duration-500", isNightMode ? "bg-black border border-neutral-900/50" : "bg-neutral-900/40 border border-neutral-800/50")}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-medium text-neutral-300">Minutos de Foco (Últimos Dias)</h3>
                  {streak > 0 && (
                    <div className={cn("flex items-center gap-1.5 border px-2.5 py-1 rounded-full", isNightMode ? "bg-neutral-900 border-neutral-800" : "bg-orange-500/10 border-orange-500/20")}>
                      <Flame className={cn("w-3.5 h-3.5", isNightMode ? "text-neutral-500 fill-neutral-500" : "text-orange-500 fill-orange-500")} />
                      <span className={cn("text-xs font-bold", isNightMode ? "text-neutral-500" : "text-orange-500")}>{streak} {streak === 1 ? 'Dia' : 'Dias'}</span>
                    </div>
                  )}
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#737373', fontSize: 12 }}
                        dy={10}
                      />
                      <Tooltip 
                        cursor={{ fill: '#262626' }}
                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#e5e5e5' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Bar 
                        dataKey="minutes" 
                        fill={isNightMode ? "#3f3f46" : "#6366f1"} 
                        radius={[4, 4, 0, 0]} 
                        name="Minutos"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-4">
            {curriculum.map((mod, modIdx) => (
              <div key={mod.title} className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 overflow-hidden">
                <button 
                  onClick={() => toggleModule(modIdx)}
                  className="w-full px-5 py-4 flex items-center justify-between bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors"
                >
                  <span className="font-medium text-neutral-200">{mod.title}</span>
                  {expandedModules.includes(modIdx) ? (
                    <ChevronDown className="w-5 h-5 text-neutral-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-neutral-500" />
                  )}
                </button>
                
                {expandedModules.includes(modIdx) && (
                  <div className="divide-y divide-neutral-800/40">
                    {mod.items.map((item) => {
                      const isCompleted = completedItems.includes(item);
                      const isActiveItem = activeItem === item;

                      return (
                        <motion.div 
                          layout="position"
                          key={item}
                          initial={false}
                          animate={isCompleted ? { backgroundColor: "rgba(99, 102, 241, 0.03)" } : { backgroundColor: "rgba(0, 0, 0, 0)" }}
                          transition={{ duration: 0.5 }}
                          className={cn(
                            "px-5 py-3 flex items-start gap-4 transition-colors group relative overflow-hidden",
                            isActiveItem && !isCompleted ? "bg-indigo-500/5" : "hover:bg-neutral-800/20"
                          )}
                        >
                          <AnimatePresence>
                            {isCompleted && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -100 }}
                                animate={{ opacity: [0, 1, 0], scale: 1, x: "100%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none z-0"
                              />
                            )}
                          </AnimatePresence>

                          <motion.button 
                            onClick={() => handleAttemptCompletion(item)}
                            whileTap={{ scale: 0.8 }}
                            className="mt-0.5 shrink-0 z-10 hover:text-indigo-400 transition-colors relative w-5 h-5 flex items-center justify-center"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {isCompleted ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                  animate={{ scale: [1.5, 1], opacity: 1, rotate: 0 }}
                                  exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                                  className="absolute text-indigo-500"
                                >
                                  <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="circle"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="absolute text-neutral-500"
                                >
                                  <Circle className="w-5 h-5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                          
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-4 relative group-hover:z-10">
                            <span className={cn(
                              "text-sm leading-relaxed transition-colors relative",
                              isCompleted ? "text-neutral-600" : "text-neutral-300",
                              isActiveItem && !isCompleted && "text-indigo-300 font-medium"
                            )}>
                              {item}
                              {isCompleted && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                  className="absolute left-0 top-1/2 -mt-px h-[1.5px] bg-neutral-600 origin-left pointer-events-none"
                                />
                              )}
                            </span>
                            
                            {!isCompleted && (
                              <button
                                onClick={() => setActiveItem(item)}
                                className={cn(
                                  "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all opacity-0 group-hover:opacity-100 focus:opacity-100",
                                  isActiveItem 
                                    ? "bg-indigo-500/20 text-indigo-300 opacity-100" 
                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                                )}
                              >
                                {isActiveItem ? 'Em foco' : 'Focar'}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Active Module & Timer */}
        <div className={cn(isNightMode ? "lg:col-span-5 animate-in zoom-in-95 fade-in duration-700" : "lg:col-span-5")}>
          <div className={cn("sticky top-12 space-y-6", isNightMode && "space-y-8")}>
            
            {/* Active Task Card */}
            <div className={cn("rounded-2xl border backdrop-blur-sm transition-colors", isNightMode ? "border-neutral-900 bg-neutral-950/40 p-8" : "border-indigo-500/20 bg-indigo-500/5 p-6")}>
              <div className={cn("flex items-center justify-between mb-4", isNightMode ? "text-neutral-600" : "text-indigo-400")}>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <h2 className="font-medium">Foco Atual</h2>
                </div>
                {activeItem && !isReviewOpen && (
                  <button 
                    onClick={startQuickReview}
                    className={cn("flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors", isNightMode ? "bg-neutral-900 text-neutral-500 hover:bg-neutral-800" : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20")}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" /> Revisão Rápida
                  </button>
                )}
              </div>
              
              {activeItem ? (
                <div>
                  {isReviewOpen ? (
                    <div className="animate-in fade-in duration-300">
                      <div className="flex items-start gap-3 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-5">
                        <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-neutral-300 mb-2">Desafio de Aquecimento:</div>
                          {isReviewLoading ? (
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <Loader2 className="w-4 h-4 animate-spin" /> Gerando pergunta...
                            </div>
                          ) : (
                            <p className="text-sm text-indigo-200 leading-relaxed">{reviewQuestion}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={startFocusAfterReview}
                        disabled={isReviewLoading}
                        className={cn("w-full flex justify-center items-center gap-2 py-3 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium rounded-xl transition-colors text-sm", isNightMode ? "bg-neutral-900 hover:bg-neutral-800" : "bg-indigo-500 hover:bg-indigo-600")}
                      >
                        <Play className="w-4 h-4 fill-current" /> Começar Foco de 5 Minutos
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <p className={cn("font-medium leading-snug", isNightMode ? "text-xl text-neutral-300" : "text-lg text-white")}>{activeItem}</p>
                        {reviewStatus[activeItem] === new Date().toISOString().split('T')[0] ? (
                          <span className={cn("shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border", isNightMode ? "bg-neutral-900 text-neutral-500 border-neutral-800" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20")}>
                            Revisado Hoje
                          </span>
                        ) : (
                          <span className={cn("shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border", isNightMode ? "bg-neutral-900 text-neutral-500 border-neutral-800" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20")}>
                            Pendente
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className={cn("text-sm font-medium", isNightMode ? "text-neutral-700" : "text-neutral-400")}>Micro-desafio:</div>
                        <textarea 
                          placeholder="Qual o próximo checkpoint pequeno?"
                          value={microChallenges[activeItem] || ''}
                          onChange={(e) => setMicroChallenges(prev => ({ ...prev, [activeItem]: e.target.value }))}
                          className={cn("w-full rounded-lg px-4 py-3 text-sm resize-none h-24 focus:outline-none transition-colors", isNightMode ? "bg-black border border-neutral-900 text-neutral-400 placeholder:text-neutral-800 focus:border-neutral-700" : "bg-neutral-900/50 border border-neutral-800 text-neutral-200 placeholder:text-neutral-600 focus:border-indigo-500/50")}
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className={cn("text-sm", isNightMode ? "text-neutral-700" : "text-neutral-500")}>
                  Selecione uma missão na trilha para definir seu foco e evitar distrações.
                </div>
              )}
            </div>

            {/* 5-Min Timer */}
            <div className={cn("rounded-2xl border p-6 transition-colors", isNightMode ? "border-neutral-900 bg-neutral-950/40 p-8" : "border-neutral-800 bg-neutral-900/20")}>
              <div className="text-center mb-6">
                <div className={cn("text-xs font-mono uppercase tracking-widest mb-1", isNightMode ? "text-neutral-700" : "text-neutral-500")}>Regra dos 5 Minutos</div>
                <div className={cn("text-5xl font-mono tracking-tight", isNightMode ? "text-neutral-400" : "text-white")}>{formatTime(timeLeft)}</div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isActive 
                      ? (isNightMode ? "bg-neutral-900 text-neutral-500" : "bg-neutral-800 hover:bg-neutral-700 text-white")
                      : (isNightMode ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200" : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20")
                  )}
                >
                  {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", isNightMode ? "bg-neutral-900 text-neutral-600 hover:bg-neutral-800" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white")}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Mentor Chat & Voice */}
            <MentorChat activeTopic={activeItem} isNightMode={isNightMode} />

          </div>
        </div>
        
      </div>
    </div>
  );
}

