import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Code2, Zap, BookOpen, TerminalSquare, Layers, Fingerprint, ChevronRight, ChevronLeft } from 'lucide-react';

interface ProTipsSidebarProps {
  isNightMode?: boolean;
}

const PRO_TIPS = [
  {
    category: "Architecture",
    icon: Layers,
    title: "Composition over Inheritance",
    text: "Prefira compor funções curtas e independentes a criar complexas cadeias de herança de classes. Em React, isso significa criar pequenos componentes fáceis de testar em vez de abstrações massivas.",
    snippet: "const Select = ({ children }) => <div className=\"select\">{children}</div>;"
  },
  {
    category: "TypeScript",
    icon: Fingerprint,
    title: "Utility Types Explicados",
    text: "Use Omit<T, K> para remover chaves de um tipo existente e Pick<T, K> para criar um novo com apenas propriedades específicas. Isso reduz duplicação de interfaces.",
    snippet: "type UserPreview = Pick<User, 'id' | 'name'>;"
  },
  {
    category: "Performance",
    icon: Zap,
    title: "Evite useEffect",
    text: "Muitos uses do useEffect são desnecessários. Se o valor pode ser calculado a partir das props durante a renderização, apenas faça a conta. Use useMemo() apenas se a operação for realmente pesada.",
    snippet: "const fullUrl = `${domain}${path}`; // Sem useEffect"
  },
  {
    category: "Clean Code",
    icon: BookOpen,
    title: "Early Return",
    text: "Para evitar o famoso 'Callback Hell' (aninhamento profundo com muitos 'if'), sempre cheque os cenários de erro antes e faça o retorno o mais cedo possível.",
    snippet: "if (!user) return <Login />;\nreturn <Dashboard />;"
  },
  {
    category: "Modern JS",
    icon: TerminalSquare,
    title: "Nullish Coalescing (??)",
    text: "Diferente do operador || (que considera false, 0 e string vazia como falsos), o operador ?? verifica estritamente apenas se o valor esquerdo é null ou undefined.",
    snippet: "const count = value ?? 10; // 0 continua sendo 0"
  },
  {
    category: "Design System",
    icon: Code2,
    title: "Utility Classes vs CSS",
    text: "Sistemas como Tailwind baseados em Atomic CSS geram bundles infinitamente menores e impedem que modificações em uma página quebrem silenciosamente outra.",
    snippet: "<div className=\"flex items-center p-4\" />"
  }
];

export function ProTipsSidebar({ isNightMode = true }: ProTipsSidebarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const DURATION_MS = 30000; // 30 seconds

  useEffect(() => {
    setProgress(0);
    if (isCollapsed) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % PRO_TIPS.length);
          return 0;
        }
        return prev + (100 / (DURATION_MS / 100)); // update progress every 100ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isCollapsed]);

  const currentTip = PRO_TIPS[currentIndex];
  const Icon = currentTip.icon;

  if (isCollapsed) {
    return (
      <div className={`hidden xl:flex w-16 shrink-0 border-l p-4 flex-col items-center sticky top-0 h-screen transition-colors duration-500 ${isNightMode ? 'bg-[#09090b]/90 border-neutral-900/60' : 'bg-neutral-50/95 border-neutral-200/80'}`}>
        <button 
          onClick={() => setIsCollapsed(false)}
          className={`p-2 rounded-lg mb-6 transition-colors ${isNightMode ? 'hover:bg-neutral-900 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'}`}
          title="Expand Pro-Tips"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className={`p-2 rounded-full mb-4 ${isNightMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
          <Lightbulb className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className={`hidden xl:flex w-72 shrink-0 border-l p-5 flex-col sticky top-0 h-screen transition-colors duration-500 overflow-y-auto custom-scrollbar ${isNightMode ? 'bg-[#09090b]/90 border-neutral-900/60' : 'bg-neutral-50/95 border-neutral-200/80'}`}>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-indigo-500">
          <Lightbulb className="w-5 h-5 animate-pulse" />
          <h3 className={`font-bold text-sm tracking-tight ${isNightMode ? 'text-white' : 'text-neutral-900'}`}>30-Sec Pro-Tips</h3>
        </div>
        <button 
          onClick={() => setIsCollapsed(true)}
          className={`p-1.5 rounded-lg transition-colors ${isNightMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-900' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200'}`}
          title="Collapse Pro-Tips"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
        Pequenas injeções de arquitetura e boas práticas para refinar seu código mental.
      </p>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className={`p-5 rounded-xl border ${isNightMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-1.5 rounded-md ${isNightMode ? 'bg-neutral-950 border border-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">{currentTip.category}</span>
            </div>

            <h4 className={`text-sm font-bold mb-3 ${isNightMode ? 'text-neutral-100' : 'text-neutral-800'}`}>{currentTip.title}</h4>
            <p className={`text-xs leading-relaxed mb-5 ${isNightMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {currentTip.text}
            </p>

            {currentTip.snippet && (
              <div className={`p-3 rounded-lg text-xs font-mono overflow-x-auto ${isNightMode ? 'bg-[#0f0f11] border border-neutral-800 text-indigo-300' : 'bg-neutral-900 text-indigo-300'}`}>
                <code>{currentTip.snippet}</code>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest mb-2 text-neutral-500">
          <span>Próxima Dica</span>
          <span>{Math.max(0, 30 - Math.floor(progress * 30 / 100))}s</span>
        </div>
        <div className={`h-1 w-full rounded-full overflow-hidden ${isNightMode ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
          <div 
            className="h-full bg-indigo-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-4 gap-2">
          <button 
            onClick={() => setCurrentIndex((idx) => (idx - 1 + PRO_TIPS.length) % PRO_TIPS.length)}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors ${isNightMode ? 'hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300' : 'hover:bg-neutral-200 text-neutral-500'}`}
          >
            Anterior
          </button>
          <button 
            onClick={() => setCurrentIndex((idx) => (idx + 1) % PRO_TIPS.length)}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors ${isNightMode ? 'hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300' : 'hover:bg-neutral-200 text-neutral-500'}`}
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  );
}
