import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, ChevronRight, Target, Code, BrainCircuit, Rocket, Trophy, Lock, CheckCircle2, Circle, Github, GitCommit, GitPullRequest, RefreshCw, AlertCircle, Check, ExternalLink, Moon } from 'lucide-react';

interface TechCareerRoadmapProps {
  completedItems: string[];
  isNightMode?: boolean;
  onToggleItem?: (item: string) => void;
}

const SENIORITY_LEVELS = [
  { 
    id: 'trainee', 
    title: 'Estagiário / Trainee', 
    missionsReq: 0, 
    icon: Code,
    color: 'text-neutral-400',
    bg: 'bg-neutral-500/10',
    border: 'border-neutral-500/20',
    desc: 'O começo da jornada. Foco em lógica, HTML, CSS e curiosidade.'
  },
  { 
    id: 'junior', 
    title: 'Desenvolvedor Júnior', 
    missionsReq: 3, 
    icon: Rocket,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    desc: 'Entregando features com supervisão. Domina JavaScript e começa React/Back-End.'
  },
  { 
    id: 'pleno', 
    title: 'Desenvolvedor Pleno', 
    missionsReq: 6, 
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    desc: 'Autonomia para resolver problemas pontuais. Conhece banco de dados e APIs sólidas.'
  },
  { 
    id: 'senior', 
    title: 'Desenvolvedor Sênior', 
    missionsReq: 10, 
    icon: Briefcase,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    desc: 'Liderança técnica, arquitetura escalável e capacidade de orquestrar sistemas.'
  },
  { 
    id: 'ai-architect', 
    title: 'Engenheiro de IA Aplicada', 
    missionsReq: 15, 
    icon: BrainCircuit,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    desc: 'Integra LLMs, RAG e Agentes Autônomos em sistemas reais. O topo da pirâmide atual.'
  }
];

const POS_GRADUATION_SYLLABUS = [
  {
    module: "1ª Fase: Caixa de Ferramentas e Fundamentos",
    items: [
      "Fundamentos de IA e Visão Geral de LLMs",
      "IA no dia a dia: Ferramentas para UX & UI",
      "Acelerando Infraestrutura: IA para DevOps",
      "Acelerando Processos: IA para Gestão de Projetos"
    ]
  },
  {
    module: "2ª Fase: Orquestração e Contexto",
    items: [
      "Chamadas de APIs Generativas na Prática",
      "Mestrado em Prompt Engineering e Few-Shot",
      "Dominando o Model Context Protocol (MCP)",
      "Arquitetura de Sistemas Híbridos com IA"
    ]
  },
  {
    module: "3ª Fase: Autonomia e Especialização",
    items: [
      "Desenvolvimento de Agentes Autônomos",
      "Processamento de Dados RAG Avançado",
      "Técnicas de Fine-Tuning e Otimização de Modelos",
      "Segurança, Governança e Ética em IA"
    ]
  },
  {
    module: "Fase Final: O Engenheiro de Elite",
    items: [
      "Deploy de Soluções com LLMs",
      "Projeto Integrador – Capstone Project",
      "Mentoria: Carreira e Entrevistas de Alta Renda"
    ]
  }
];

export default function TechCareerRoadmap({ completedItems, isNightMode = true, onToggleItem }: TechCareerRoadmapProps) {
  const completedCount = completedItems.length;

  const [githubUser, setGithubUser] = React.useState<string>(() => {
    return localStorage.getItem('senai-github-user') || '';
  });
  const [inputValue, setInputValue] = React.useState('');
  const [commits, setCommits] = React.useState<any[]>(() => {
    const cached = localStorage.getItem('senai-github-commits-cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [syncSuccess, setSyncSuccess] = React.useState(false);

  // Automatically fetch on mount if client has user but no cached commits
  React.useEffect(() => {
    if (githubUser && commits.length === 0) {
      fetchGithubCommits(githubUser);
    }
  }, [githubUser]);

  const fetchGithubCommits = async (username: string) => {
    const targetUser = username.trim();
    if (!targetUser) return;
    setIsLoading(true);
    setErrorMsg('');
    setSyncSuccess(false);
    try {
      let cleanUsername = targetUser;
      if (cleanUsername.includes('github.com/')) {
        const parts = cleanUsername.split('github.com/');
        if (parts[1]) {
          cleanUsername = parts[1].split('/')[0];
        }
      }
      cleanUsername = cleanUsername.replace(/[^a-zA-Z0-9-]/g, '');

      if (!cleanUsername) {
        throw new Error('Nome de usuário inválido.');
      }

      const response = await fetch(`https://api.github.com/users/${cleanUsername}/events`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuário do GitHub não encontrado. Verifique se o perfil existe.');
        } else if (response.status === 403) {
          throw new Error('Limite de uso da API do GitHub atingido temporariamente. Tente novamente mais tarde.');
        } else {
          throw new Error('Erro ao conectar com a API do GitHub.');
        }
      }
      const data = await response.json();
      
      const pushEvents = data.filter((event: any) => event.type === 'PushEvent');
      const parsedCommits: any[] = [];
      
      pushEvents.forEach((event: any) => {
        const repoName = event.repo.name;
        const createdAt = event.created_at;
        if (event.payload && event.payload.commits) {
          event.payload.commits.forEach((commit: any) => {
            parsedCommits.push({
              sha: commit.sha.substring(0, 7),
              message: commit.message,
              repoName,
              date: createdAt,
            });
          });
        }
      });

      setCommits(parsedCommits);
      localStorage.setItem('senai-github-commits-cache', JSON.stringify(parsedCommits));
      setGithubUser(cleanUsername);
      localStorage.setItem('senai-github-user', cleanUsername);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Houve um erro na integração.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setGithubUser('');
    setInputValue('');
    setCommits([]);
    localStorage.removeItem('senai-github-user');
    localStorage.removeItem('senai-github-commits-cache');
  };

  const isCommitAtNight = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const hours = d.getHours();
      return hours >= 0 && hours <= 6;
    } catch (e) {
      return false;
    }
  };

  // Calculate stats based on commits
  const totalCommitsCount = commits.length;
  const nightCommitsCount = commits.filter(c => isCommitAtNight(c.date)).length;
  const calculatedXP = (totalCommitsCount * 15) + (nightCommitsCount * 30);

  let currentIndex = 0;
  for (let i = 0; i < SENIORITY_LEVELS.length; i++) {
    if (completedCount >= SENIORITY_LEVELS[i].missionsReq) {
      currentIndex = i;
    }
  }
  
  const currentLevel = SENIORITY_LEVELS[currentIndex];
  const nextLevel = SENIORITY_LEVELS[currentIndex + 1];

  let nextLevelProgress = 100;
  if (nextLevel) {
    const missionsInCurrentBracket = completedCount - currentLevel.missionsReq;
    const missionsNeededForNextBracket = nextLevel.missionsReq - currentLevel.missionsReq;
    nextLevelProgress = Math.min(100, (missionsInCurrentBracket / missionsNeededForNextBracket) * 100);
  }

  // Calculate AI syllabus progress
  const totalAIItems = POS_GRADUATION_SYLLABUS.reduce((acc, mod) => acc + mod.items.length, 0);
  const completedAIItems = POS_GRADUATION_SYLLABUS.reduce((acc, mod) => {
    return acc + mod.items.filter(i => completedItems.includes(i)).length;
  }, 0);
  const aiProgressPercent = Math.round((completedAIItems / totalAIItems) * 100);

  return (
    <div className={`p-6 rounded-lg ${isNightMode ? 'bg-[#111] text-neutral-200' : 'bg-white text-neutral-800'}`}>
      <div className="flex items-center gap-3 mb-6 border-b pb-4 border-neutral-800/50">
        <div className={`p-2 rounded-lg ${isNightMode ? 'bg-[#1a1a1a]' : 'bg-neutral-100'}`}>
          <Briefcase className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className={`font-semibold ${isNightMode ? 'text-white' : 'text-neutral-900'}`}>
            Roadmap de Carreira Tech
          </h2>
          <p className="text-xs text-neutral-500">Do primeiro código a Engenheiro de IA Aplicada</p>
        </div>
      </div>

      {/* REPOSITÓRIO PESSOAL & FEED GITHUB */}
      <div className={`mb-8 p-5 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${isNightMode ? 'bg-neutral-950 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-800/20">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-md ${isNightMode ? 'bg-neutral-900' : 'bg-neutral-200'} text-indigo-400`}>
              <Github className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-200 flex items-center gap-1.5">
                Vincular Repositório Pessoal <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest font-mono">Bônus de Trilha</span>
              </h3>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-mono mt-0.5">
                Utilize commits reais do GitHub como combustível de progresso e XP adicional madrugada adentro
              </p>
            </div>
          </div>

          {githubUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchGithubCommits(githubUser)}
                disabled={isLoading}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  syncSuccess 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : syncSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {isLoading ? 'Sincronizando...' : syncSuccess ? 'Sincronizado!' : 'Atualizar'}
              </button>

              <button
                onClick={handleDisconnect}
                className="text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors uppercase px-2 py-1.5 hover:bg-red-500/5 rounded-md border border-transparent hover:border-red-500/10"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {!githubUser ? (
          /* Estado Desconectado */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <p className="text-[11.5px] text-neutral-400 leading-relaxed font-mono">
                  Insira o link do seu perfil do GitHub ou seu nome de usuário. Nós leremos as suas atividades públicas de push mais recentes para coroar suas microvitórias diárias de madrugada.
                </p>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => {
                    setInputValue('franciscotaveira');
                    fetchGithubCommits('franciscotaveira');
                  }}
                  className="text-[10px] font-bold font-mono text-indigo-400 underline uppercase decoration-dotted hover:text-indigo-300"
                >
                  Usar perfil demonstrativo 🤝
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 max-w-lg">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ex: https://github.com/seu-login ou seu-login"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => fetchGithubCommits(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase rounded-lg transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 shrink-0 select-none"
              >
                {isLoading ? 'Conectando...' : 'Vincular Perfil'}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        ) : (
          /* Estado Conectado */
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Usuário Info */}
              <div className="md:col-span-5 flex items-center gap-3">
                <img
                  src={`https://github.com/${githubUser}.png`}
                  alt={githubUser}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-indigo-500/30 object-cover shrink-0"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src = 'https://github.com/github.png';
                  }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-neutral-100 font-mono">@{githubUser}</span>
                    <a
                      href={`https://github.com/${githubUser}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-all"
                      title="Ver perfil oficial no GitHub"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Perfil Sincronizado
                  </span>
                </div>
              </div>

              {/* Estatísticas de Commit */}
              <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
                <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60 flex flex-col justify-between">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Commits Ativos</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-base font-black text-white font-mono">{totalCommitsCount}</span>
                    <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </div>

                <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60 flex flex-col justify-between">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 font-mono flex items-center gap-0.5"><Moon className="w-2.5 h-2.5 text-amber-400" /> Madrugada</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-base font-black text-amber-400 font-mono">{nightCommitsCount}</span>
                    <span className="text-[8px] font-mono text-neutral-500">OWL</span>
                  </div>
                </div>

                <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60 flex flex-col justify-between">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Bônus de XP</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-base font-black text-emerald-400 font-mono">+{calculatedXP} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progresso de Commits / Feed recente */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Atividade recente de Push / Commits rastreados
              </h4>

              {commits.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-neutral-800 rounded-lg">
                  <p className="text-xs text-neutral-500 font-mono">Nenhum commit recente encontrado nos seus eventos públicos de Push ainda. Continue codando e empurre novidades para o GitHub!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commits.slice(0, 4).map((commit, idx) => {
                    const isNight = isCommitAtNight(commit.date);
                    return (
                      <div
                        key={idx}
                        className="bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/50 flex flex-col justify-between hover:border-neutral-800 transition-all font-mono"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[9.5px] text-indigo-400 font-bold truncate max-w-[150px]">
                              {commit.repoName}
                            </span>
                            <span className="text-[8.5px] text-neutral-600 shrink-0">
                              sha: {commit.sha}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 line-clamp-1 select-text">
                            {commit.message}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-900/60">
                          <span className="text-[8.5px] text-neutral-500">
                            {new Date(commit.date).toLocaleDateString()} {new Date(commit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isNight && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-1 py-0.5 rounded">
                              <Moon className="w-2.5 h-2.5" /> Sob a Lua
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LADO ESQUERDO DA CARREIRA - SENIORIDADE */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 flex items-center justify-between">
            <span>Sua Evolução</span>
            <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full">{completedCount} Missões</span>
          </h3>

          <div className="relative border-l border-neutral-800 ml-4 space-y-6">
            {SENIORITY_LEVELS.map((level, idx) => {
              const isUnlocked = completedCount >= level.missionsReq;
              const isCurrent = idx === currentIndex;
              const Icon = level.icon;

              return (
                <div key={level.id} className="relative pl-6">
                  {/* Status Node */}
                  <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                    ${isCurrent ? 'bg-neutral-900 border-indigo-500 z-10' : 
                      isUnlocked ? 'bg-neutral-900 border-green-500' : 'bg-neutral-900 border-neutral-800'}`}>
                    {isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    ) : isUnlocked ? (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    ) : (
                      <Lock className="w-3 h-3 text-neutral-600" />
                    )}
                  </div>

                  <div className={`p-4 rounded-lg border transition-all ${isCurrent ? `${level.bg} ${level.border}` : isUnlocked ? 'border-neutral-800 bg-neutral-900/30' : 'border-neutral-800/40 opacity-40 grayscale'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-4 h-4 ${isUnlocked ? level.color : 'text-neutral-500'}`} />
                      <h4 className={`text-sm font-bold ${isCurrent ? level.color : isUnlocked ? 'text-neutral-300' : 'text-neutral-500'}`}>{level.title}</h4>
                      {isCurrent && (
                        <span className="ml-auto text-[10px] uppercase font-mono tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Seu Nível Atual</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {level.desc}
                    </p>

                    {/* Progress to next */}
                    {isCurrent && nextLevel && (
                      <div className="mt-4 pt-4 border-t border-indigo-500/10">
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1.5 uppercase">
                          <span>Próximo: {nextLevel.title}</span>
                          <span>Faltam {nextLevel.missionsReq - completedCount} missões</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-1.5">
                          <motion.div 
                            className="bg-indigo-500 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${nextLevelProgress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LADO DIREITO - PÓS EM IA APLICADA */}
        <div>
          <div className={`p-6 rounded-lg h-full border flex flex-col ${isNightMode ? 'bg-[#151515] border-neutral-800/50' : 'bg-neutral-50 text-neutral-900 border-neutral-200'}`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-emerald-500" /> 
                  <span className={isNightMode ? 'text-white' : 'text-black'}>Pós-Graduação em 12 Meses (MEC)</span>
                </h3>
                <h4 className="text-xs text-emerald-500/80 font-mono uppercase tracking-widest">
                  Engenharia de IA Aplicada
                </h4>
              </div>
              <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 rounded uppercase font-bold tracking-widest flex flex-col items-center">
                <span>Objetivo Final</span>
                <span className="text-[9px] font-normal">{aiProgressPercent}% Concluído</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Descubra o que o mercado de verdade espera de você e integre todo o poder dos modelos de IA já existentes ao servidor das aplicações.
            </p>

            <div className="space-y-4 flex-1">
              {POS_GRADUATION_SYLLABUS.map((phase, idx) => (
                <div key={idx} className={`p-4 rounded-md border ${isNightMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">{phase.module}</h5>
                  <ul className="space-y-2">
                    {phase.items.map((item, idy) => {
                      const isItemCompleted = completedItems.includes(item);
                      return (
                        <li 
                          key={idy} 
                          onClick={() => onToggleItem && onToggleItem(item)}
                          className={`flex items-start gap-2 p-1.5 rounded transition-all cursor-pointer hover:bg-neutral-800/50 ${isItemCompleted ? '' : 'bg-red-500/5 border border-red-500/10'}`}
                        >
                          {isItemCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-red-500/50 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-xs ${isItemCompleted ? 'text-emerald-400 font-medium' : 'text-neutral-500'}`}>
                            {item}
                            {!isItemCompleted && <span className="ml-2 text-[9px] uppercase tracking-wider text-red-400/70 font-mono font-bold bg-red-500/10 px-1 py-0.5 rounded">Pendente</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-800">
               <a 
                 href="https://unipds.com.br/gads_pos_ia/"
                 target="_blank"
                 rel="noreferrer"
                 className="w-full relative overflow-hidden group block text-center py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-400/50"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]" />
                 Acessar Bolsa da Pós em IA Aplicada
               </a>
               <p className="text-center text-[10px] text-neutral-500 mt-3 uppercase tracking-widest">Bolsas limitadas de até 47% de desconto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
