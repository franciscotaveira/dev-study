/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { curriculum } from './data/curriculum';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Target, Play, Pause, RotateCcw } from 'lucide-react';
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

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleItemCompletion = (item: string) => {
    setCompletedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column - Tracker */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Trilha de Estudos</h1>
            <p className="text-neutral-500 mb-6">Desenvolvimento de Software SENAI. Foco noturno.</p>
            
            {/* Progress Bar */}
            <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="font-medium text-neutral-300">Progresso do Curso</span>
                <span className="text-indigo-400 font-medium">{Math.round((completedItems.length / curriculum.reduce((acc, curr) => acc + curr.items.length, 0)) * 100) || 0}% completo</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.round((completedItems.length / curriculum.reduce((acc, curr) => acc + curr.items.length, 0)) * 100) || 0}%` }}
                />
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                {completedItems.length} de {curriculum.reduce((acc, curr) => acc + curr.items.length, 0)} aulas concluídas
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
                        <div 
                          key={item}
                          className={cn(
                            "px-5 py-3 flex items-start gap-4 transition-colors group",
                            isActiveItem ? "bg-indigo-500/5" : "hover:bg-neutral-800/20"
                          )}
                        >
                          <button 
                            onClick={() => toggleItemCompletion(item)}
                            className="mt-0.5 shrink-0 text-neutral-500 hover:text-indigo-400 transition-colors"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                            <span className={cn(
                              "text-sm leading-relaxed transition-colors",
                              isCompleted ? "text-neutral-600 line-through" : "text-neutral-300",
                              isActiveItem && !isCompleted && "text-indigo-300 font-medium"
                            )}>
                              {item}
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Active Module & Timer */}
        <div className="lg:col-span-5">
          <div className="sticky top-12 space-y-6">
            
            {/* Active Task Card */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Target className="w-5 h-5" />
                <h2 className="font-medium">Foco Atual</h2>
              </div>
              
              {activeItem ? (
                <div>
                  <p className="text-lg text-white font-medium leading-snug mb-6">{activeItem}</p>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-neutral-400">Micro-desafio:</div>
                    <textarea 
                      placeholder="Qual o próximo checkpoint pequeno?"
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500/50 resize-none h-24"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">
                  Selecione uma aula na trilha para definir seu foco e evitar distrações.
                </div>
              )}
            </div>

            {/* 5-Min Timer */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6">
              <div className="text-center mb-6">
                <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">Regra dos 5 Minutos</div>
                <div className="text-5xl font-mono text-white tracking-tight">{formatTime(timeLeft)}</div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-neutral-800 hover:bg-neutral-700 text-white" 
                      : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  )}
                >
                  {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Mentor Chat & Voice */}
            <MentorChat activeTopic={activeItem} />

          </div>
        </div>
        
      </div>
    </div>
  );
}

