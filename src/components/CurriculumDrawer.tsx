import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, X, BookOpen } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { Module } from '../data/curriculum';

interface CurriculumDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: Module[];
  expandedModules: number[];
  toggleModule: (idx: number) => void;
  completedItems: string[];
  activeItem: string | null;
  setActiveItem: (item: string) => void;
  handleAttemptCompletion: (item: string) => void;
  isNightMode: boolean;
}

export function CurriculumDrawer({
  isOpen,
  onClose,
  curriculum,
  expandedModules,
  toggleModule,
  completedItems,
  activeItem,
  setActiveItem,
  handleAttemptCompletion,
  isNightMode
}: CurriculumDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 w-[90vw] sm:w-[450px] z-50 shadow-2xl border-r overflow-y-auto custom-scrollbar flex flex-col",
              isNightMode ? "bg-[#09090b] border-neutral-800" : "bg-neutral-950 border-neutral-800"
            )}
          >
            <div className={cn("sticky top-0 z-10 flex items-center justify-between p-4 border-b border-neutral-800/80 backdrop-blur-md", isNightMode ? "bg-[#09090b]/90" : "bg-neutral-950/90")}>
              <div className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-lg">Roteiro de Aula</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
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
                              "px-3 sm:px-5 py-2.5 sm:py-3 flex items-start gap-3 sm:gap-4 transition-colors group relative overflow-hidden",
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
                                  onClick={() => {
                                    setActiveItem(item);
                                    if (window.innerWidth < 1024) {
                                      onClose();
                                    }
                                  }}
                                  className={cn(
                                    "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100",
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
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
