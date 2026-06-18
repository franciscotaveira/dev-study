import React, { useState } from 'react';
import { 
  Target, Award, X, Clock, Play, Pause, RotateCcw, 
  BrainCircuit, ClipboardList, Flame, Zap, Sparkles, BookOpen, ChevronRight, Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar 
} from 'recharts';
import CodeSandbox from './CodeSandbox';
import MentorChat from './MentorChat';
import Logbook from './Logbook';
import TechCareerRoadmap from './TechCareerRoadmap';
import { StudyStatsDashboard } from './StudyStatsDashboard';
import { AIPackageSuggester } from './AIPackageSuggester';
import { curriculums } from '../data/curriculum';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MicroTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface CurriculumModule {
  title: string;
  items: string[];
}

interface SaaSTabsAreaProps {
  activeSaaSTab: string;
  setActiveSaaSTab: (tab: any) => void;
  isNightMode: boolean;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  startQuickReview: () => void;
  isReviewLoading: boolean;
  microTasks: Record<string, MicroTask[]>;
  handleToggleMicroTask: (id: string) => void;
  handleDeleteMicroTask: (id: string) => void;
  newMicroTaskText: string;
  setNewMicroTaskText: (val: string) => void;
  handleAddMicroTask: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  timerDurationMinutes: number;
  handleTimerDurationChange: (minutes: number) => void;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  resetTimer: () => void;
  selectedCurriculumId: string;
  completedItems: string[];
  handleToggleSelectionOnly: (item: string) => void;
  progressPercent: number;
  curriculum: CurriculumModule[];
  expandedModules: number[];
  toggleModule: (index: number) => void;
  streak: number;
  totalFocusMinutes: number;
  focusGoalMinutes: number;
  sctecGoals: Record<string, boolean>;
  toggleSctecGoal: (goal: string) => void;
  dailyFocusDataRaw: any;
  shiftFocus: any;
  combatErrors: any;
  chartData: any;
  setCombatErrors: React.Dispatch<React.SetStateAction<any>>;
  isAutoFormatEnabled: boolean;
  setIsAutoFormatEnabled: (enabled: boolean) => void;
  setSelectedCurriculumId?: (id: string) => void;
  setCustomCurriculum?: (val: any) => void;
}

export default function SaaSTabsArea(props: SaaSTabsAreaProps) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const {
    activeSaaSTab,
    setActiveSaaSTab,
    isNightMode,
    activeItem,
    setActiveItem,
    startQuickReview,
    isReviewLoading,
    microTasks,
    handleToggleMicroTask,
    handleDeleteMicroTask,
    newMicroTaskText,
    setNewMicroTaskText,
    handleAddMicroTask,
    timerDurationMinutes,
    handleTimerDurationChange,
    timeLeft,
    formatTime,
    isActive,
    setIsActive,
    resetTimer,
    selectedCurriculumId,
    completedItems,
    handleToggleSelectionOnly,
    progressPercent,
    curriculum,
    expandedModules,
    toggleModule,
    streak,
    totalFocusMinutes,
    focusGoalMinutes,
    sctecGoals,
    toggleSctecGoal,
    dailyFocusDataRaw,
    shiftFocus,
    combatErrors,
    chartData,
    setCombatErrors,
    isAutoFormatEnabled,
    setIsAutoFormatEnabled,
    setSelectedCurriculumId,
    setCustomCurriculum
  } = props;

  return (
    <div className="space-y-8">
      {/* TAB 1: LABORATÓRIO PRÁTICO (IMERSÃO TOTAL) */}
      {activeSaaSTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
          {/* Painel Esquerdo de FOCO e CHECKPOINTS (4/12 colunas) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Sessão de Foco Única e Integrada */}
            <div className={cn("rounded-2xl border p-5 transition-all shadow-sm space-y-5", isNightMode ? "border-neutral-900 bg-neutral-950/20" : "border-neutral-800 bg-slate-900/10")}>
              
              {activeItem ? (
                <>
                  {/* Cabeçalho de Ciclo de Trabalho e Seleção de Tempo */}
                  <div className="border-b border-neutral-900/50 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-400 font-bold animate-pulse" />
                        <span className="font-bold text-neutral-200 text-[10px] uppercase tracking-wider font-mono">Modo Foco Ativo</span>
                      </div>
                      
                      {/* Seletor de Tempo Compacto */}
                      <div className="flex items-center gap-0.5 bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-850/60 font-mono">
                        {[5, 25, 45, 60].map(min => (
                          <button
                            key={min}
                            onClick={() => handleTimerDurationChange(min)}
                            className={cn(
                              "px-1.5 py-0.5 text-[9px] font-bold rounded transition-colors",
                              timerDurationMinutes === min
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 font-bold"
                                : "text-neutral-500 hover:text-neutral-300"
                            )}
                          >
                            {min}m
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cronômetro e Controles Inline */}
                    <div className="flex items-center justify-between bg-neutral-950/60 border border-neutral-900 p-3 rounded-xl mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-mono font-bold text-white select-none leading-none tracking-tight">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="flex items-center gap-1 border-l border-neutral-900/80 pl-3">
                          <button
                            onClick={() => setIsActive(!isActive)}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              isActive ? "text-amber-400 hover:bg-neutral-900" : "text-emerald-400 hover:bg-neutral-900"
                            )}
                            title={isActive ? "Pausar" : "Iniciar"}
                          >
                            {isActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          </button>
                          <button
                            onClick={resetTimer}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-colors"
                            title="Reiniciar"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={startQuickReview}
                        disabled={isReviewLoading}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all font-mono uppercase"
                      >
                        <Award className="w-3 h-3" /> REVER
                      </button>
                    </div>

                    {/* Meta Atual */}
                    <div>
                      <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mb-0.5">Lição Ativa</span>
                      <h4 className="text-neutral-200 text-xs font-semibold leading-relaxed">
                        {activeItem}
                      </h4>
                    </div>
                  </div>

                  {/* Listagem de Checkpoints Simplificada */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-neutral-400 font-mono">
                      <span>Progresso da Lição</span>
                      <span className="text-indigo-400">
                        {microTasks[activeItem]?.filter(t => t.completed).length || 0} / {microTasks[activeItem]?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {microTasks[activeItem]?.map((task) => (
                        <div 
                          key={task.id} 
                          className={cn(
                            "flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors select-none group border",
                            task.completed 
                              ? "bg-transparent border-transparent text-neutral-600" 
                              : "bg-neutral-900/10 border-neutral-900 text-neutral-300 hover:bg-neutral-900/30"
                          )}
                        >
                          <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                            <input 
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleMicroTask(task.id)}
                              className="w-3.5 h-3.5 rounded border-neutral-800 text-indigo-500 focus:ring-0 cursor-pointer bg-neutral-950 border shrink-0"
                            />
                            <span className={cn("text-xs leading-normal truncate", task.completed && "line-through text-neutral-600")}>
                              {task.text}
                            </span>
                          </label>
                          <button 
                            onClick={() => handleDeleteMicroTask(task.id)}
                            className="text-neutral-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-0.5 shrink-0"
                            title="Apagar checkpoint"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Adicionar checkpoint */}
                    <div>
                      <input 
                        type="text"
                        placeholder="+ Criar mini checkpoint (pressione Enter)"
                        value={newMicroTaskText}
                        onChange={(e) => setNewMicroTaskText(e.target.value)}
                        onKeyDown={handleAddMicroTask}
                        className="w-full bg-neutral-950/40 hover:bg-neutral-950 focus:bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 placeholder:text-neutral-700 focus:border-indigo-500/50 focus:outline-none transition-colors font-sans"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-neutral-500 italic leading-relaxed">
                    Selecione um tópico na Trilha de Estudos para habilitar seu Laboratório Inteligente!
                  </p>
                  <button
                    onClick={() => setActiveSaaSTab('curriculum')}
                    className="mt-3.5 px-3.5 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                  >
                    Ir para Trilha de Estudos
                  </button>
                </div>
              )}
            </div>

            {/* Gaveta de Sugestões de IA do Copiloto */}
            {activeItem && (
              <div className={cn(
                "rounded-xl border transition-colors overflow-hidden",
                isNightMode ? "border-neutral-900 bg-neutral-950/10" : "border-neutral-800 bg-slate-900/5"
              )}>
                <button
                  onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-neutral-900/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Sugestões do Copiloto</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-600 uppercase font-bold">
                    {isCopilotOpen ? "Ocultar" : "Mostrar"}
                  </span>
                </button>
                
                {isCopilotOpen && (
                  <div className="px-3.5 pb-3.5 border-t border-neutral-900/40 pt-1 animate-in fade-in duration-200">
                    <AIPackageSuggester 
                      selectedCurriculumId={selectedCurriculumId} 
                      isNightMode={isNightMode} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Painel Direito: CODE SANDBOX (8/12 colunas) */}
          <div className="lg:col-span-8 h-full min-h-[500px] flex flex-col">
            <div className="bg-neutral-900/30 border border-neutral-850 rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <CodeSandbox
                isNightMode={isNightMode}
                isAutoFormatEnabled={isAutoFormatEnabled}
                onSendToMentor={(codeMessage) => {
                  setActiveSaaSTab('chat');
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('send-to-mentor', { detail: codeMessage }));
                  }, 200);
                }}
                onSolvedBug={(category) => {
                  setCombatErrors(prev => ({
                    ...prev,
                    [category]: (prev[category] || 0) + 1
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENTOR INTELIGENTE / CONVERSA COM IA */}
      {activeSaaSTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
          {/* Lado Esquerdo: O Chat Inteligente (8 colunas) */}
          <div className="lg:col-span-8 flex flex-col h-[650px] bg-neutral-900/10 border border-neutral-800 rounded-2xl p-4 min-h-0">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-md mb-3 self-start border border-indigo-500/15 uppercase tracking-wider font-mono">
              Canal Direto com o Mentor Acadêmico
            </span>
            
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <MentorChat 
                 activeTopic={activeItem} 
                 isNightMode={isNightMode} 
                 isAutoFormatEnabled={isAutoFormatEnabled} 
                 onToggleAutoFormat={() => setIsAutoFormatEnabled(!isAutoFormatEnabled)} 
                 completedItems={completedItems}
              />
            </div>
          </div>

          {/* Lado Direito: Logbook ou Diário de Bordo para Registros Rápidos (4 colunas) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3 border-b border-neutral-900/50 pb-2.5">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wide">Autoconsolidação Feynman</h4>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal mb-3">
                Escrever o que aprendeu por escrito logo após a conclusão aumenta a retenção em mais de 75%!
              </p>
              <Logbook isNightMode={isNightMode} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRILHA DE ESTUDOS ACADÊMICA */}
      {activeSaaSTab === 'curriculum' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* SELETOR DE TRILHA INTERATIVO SEM FRICÇÃO */}
          <div className="bg-neutral-900/10 border border-neutral-900/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-900/50">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-neutral-100 text-xs uppercase tracking-wide">Qual é a sua Trilha de Estudos Ativa?</h4>
              <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 ml-auto uppercase">Mude a qualquer hora</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(curriculums).map((c) => {
                const isSelected = selectedCurriculumId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (setSelectedCurriculumId && setCustomCurriculum) {
                        setSelectedCurriculumId(c.id);
                        setCustomCurriculum(null);
                      }
                    }}
                    className={cn(
                      "text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between h-28 relative overflow-hidden group",
                      isSelected
                        ? "bg-indigo-600/10 border-indigo-500/55 ring-1 ring-indigo-500/30"
                        : "bg-neutral-950/40 border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/20"
                    )}
                  >
                    {/* Background glow decorator for active tab */}
                    {isSelected && (
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
                    )}
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{c.name}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />}
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-tight line-clamp-2">{c.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-900/50 w-full text-[9px] font-mono text-neutral-500">
                      <span>{c.modules.length} Módulos</span>
                      <span className={cn(
                        "font-bold uppercase tracking-wider",
                        isSelected ? "text-indigo-400" : "text-neutral-500 group-hover:text-neutral-400"
                      )}>
                        {isSelected ? "Ativa ✓" : "Selecionar ➔"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Coluna Esquerda: Listagem de Lições Integral (8 colunas) */}
            <div className="lg:col-span-8 space-y-4">
            <div className="bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-900">
                <div>
                  <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wide">Roteiro Inteiro de Aula</h4>
                  <p className="text-[10px] text-neutral-500 font-mono">Clique para focar em uma missão ou alternar seu foco atual</p>
                </div>
                
                {/* Percentual de Progresso */}
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-neutral-400 font-mono font-bold">Trilha Concluída:</span>
                  <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono text-[11px]">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Módulos do Currículo Inline */}
              <div className="space-y-3.5">
                {curriculum.map((mod, index) => {
                  const isExpanded = expandedModules.includes(index);
                  return (
                    <div key={index} className="border border-neutral-900 rounded-xl bg-neutral-950/20 overflow-hidden">
                      <button
                        onClick={() => toggleModule(index)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-950/60 hover:bg-neutral-900/30 transition-all font-bold text-xs"
                      >
                        <span className="text-neutral-200 flex items-center gap-2.5 text-left">
                          <span className="text-neutral-500 font-mono bg-neutral-900 p-1 rounded-md text-[9px] uppercase shrink-0">MOD {index + 1}</span>
                          <span className="font-bold truncate">{mod.title}</span>
                        </span>
                        <span className="text-neutral-500 text-[10px] uppercase font-bold font-mono shrink-0">
                          {isExpanded ? "Ocultar" : "Expandir"}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="p-3 bg-neutral-950/40 border-t border-neutral-900/60 divide-y divide-neutral-900/30">
                          {mod.items.map((item, itemIdx) => {
                            const isCompleted = completedItems.includes(item);
                            const isActiveLesson = activeItem === item;
                            return (
                              <div 
                                key={itemIdx}
                                className={cn(
                                  "flex items-center justify-between py-2 px-3 hover:bg-neutral-900/20 rounded-lg transition-colors border border-transparent mt-1 first:mt-0 gap-3",
                                  isActiveLesson ? "bg-indigo-500/5 border-indigo-500/20" : ""
                                )}
                              >
                                <div className="flex items-center gap-2.5 truncate flex-1 md:max-w-[400px]">
                                  <button
                                    onClick={() => handleToggleSelectionOnly(item)}
                                    className={cn(
                                      "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                                      isCompleted 
                                        ? "bg-emerald-500 text-white border-emerald-400" 
                                        : "border-neutral-800 bg-neutral-950"
                                    )}
                                  >
                                    {isCompleted && <span className="text-[10px]">✓</span>}
                                  </button>
                                  <span className={cn("text-xs font-medium truncate", isCompleted ? "text-neutral-500 line-through" : "text-neutral-300")}>
                                    {item}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2.5 shrink-0">
                                  {isActiveLesson && (
                                    <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded uppercase font-mono tracking-widest leading-none mr-2">
                                      FOCO ATIVO
                                    </span>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      setActiveItem(item);
                                      setActiveSaaSTab('chat');
                                      setTimeout(() => {
                                        window.dispatchEvent(new CustomEvent('study-topic', { detail: item }));
                                      }, 300);
                                    }}
                                    className="px-2.5 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm text-[10px] font-bold transition-all uppercase font-mono"
                                  >
                                    Estudar com Mentor
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveItem(item);
                                      setActiveSaaSTab('lab');
                                    }}
                                    className="px-2.5 py-1 rounded bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-[10px] font-bold transition-all uppercase font-mono"
                                  >
                                    Praticar
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Metas SCTEC / Carreira (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            {/* SCTEC Goal Progress */}
            <div className={cn("rounded-2xl border p-5 transition-colors", isNightMode ? "border-neutral-900 bg-neutral-950/20" : "border-neutral-800 bg-slate-900/10")}>
              <div className="flex items-center gap-2 mb-3 border-b border-neutral-900/50 pb-2.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wide">Processo de Reconhecimento</h4>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed mb-4">
                Mantenha sua performance alta cumprindo as metas regulares:
              </p>

              <div className="space-y-4">
                {/* Meta Diária de Foco */}
                <div className="pb-3 border-b border-neutral-900/60">
                  <label className="flex items-center justify-between text-xs mb-1.5 font-bold text-neutral-300">
                    <span>Meta Diária de Foco</span>
                    <span className="font-mono text-indigo-400">{Math.min(100, Math.round((totalFocusMinutes / focusGoalMinutes) * 100))}%</span>
                  </label>
                  <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/80 mb-2">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${Math.min(100, (totalFocusMinutes / focusGoalMinutes) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                    <span>Hoje: e-foco {totalFocusMinutes} min</span>
                    <span>Meta: {focusGoalMinutes} min</span>
                  </div>
                </div>

                {/* Outras Metas SCTEC */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleSctecGoal('assistir-videos')}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                        sctecGoals['assistir-videos'] ? "bg-emerald-500 text-white border-emerald-400" : "border-neutral-800 bg-neutral-950"
                      )}
                    >
                      {sctecGoals['assistir-videos'] && <span className="text-[10px]">✓</span>}
                    </button>
                    <span className={cn("text-xs leading-relaxed", sctecGoals['assistir-videos'] ? "text-neutral-500 line-through" : "text-neutral-400")}>
                      Participar de encontros / Gravar resumos
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleSctecGoal('desafio-extra')}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                        sctecGoals['desafio-extra'] ? "bg-emerald-500 text-white border-emerald-400" : "border-neutral-800 bg-neutral-950"
                      )}
                    >
                      {sctecGoals['desafio-extra'] && <span className="text-[10px]">✓</span>}
                    </button>
                    <span className={cn("text-xs leading-relaxed", sctecGoals['desafio-extra'] ? "text-neutral-500 line-through" : "text-neutral-400")}>
                      Resolver Desafio Sincronizado / Consertar Bugs
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleSctecGoal('avaliacao-regular')}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                        sctecGoals['avaliacao-regular'] ? "bg-emerald-500 text-white border-emerald-400" : "border-neutral-800 bg-neutral-950"
                      )}
                    >
                      {sctecGoals['avaliacao-regular'] && <span className="text-[10px]">✓</span>}
                    </button>
                    <span className={cn("text-xs leading-relaxed", sctecGoals['avaliacao-regular'] ? "text-neutral-500 line-through" : "text-neutral-400")}>
                      Submeter Projeto Técnico de Exercícios
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* TAB 4: ESTATÍSTICAS DE FOCO & MEDALHAS (Bento Dashboard) */}
      {activeSaaSTab === 'stats' && (
        <div className="space-y-6 pb-12 animate-in fade-in duration-300">
          {/* Visualizer Streak diário com Flame */}
          <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center shrink-0 text-xl text-orange-500 animate-pulse">
                🔥
              </div>
              <div>
                <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-widest font-mono">Consistência de Madrugada</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Você está conquistando sua autonomia de software degrau por degrau!</p>
              </div>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-400/20 px-3.5 py-2 rounded-xl text-orange-500 shrink-0 select-none">
                <Flame className="w-4 h-4 fill-current animate-bounce" />
                <span className="font-mono text-sm leading-none font-bold">Ofensiva: {streak} {streak === 1 ? 'Dia' : 'Dias'}</span>
              </div>
            )}
          </div>

          {/* Dashboard Avançado Completo - heatmap, radar, medalhas do Caçador de Bugs */}
          <div className="bg-neutral-900/10 border border-neutral-800/60 rounded-2xl p-5 shadow-sm">
            <StudyStatsDashboard 
              isNightMode={isNightMode} 
              dailyFocusData={dailyFocusDataRaw} 
              completedItems={completedItems} 
              shiftFocus={shiftFocus} 
              combatErrors={combatErrors} 
            />
          </div>

          {/* Gráfico de Progresso Histórico */}
          <div className={cn("rounded-2xl p-5 border relative overflow-hidden transition-colors", isNightMode ? "bg-black border-neutral-900/50" : "bg-neutral-900/40 border-neutral-800/50")}>
            <div className="flex items-center justify-between mb-4 border-b border-neutral-900/80 pb-3">
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Histórico de Foco (Minutos)</h3>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Desempenho Diário</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', color: '#e5e5e5', fontSize: '11px' }}
                    cursor={{ fill: isNightMode ? '#171717' : '#27272a' }}
                  />
                  <Bar dataKey="minutes" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CARREIRA TECH & ROADMAP */}
      {activeSaaSTab === 'career' && (
        <div className="animate-in fade-in duration-300">
          <TechCareerRoadmap
            isNightMode={isNightMode}
            completedItems={completedItems}
            onToggleItem={handleToggleSelectionOnly}
          />
        </div>
      )}
    </div>
  );
}
