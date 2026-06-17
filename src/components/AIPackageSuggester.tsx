import React, { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles, ExternalLink } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AIPackageSuggesterProps {
  selectedCurriculumId: string;
  isNightMode: boolean;
}

type Suggestion = {
  title: string;
  description: string;
  libraries: { name: string; url: string; description: string }[];
};

const SUGGESTIONS: Record<string, Suggestion> = {
  senai: {
    title: "Dica de IA para Front-end/Back-end",
    description: "Em trilhas tradicionais (HTML, CSS, JS, e POO), o foco é fundamentos. Depois de aprender o básico, as IAs sugerem experimentar frameworks modernos para ganhar produtividade.",
    libraries: [
      { name: "React", url: "https://react.dev", description: "O padrão da indústria para Front-end." },
      { name: "Vite", url: "https://vitejs.dev", description: "Ferramenta super rápida para iniciar projetos." },
      { name: "Tailwind CSS", url: "https://tailwindcss.com", description: "Estilização rápida diretamente no HTML." }
    ]
  },
  universal: {
    title: "Dica de IA para Full-stack TDAH",
    description: "Como a trilha universal engloba ponta a ponta focado em retenção, use ferramentas que reduzem a fricção visual e resolvem o boilerplate.",
    libraries: [
      { name: "Next.js", url: "https://nextjs.org", description: "Framework React completo (Front + Back)." },
      { name: "shadcn/ui", url: "https://ui.shadcn.com", description: "Componentes prontos para copiar e colar." },
      { name: "Prisma", url: "https://www.prisma.io", description: "Banco de dados sem stress mental." }
    ]
  },
  hiperfoco: {
    title: "Aceleradores de Dopamina (Python/Web)",
    description: "A trilha de hiperfoco prioriza vitórias rápidas. Estas bibliotecas permitem que você veja resultados rodando em menos de 5 minutos.",
    libraries: [
      { name: "FastAPI", url: "https://fastapi.tiangolo.com", description: "Crie APIs Python em 3 linhas de código." },
      { name: "Streamlit", url: "https://streamlit.io", description: "Crie interfaces de dados usando só Python." },
      { name: "Requests", url: "https://pypi.org/project/requests", description: "Bate-papo fácil com outras APIs." }
    ]
  },
  typescript: {
    title: "Poder do TypeScript Moderno",
    description: "TypeScript te impede de cometer erros básicos. Use as ferramentas do ecossistema que maximizam essa segurança e a produtividade.",
    libraries: [
      { name: "Zod", url: "https://zod.dev", description: "Validação extrema de dados TypeScript." },
      { name: "tRPC", url: "https://trpc.io", description: "APIs com Tipagem Total (sem necessidade de gerar schemas)." },
      { name: "Lucide Icons", url: "https://lucide.dev", description: "Ícones vetoriais modernos e leves." }
    ]
  },
  java: {
    title: "Arsenal do Arquiteto Java",
    description: "No desenvolvimento corporativo, Java brilha com ecossistemas consolidados e que rodam a internet. Potencialize seu backend:",
    libraries: [
      { name: "Spring Boot", url: "https://spring.io/projects/spring-boot", description: "Injeção de dependência e APIs automáticas." },
      { name: "Lombok", url: "https://projectlombok.org", description: "Corte centenas de linhas de código repetido (Getters, Setters)." },
      { name: "MapStruct", url: "https://mapstruct.org", description: "Mapeamento rápido de DTOs para Entidades." }
    ]
  },
  ai_engineering: {
    title: "Stack de Inteligência Artificial",
    description: "Você não precisa treinar modelos, você integra! Use o que o mercado adotou para orquestrar Agentes e RAG.",
    libraries: [
      { name: "LangChain", url: "https://js.langchain.com", description: "O maior canivete suíço para Engenharia de Prompts." },
      { name: "Model Context Protocol", url: "https://modelcontextprotocol.io", description: "Conecte IAs a ferramentas reais com MCP." },
      { name: "Vercel AI SDK", url: "https://sdk.vercel.ai", description: "Renderize React direto do output da IA." }
    ]
  }
};

export function AIPackageSuggester({ selectedCurriculumId, isNightMode }: AIPackageSuggesterProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Auto-cycle generic tips if we wanted, but here we just show the one for the track
  const suggestion = SUGGESTIONS[selectedCurriculumId] || SUGGESTIONS['universal'];

  return (
    <div className={cn("rounded-2xl border p-6 transition-colors overflow-hidden relative", isNightMode ? "border-indigo-900/50 bg-indigo-950/20" : "border-indigo-500/20 bg-indigo-50")}>
      
      {/* Visual flair */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 blur-3xl rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className={cn("font-medium", isNightMode ? "text-indigo-300" : "text-indigo-700")}>
            Copiloto IA: Sugestões
          </h2>
        </div>
        
        <p className={cn("text-xs mb-5 leading-relaxed", isNightMode ? "text-indigo-200/70" : "text-indigo-800/70")}>
          {suggestion.description}
        </p>

        <div className="space-y-3">
          {suggestion.libraries.map((lib, i) => (
            <a 
              key={i}
              href={lib.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col p-3 rounded-xl border transition-all hover:-translate-y-0.5", 
                isNightMode ? "bg-neutral-900 border-indigo-900/40 hover:border-indigo-500/50 hover:bg-neutral-800" : "bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn("font-medium text-sm", isNightMode ? "text-white" : "text-neutral-900")}>{lib.name}</span>
                <ExternalLink className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity", isNightMode ? "text-indigo-400" : "text-indigo-500")} />
              </div>
              <span className={cn("text-xs", isNightMode ? "text-neutral-400" : "text-neutral-500")}>{lib.description}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
