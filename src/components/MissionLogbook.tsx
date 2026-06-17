import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Calendar, Clock, CheckCircle2, BookOpen } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MissionLogbookProps {
  completedItems: string[];
  completionTimes: Record<string, string>;
  missionTime: Record<string, number>;
  isNightMode: boolean;
}

export function MissionLogbook({ completedItems, completionTimes, missionTime, isNightMode }: MissionLogbookProps) {
  if (completedItems.length === 0) {
    return null; /* Don't show if nothing is completed */
  }

  // Sort completed items by completion time (newest first)
  const sortedItems = [...completedItems].sort((a, b) => {
    const timeA = new Date(completionTimes[a] || 0).getTime();
    const timeB = new Date(completionTimes[b] || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-12">
      <div className={cn(
        "rounded-2xl border p-6 transition-colors", 
        isNightMode ? "bg-neutral-950/40 border-neutral-900" : "bg-neutral-900/20 border-neutral-800"
      )}>
        <div className="flex items-center gap-3 mb-6 border-b border-neutral-800/60 pb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="font-medium text-white text-lg">Diário de Missões</h2>
            <p className={cn("text-xs mt-0.5", isNightMode ? "text-neutral-500" : "text-neutral-400")}>
              Histórico automático de missões concluídas e foco investido.
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {sortedItems.map((item, idx) => {
             const completedAt = completionTimes[item] ? new Date(completionTimes[item]).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Data desconhecida';
             const minutes = missionTime[item] || 0;

             return (
              <div 
                key={`${item}-${idx}`}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-colors",
                  isNightMode ? "bg-neutral-900/50 border-neutral-800/50" : "bg-neutral-900 border-neutral-800"
                )}
              >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center">
                     <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-white line-clamp-1">{item}</h3>
                     <div className="flex items-center gap-3 mt-1">
                       <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                         <Calendar className="w-3 h-3" /> {completedAt}
                       </div>
                       {minutes > 0 && (
                         <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
                           <Clock className="w-3 h-3" /> {(minutes / 60).toFixed(1)}h
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
