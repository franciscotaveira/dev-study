import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, YAxis } from 'recharts';
import { Clock, Code2, Moon, Sun, Sunrise, BugOff, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StudyStatsDashboardProps {
  isNightMode?: boolean;
  dailyFocusData?: Record<string, number>;
  completedItems?: string[];
  shiftFocus?: Record<string, number>;
  combatErrors?: Record<string, number>;
}

export function StudyStatsDashboard({ 
  isNightMode, 
  dailyFocusData = {},
  completedItems = [],
  shiftFocus = { manha: 0, tarde: 0, madrugada: 0 },
  combatErrors = { 'Tags Órfãs': 0, 'Sintaxe JS': 0, 'Tipografia CSS': 0, 'Indentação': 0 }
}: StudyStatsDashboardProps) {
  
  const shiftFocusData = shiftFocus || { manha: 0, tarde: 0, madrugada: 0 };
  const shiftData = [
    { name: 'Manhã', value: shiftFocusData.manha || 0, icon: <Sunrise className="w-4 h-4 text-amber-500" /> },
    { name: 'Tarde', value: shiftFocusData.tarde || 0, icon: <Sun className="w-4 h-4 text-orange-500" /> },
    { name: 'Madrugada', value: shiftFocusData.madrugada || 0, icon: <Moon className="w-4 h-4 text-indigo-500" /> }
  ];

  const totalShiftMinutes = shiftData.reduce((acc, curr) => acc + curr.value, 0);

  // Colors for shifts
  const shiftColors = isNightMode 
    ? ['#b45309', '#c2410c', '#3730a3'] 
    : ['#f59e0b', '#f97316', '#6366f1'];

  // Language stats based strictly on completed missions with 0 offset
  const htmlMissions = completedItems.filter(item => {
    const s = item.toLowerCase();
    return s.includes('html') || s.includes('web') || s.includes('estrutur') || s.includes('onboarding') || s.includes('boas-vindas');
  }).length;

  const cssMissions = completedItems.filter(item => {
    const s = item.toLowerCase();
    return s.includes('css') || s.includes('estiliza') || s.includes('seletor') || s.includes('box model') || s.includes('layout') || s.includes('flexbox') || s.includes('responsiv');
  }).length;

  const jsMissions = completedItems.filter(item => {
    const s = item.toLowerCase();
    return s.includes('js') || s.includes('lógica') || s.includes('switch') || s.includes('array') || s.includes('laço') || s.includes('repeti') || s.includes('funç') || s.includes('dom');
  }).length;

  const nodeMissions = completedItems.filter(item => {
    const s = item.toLowerCase();
    return s.includes('node') || s.includes('npm') || s.includes('express') || s.includes('servidor') || s.includes('mvc') || s.includes('responsabilidade');
  }).length;

  const sqlMissions = completedItems.filter(item => {
    const s = item.toLowerCase();
    return s.includes('banco') || s.includes('sql') || s.includes('nosql') || s.includes('crud') || s.includes('autentica') || s.includes('segurança') || s.includes('boss fight');
  }).length;

  const totalMissionsCount = htmlMissions + cssMissions + jsMissions + nodeMissions + sqlMissions;

  const radarData = [
    { subject: 'HTML', A: Math.min(100, htmlMissions * 15), fullMark: 100 },
    { subject: 'CSS', A: Math.min(100, cssMissions * 15), fullMark: 100 },
    { subject: 'JS', A: Math.min(100, jsMissions * 15), fullMark: 100 },
    { subject: 'Node', A: Math.min(100, nodeMissions * 15), fullMark: 100 },
    { subject: 'Banco', A: Math.min(100, sqlMissions * 15), fullMark: 100 },
  ];

  const currentCombatErrors = combatErrors || { 'Tags Órfãs': 0, 'Sintaxe JS': 0, 'Tipografia CSS': 0, 'Indentação': 0 };
  const errorsData = [
    { name: 'Tags Órfãs', value: currentCombatErrors['Tags Órfãs'] || 0 },
    { name: 'Sintaxe JS', value: currentCombatErrors['Sintaxe JS'] || 0 },
    { name: 'Tipografia CSS', value: currentCombatErrors['Tipografia CSS'] || 0 },
    { name: 'Indentação', value: currentCombatErrors['Indentação'] || 0 },
  ];

  const totalCombatErrors = Object.values(currentCombatErrors).reduce((a, b) => a + b, 0);

  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);
  const [weeklySummary, setWeeklySummary] = React.useState<string | null>(null);

  const handleGenerateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const storedLogbook = localStorage.getItem('senai-logbook-entries');
      const logbookEntries = storedLogbook ? JSON.parse(storedLogbook) : [];
      
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logbookEntries: logbookEntries.slice(0, 10), // Send last 10 entries to save tokens
          focusData: dailyFocusData,
          completedMissionsCount: completedItems.length
        })
      });
      const data = await res.json();
      if (data.text) {
        setWeeklySummary(data.text);
      }
    } catch (e) {
      console.error(e);
      setWeeklySummary("Não foi possível gerar o resumo agora. Continue focado!");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const last30Days = useMemo(() => {
    const days = [];
    const today = new Date();
    // Pre-calculate 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const minutes = dailyFocusData?.[dateString] || 0;
      days.push({
        date: dateString,
        minutes: minutes,
        metGoal: minutes >= 25, // Goal is 25 minutes (1 pomodoro)
        isToday: i === 0
      });
    }
    return days;
  }, [dailyFocusData]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 29; i >= 0; i--) {
      if (last30Days[i].metGoal) {
        streak++;
      } else if (i !== 29) { // If it's not today and didn't meet goal, streak breaks
        break;
      }
    }
    return streak;
  }, [last30Days]);

  return (
    <>
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", isNightMode && "opacity-30 hover:opacity-100 transition-opacity duration-500 contrast-75 saturate-0")}>
      
      {/* Shifts Breakdown */}
      <div className={cn("rounded-xl p-5 border flex flex-col justify-between", isNightMode ? "bg-black border-neutral-900/50" : "bg-neutral-900/40 border-neutral-800/50")}>
        <div className="flex items-center gap-2 mb-4">
           <Clock className="w-4 h-4 text-neutral-400" />
           <h3 className="text-sm font-bold text-neutral-300">Foco por Turno</h3>
        </div>
        
        {totalShiftMinutes === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
            <p className="text-xs text-neutral-500 font-mono italic max-w-[200px]">Nenhum minuto focado hoje de madrugada. Inicie o pomodoro para registrar!</p>
          </div>
        ) : (
          <div className="flex items-center">
              <div className="h-40 w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shiftData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {shiftData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={shiftColors[index % shiftColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#e5e5e5', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {shiftData.map((s, i) => (
                   <div key={s.name} className="flex items-center gap-2 text-xs">
                      <span className="shrink-0">{s.icon}</span>
                      <span className="text-neutral-400 flex-1">{s.name}</span>
                      <span className="font-bold text-neutral-200">{s.value} min</span>
                   </div>
                ))}
              </div>
          </div>
        )}
      </div>

      {/* Language Radars */}
      <div className={cn("rounded-xl p-5 border flex flex-col justify-between", isNightMode ? "bg-black border-neutral-900/50" : "bg-neutral-900/40 border-neutral-800/50")}>
        <div className="flex items-center gap-2 mb-4">
           <Code2 className="w-4 h-4 text-neutral-400" />
           <h3 className="text-sm font-bold text-neutral-300">Média p/ Linguagem</h3>
        </div>
        
        {totalMissionsCount === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
            <p className="text-xs text-neutral-500 font-mono italic max-w-[200px]">Conclua missões no menu lateral para ativar seu diagrama de habilidades!</p>
          </div>
        ) : (
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke={isNightMode ? "#27272a" : "#404040"} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10 }} />
                <Radar name="Experiência Acumulada" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#e5e5e5', fontSize: '12px' }}
                   itemStyle={{ color: '#818cf8' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Common Errors Log */}
      <div className={cn("rounded-xl p-5 border flex flex-col justify-between", isNightMode ? "bg-black border-neutral-900/50" : "bg-neutral-900/40 border-neutral-800/50")}>
        <div className="flex items-center gap-2 mb-4">
           <BugOff className="w-4 h-4 text-emerald-500" />
           <h3 className="text-sm font-bold text-neutral-300">Erros Combatidos</h3>
        </div>
        
        {totalCombatErrors === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
            <p className="text-xs text-neutral-500 font-mono italic max-w-[200px]">Nenhum bug resolvido no laboratório. Resolva desafios no CodeSandbox para computar!</p>
          </div>
        ) : (
          <div className="h-40 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={85} tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#e5e5e5', fontSize: '12px' }}
                   cursor={{ fill: isNightMode ? '#27272a' : '#404040' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>

    {/* Study Streak Calendar */}
    <div className={cn("rounded-xl p-5 border mb-8", isNightMode ? "bg-black border-neutral-900/50" : "bg-neutral-900/40 border-neutral-800/50")}>
       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-neutral-200">Calendário de Foco (30 dias)</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span>Sequência atual:</span>
              <span className="font-bold text-emerald-400">{currentStreak} {currentStreak === 1 ? 'dia' : 'dias'} 🔥</span>
            </div>
            <button
               onClick={handleGenerateSummary}
               disabled={isGeneratingSummary}
               className={cn(
                 "text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-50",
                 isNightMode 
                   ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20" 
                   : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50"
               )}
            >
              {isGeneratingSummary ? (
                 <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>✨</span>
              )}
              Mentoria
            </button>
          </div>
       </div>

       {weeklySummary && (
          <div className={cn("mb-6 p-5 rounded-xl border flex flex-col gap-3", isNightMode ? "bg-indigo-900/10 border-indigo-500/20 text-indigo-100" : "bg-indigo-50 border-indigo-100 text-indigo-900")}>
             <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📊</span>
                <h4 className="font-bold text-lg">Relatório Semanal de Foco</h4>
             </div>
             <div className={cn("prose prose-sm max-w-none opacity-90 overflow-hidden", isNightMode ? "prose-invert" : "")}>
                <Markdown>{weeklySummary}</Markdown>
             </div>
          </div>
       )}

       <div className="flex flex-wrap gap-2">
         {last30Days.map((day, idx) => (
           <div 
             key={day.date}
             title={`${day.date}: ${day.minutes} min`}
             className={cn(
               "w-6 h-6 sm:w-8 sm:h-8 rounded-sm sm:rounded-md transition-all duration-300",
               day.metGoal 
                  ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-emerald-400/50" 
                  : (day.minutes > 0 ? "bg-emerald-900/40 border border-emerald-800/50" : (isNightMode ? "bg-neutral-900 border border-neutral-800/50" : "bg-neutral-800 border border-neutral-700/50")),
               day.isToday && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-black"
             )}
           />
         ))}
       </div>
    </div>
    </>
  );
}
