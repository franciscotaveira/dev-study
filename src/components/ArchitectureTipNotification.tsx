import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, X, BookOpen, Zap, Compass, RefreshCw } from 'lucide-react';
import { ArchitectureTip } from '../hooks/useArchitectureTips';

interface ArchitectureTipNotificationProps {
  tip: ArchitectureTip | null;
  onDismiss: () => void;
  onTriggerRandom: () => void;
  isNightMode: boolean;
}

export function ArchitectureTipNotification({
  tip,
  onDismiss,
  onTriggerRandom,
  isNightMode
}: ArchitectureTipNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(30);

  // Reset timer whenever a new tip appears
  useEffect(() => {
    if (tip) {
      setTimeLeft(30);
    }
  }, [tip]);

  // Handle countdown
  useEffect(() => {
    if (!tip) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tip, onDismiss]);

  const percentage = (timeLeft / 30) * 100;

  const categoryColors = {
    'Arquitetura': 'text-purple-400 border-purple-500/20 bg-purple-500/10',
    'JavaScript': 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
    'TypeScript': 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    'Python': 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
  };

  return (
    <AnimatePresence>
      {tip && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(6px)', transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-[120] w-full max-w-sm overflow-hidden rounded-2xl border bg-neutral-900/95 backdrop-blur-md p-5 shadow-2xl transition-all border-neutral-800 text-neutral-200"
        >
          {/* Top category label & close */}
          <div className="flex items-center justify-between mb-3 font-mono">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${categoryColors[tip.category] || 'text-indigo-400'}`}>
              <Cpu className="w-3 h-3" />
              {tip.category}
            </span>
            
            <div className="flex items-center gap-2">
              {/* Manual Refresh Button for fun engagement */}
              <button
                onClick={onTriggerRandom}
                title="Próxima Dica"
                className="p-1 rounded-md text-neutral-500 hover:text-neutral-300 transition-colors hover:bg-neutral-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDismiss}
                className="p-1 rounded-md text-neutral-500 hover:text-neutral-300 transition-colors hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-neutral-100 mb-1.5 leading-snug tracking-tight font-sans flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 select-none animate-pulse" />
            {tip.title}
          </h4>

          {/* Content */}
          <p className="text-[11.5px] text-neutral-400 leading-relaxed mb-4 font-mono select-text">
            {tip.content}
          </p>

          {/* Bottom progress element */}
          <div className="space-y-1 font-mono">
            <div className="flex items-center justify-between text-[9px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-neutral-500" />
                Pílula de Engenharia
              </span>
              <span>Laranja em {timeLeft}s</span>
            </div>
            
            {/* The animated bar */}
            <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-linear"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
