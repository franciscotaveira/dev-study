import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LogEntry {
  id: string;
  timestamp: string;
  content: string;
  mood?: string;
}

const MOODS = [
  { emoji: '🚀', label: 'Inspirado' },
  { emoji: '🤓', label: 'Focado' },
  { emoji: '🙂', label: 'Tranquilo' },
  { emoji: '😴', label: 'Cansado' },
  { emoji: '🤯', label: 'Sobrecaregado' }
];

interface LogbookProps {
  isNightMode: boolean;
}

export default function Logbook({ isNightMode }: LogbookProps) {
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    try {
      const stored = localStorage.getItem('senai-logbook-entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('🤓');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('senai-logbook-entries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      content: newEntry.trim(),
      mood: selectedMood
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry('');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className={`mt-4 rounded-xl border transition-colors ${
      isNightMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className={`w-5 h-5 ${isNightMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`font-semibold ${isNightMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
            Diário de Bordo
          </h3>
          <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
            isNightMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
          }`}>
            {entries.length} registro{entries.length !== 1 ? 's' : ''}
          </span>
        </div>
        <Plus className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-45' : ''} ${
          isNightMode ? 'text-neutral-500' : 'text-neutral-400'
        }`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 border-t ${isNightMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <form onSubmit={handleAddEntry} className="mb-6">
                <div className="flex items-center gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
                  <span className={`text-xs font-medium mr-2 ${isNightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Como você está se sentindo?
                  </span>
                  {MOODS.map(m => (
                    <button
                      key={m.emoji}
                      type="button"
                      onClick={() => setSelectedMood(m.emoji)}
                      title={m.label}
                      className={`text-lg p-1.5 rounded-full transition-all ${
                        selectedMood === m.emoji 
                          ? (isNightMode ? 'bg-neutral-800 ring-2 ring-indigo-500/50' : 'bg-neutral-200 ring-2 ring-indigo-500/50') 
                          : 'opacity-60 hover:opacity-100 hover:scale-110'
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    placeholder="O que você aprendeu hoje? Ou o que te travou?"
                    className={`w-full p-4 pr-12 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors h-24 ${
                      isNightMode 
                        ? 'bg-neutral-950 text-neutral-300 placeholder-neutral-600 border-neutral-800' 
                        : 'bg-neutral-50 text-neutral-900 placeholder-neutral-400 border-neutral-300'
                    } border`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddEntry(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newEntry.trim()}
                    className={`absolute bottom-3 right-3 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isNightMode
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.length === 0 ? (
                  <div className={`text-center py-6 text-sm ${isNightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Nenhum registro ainda. Anote seus aprendizados para reforçar a memória!
                  </div>
                ) : (
                  entries.map(entry => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-sm group relative ${
                        isNightMode ? 'bg-neutral-950 text-neutral-300' : 'bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <div className={`flex items-center gap-2 mb-2 text-[10px] uppercase tracking-wider font-semibold ${
                        isNightMode ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(entry.timestamp), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                        </div>
                        {entry.mood && (
                          <span className="text-sm ml-auto" title="Humor do momento">{entry.mood}</span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap pr-8">{entry.content}</p>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-500/10 text-red-400 transition-all"
                        title="Apagar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
