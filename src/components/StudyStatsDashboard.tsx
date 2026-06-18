import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  YAxis,
} from "recharts";
import {
  Clock,
  Code2,
  Moon,
  Sun,
  Sunrise,
  BugOff,
  Calendar,
  Lock,
  Unlock,
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  Palette,
  Braces,
  BrainCircuit,
  Target,
  TrendingUp,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Markdown from "react-markdown";

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
  combatErrors = {
    "Tags Órfãs": 0,
    "Sintaxe JS": 0,
    "Tipografia CSS": 0,
    Indentação: 0,
  },
}: StudyStatsDashboardProps) {
  const shiftFocusData = shiftFocus || { manha: 0, tarde: 0, madrugada: 0 };
  const shiftData = [
    {
      name: "Manhã",
      value: shiftFocusData.manha || 0,
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
    },
    {
      name: "Tarde",
      value: shiftFocusData.tarde || 0,
      icon: <Sun className="w-4 h-4 text-orange-500" />,
    },
    {
      name: "Madrugada",
      value: shiftFocusData.madrugada || 0,
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
    },
  ];

  const totalShiftMinutes = shiftData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );
  const bestShift = [...shiftData].sort((a, b) => b.value - a.value)[0];

  // Colors for shifts
  const shiftColors = isNightMode
    ? ["#b45309", "#c2410c", "#3730a3"]
    : ["#f59e0b", "#f97316", "#6366f1"];

  // Language stats based strictly on completed missions with 0 offset
  const htmlMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("html") ||
      s.includes("web") ||
      s.includes("estrutur") ||
      s.includes("onboarding") ||
      s.includes("boas-vindas")
    );
  }).length;

  const cssMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("css") ||
      s.includes("estiliza") ||
      s.includes("seletor") ||
      s.includes("box model") ||
      s.includes("layout") ||
      s.includes("flexbox") ||
      s.includes("responsiv")
    );
  }).length;

  const jsMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("js") ||
      s.includes("lógica") ||
      s.includes("switch") ||
      s.includes("array") ||
      s.includes("laço") ||
      s.includes("repeti") ||
      s.includes("funç") ||
      s.includes("dom")
    );
  }).length;

  const nodeMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("node") ||
      s.includes("npm") ||
      s.includes("express") ||
      s.includes("servidor") ||
      s.includes("mvc") ||
      s.includes("responsabilidade")
    );
  }).length;

  const sqlMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("banco") ||
      s.includes("sql") ||
      s.includes("nosql") ||
      s.includes("crud") ||
      s.includes("autentica") ||
      s.includes("segurança") ||
      s.includes("boss fight")
    );
  }).length;

  const tsMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("typescript") ||
      s.includes("ts ") ||
      s.includes("react") ||
      s.includes("next")
    );
  }).length;

  const javaMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("java") ||
      s.includes("spring") ||
      s.includes("jdbc") ||
      s.includes("jpa")
    );
  }).length;

  const aiMissions = completedItems.filter((item) => {
    const s = item.toLowerCase();
    return (
      s.includes("ia") ||
      s.includes("llm") ||
      s.includes("prompt") ||
      s.includes("agente") ||
      s.includes("mcp")
    );
  }).length;

  const totalMissionsCount =
    htmlMissions +
    cssMissions +
    jsMissions +
    nodeMissions +
    sqlMissions +
    tsMissions +
    javaMissions +
    aiMissions;

  const radarData = [
    {
      subject: "Front",
      A: Math.min(100, (htmlMissions + cssMissions + jsMissions) * 15),
      fullMark: 100,
    },
    {
      subject: "Back",
      A: Math.min(100, (nodeMissions + sqlMissions) * 15),
      fullMark: 100,
    },
    { subject: "TS/React", A: Math.min(100, tsMissions * 15), fullMark: 100 },
    { subject: "Java", A: Math.min(100, javaMissions * 15), fullMark: 100 },
    { subject: "IA", A: Math.min(100, aiMissions * 15), fullMark: 100 },
  ];

  const currentCombatErrors = combatErrors || {
    "Tags Órfãs": 0,
    "Sintaxe JS": 0,
    "Tipografia CSS": 0,
    Indentação: 0,
  };
  const errorsData = [
    { name: "Tags Órfãs", value: currentCombatErrors["Tags Órfãs"] || 0 },
    { name: "Sintaxe JS", value: currentCombatErrors["Sintaxe JS"] || 0 },
    {
      name: "Tipografia CSS",
      value: currentCombatErrors["Tipografia CSS"] || 0,
    },
    { name: "Indentação", value: currentCombatErrors["Indentação"] || 0 },
  ];

  const totalCombatErrors = Object.values(currentCombatErrors).reduce(
    (a, b) => a + b,
    0,
  );

  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);
  const [weeklySummary, setWeeklySummary] = React.useState<string | null>(null);

  const [isGeneratingNextModule, setIsGeneratingNextModule] = React.useState(false);
  const [nextModuleSuggestion, setNextModuleSuggestion] = React.useState<string | null>(null);

  const handleSuggestNextModule = async () => {
    try {
      setIsGeneratingNextModule(true);
      const res = await fetch("/api/next-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedItems }),
      });
      const data = await res.json();
      if (data.text) {
        setNextModuleSuggestion(data.text);
      }
    } catch (e) {
      console.error(e);
      setNextModuleSuggestion("Não foi possível gerar a sugestão agora. Mantenha o foco!");
    } finally {
      setIsGeneratingNextModule(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const storedLogbook = localStorage.getItem("senai-logbook-entries");
      const logbookEntries = storedLogbook ? JSON.parse(storedLogbook) : [];

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logbookEntries: logbookEntries.slice(0, 10), // Send last 10 entries to save tokens
          focusData: dailyFocusData,
          completedMissionsCount: completedItems.length,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setWeeklySummary(data.text);
      }
    } catch (e) {
      console.error(e);
      setWeeklySummary(
        "Não foi possível gerar o resumo agora. Continue focado!",
      );
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
      const dateString = d.toISOString().split("T")[0];
      const minutes = dailyFocusData?.[dateString] || 0;
      days.push({
        date: dateString,
        minutes: minutes,
        metGoal: minutes >= 25, // Goal is 25 minutes (1 pomodoro)
        isToday: i === 0,
      });
    }
    return days;
  }, [dailyFocusData]);

  const annualFocusData = useMemo(() => {
    const today = new Date();
    // Generate exactly 53 weeks * 7 days = 371 days to align Sunday row perfectly
    const totalDays = 53 * 7;
    const oldestDate = new Date(today);
    oldestDate.setDate(today.getDate() - totalDays);

    // Adjust oldestDate to the preceding Sunday
    const startOffset = oldestDate.getDay();
    const startDate = new Date(oldestDate);
    startDate.setDate(oldestDate.getDate() - startOffset);

    const grid = [];
    const current = new Date(startDate);
    const nowStr = today.toISOString().split("T")[0];

    for (let i = 0; i < totalDays; i++) {
      const dateString = current.toISOString().split("T")[0];
      const minutes = dailyFocusData?.[dateString] || 0;
      grid.push({
        date: dateString,
        minutes: minutes,
        metGoal: minutes >= 25,
        isToday: dateString === nowStr,
        dayOfWeek: current.getDay(),
        month: current.toLocaleString("pt-BR", { month: "short" }),
      });
      current.setDate(current.getDate() + 1);
    }
    return grid;
  }, [dailyFocusData]);

  const annualWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < annualFocusData.length; i += 7) {
      weeks.push(annualFocusData.slice(i, i + 7));
    }
    return weeks;
  }, [annualFocusData]);

  const getHeatmapColor = (minutes: number) => {
    if (minutes === 0) {
      return isNightMode
        ? "bg-neutral-900/60 border border-neutral-800/40 hover:bg-neutral-800"
        : "bg-neutral-200/50 border border-neutral-300/40 hover:bg-neutral-300";
    }
    if (minutes < 15) {
      return "bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 hover:scale-110";
    }
    if (minutes < 25) {
      return "bg-emerald-800/50 border border-emerald-700/40 text-emerald-300 hover:scale-110";
    }
    if (minutes < 60) {
      return "bg-emerald-500/80 border border-emerald-400/45 text-white hover:scale-110";
    }
    return "bg-emerald-400 border border-emerald-300/50 text-white shadow-[0_0_8px_rgba(52,211,153,0.4)] hover:scale-110";
  };

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 29; i >= 0; i--) {
      if (last30Days[i].metGoal) {
        streak++;
      } else if (i !== 29) {
        // If it's not today and didn't meet goal, streak breaks
        break;
      }
    }
    return streak;
  }, [last30Days]);

  // AI Insights - Meta vs Foco Real (Últimos 7 dias)
  const last7DaysGoalData = useMemo(() => {
    return last30Days.slice(-7).map((d) => {
      let label = "";
      try {
        const parts = d.date.split("-");
        if (parts.length === 3) {
          const dateObj = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2]),
          );
          label = dateObj
            .toLocaleDateString("pt-BR", { weekday: "short" })
            .replace(".", "");
          label = label.charAt(0).toUpperCase() + label.slice(1);
        }
      } catch (e) {
        label = d.date;
      }
      return {
        name: label,
        "Minutos de Foco": d.minutes,
        "Meta Diária": 25,
      };
    });
  }, [last30Days]);

  // AI Insights - Focus Consistency Score
  const focusConsistencyScore = useMemo(() => {
    if (!dailyFocusData || Object.keys(dailyFocusData).length === 0) return 0;
    const activeDays30 = last30Days.filter((d) => d.minutes > 0).length;
    const goalsMet30 = last30Days.filter((d) => d.metGoal).length;

    const activeWeight = (activeDays30 / 30) * 40;
    const goalWeight = (goalsMet30 / 30) * 50;
    const streakBonus = Math.min(10, currentStreak * 2);

    const calculatedScore = Math.round(activeWeight + goalWeight + streakBonus);

    if (calculatedScore === 0 && activeDays30 > 0) return 12;
    return Math.min(100, Math.max(0, calculatedScore));
  }, [last30Days, dailyFocusData, currentStreak]);

  // Insights Dinâmicos baseados no desempenho
  const aiInsightFeedback = useMemo(() => {
    if (focusConsistencyScore >= 80) {
      return {
        rating: "Excelente (Foco Implacável)",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        message:
          "Impressionante! Sua consistência demonstra um ritmo compatível com engenheiros de software seniores. Você está retendo conceitos profundos com extrema facilidade de madrugada. Continue assim e ataque os microsserviços (Mês 11-12).",
      };
    } else if (focusConsistencyScore >= 50) {
      return {
        rating: "Bom (Construindo Hábito)",
        color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        message:
          "Nível de foco ótimo. Você está desenvolvendo fixação neuronal dos conceitos acadêmicos. Tente bater a meta diária mais de 3 vezes por semana para acelerar os estudos de Node.js e Bancos de Dados Relacionais (Mês 3-6).",
      };
    } else {
      return {
        rating: "Ritmo Inicial (Foco Gradual)",
        color: "text-neutral-400 bg-neutral-800/20 border-neutral-700/50",
        message:
          "Seu cérebro está se acostumando à programação na madrugada! Concentre-se em concluir apenas 1 Pomodoro (25 minutos) consecutivamente para ativar circuitos de recompensa adicionais (Mês 1-2).",
      };
    }
  }, [focusConsistencyScore]);

  const gaugeData = useMemo(() => {
    return [
      { name: "Score", value: focusConsistencyScore },
      { name: "Resto", value: 100 - focusConsistencyScore },
    ];
  }, [focusConsistencyScore]);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
          isNightMode &&
            "opacity-30 hover:opacity-100 transition-opacity duration-500 contrast-75 saturate-0",
        )}
      >
        {/* Shifts Breakdown */}
        <div
          className={cn(
            "rounded-xl p-5 border flex flex-col justify-between",
            isNightMode
              ? "bg-black border-neutral-900/50"
              : "bg-neutral-900/40 border-neutral-800/50",
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-300">
              Foco por Turno (h)
            </h3>
          </div>

          {totalShiftMinutes === 0 ? (
            <div className="flex items-center">
              <div className="h-40 w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: "Sem foco", value: 1, icon: null }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      dataKey="value"
                      fill={isNightMode ? "#262626" : "#d4d4d8"}
                      stroke="none"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                <p className="text-xs text-neutral-500 font-mono italic">
                  Nenhum registro hoje. Inicie o pomodoro!
                </p>
              </div>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={shiftColors[index % shiftColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#171717",
                        borderColor: "#262626",
                        borderRadius: "8px",
                        color: "#e5e5e5",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {shiftData.map((s, i) => {
                  const isBest = s.value === bestShift.value && s.value > 0;
                  return (
                    <div
                      key={s.name}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        isBest
                          ? "bg-indigo-500/10 border border-indigo-500/20 px-2 py-1.5 rounded-lg -ml-2 w-[calc(100%+0.5rem)]"
                          : "",
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0",
                          isBest ? "animate-pulse" : "",
                        )}
                      >
                        {s.icon}
                      </span>
                      <span
                        className={cn(
                          "flex-1",
                          isBest
                            ? "text-indigo-400 font-medium"
                            : "text-neutral-400",
                        )}
                      >
                        {s.name}{" "}
                        {isBest && (
                          <span className="ml-1 text-[10px] uppercase tracking-wider text-indigo-300">
                            Max
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-neutral-200">
                        {(s.value / 60).toFixed(1)}h
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Radars */}
        <div
          className={cn(
            "rounded-xl p-5 border flex flex-col justify-between",
            isNightMode
              ? "bg-black border-neutral-900/50"
              : "bg-neutral-900/40 border-neutral-800/50",
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-300">
              Média p/ Linguagem
            </h3>
          </div>

          {totalMissionsCount === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
              <p className="text-xs text-neutral-500 font-mono italic max-w-[200px]">
                Conclua missões no menu lateral para ativar seu diagrama de
                habilidades!
              </p>
            </div>
          ) : (
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={radarData}
                >
                  <PolarGrid stroke={isNightMode ? "#27272a" : "#404040"} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#a3a3a3", fontSize: 10 }}
                  />
                  <Radar
                    name="Experiência Acumulada"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      borderColor: "#262626",
                      borderRadius: "8px",
                      color: "#e5e5e5",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#818cf8" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Common Errors Log */}
        <div
          className={cn(
            "rounded-xl p-5 border flex flex-col justify-between",
            isNightMode
              ? "bg-black border-neutral-900/50"
              : "bg-neutral-900/40 border-neutral-800/50",
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <BugOff className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-300">
              Erros Combatidos
            </h3>
          </div>

          {totalCombatErrors === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
              <p className="text-xs text-neutral-500 font-mono italic max-w-[200px]">
                Nenhum bug resolvido no laboratório. Resolva desafios no
                CodeSandbox para computar!
              </p>
            </div>
          ) : (
            <div className="h-40 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={errorsData}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={85}
                    tick={{ fill: "#a3a3a3", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      borderColor: "#262626",
                      borderRadius: "8px",
                      color: "#e5e5e5",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: isNightMode ? "#27272a" : "#404040" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Painel do Caçador de Bugs - Gamificação de Erros */}
      <div
        className={cn(
          "rounded-xl p-5 border mb-5 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300",
          isNightMode
            ? "bg-neutral-950 border-neutral-900"
            : "bg-neutral-900/40 border-neutral-800/50",
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                Domínio Caçador de Bugs{" "}
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono">
                Conserte desafios práticos e desbloqueie medalhas exclusivas
              </p>
            </div>
          </div>
          {(() => {
            const tagsPassed = (combatErrors["Tags Órfãs"] || 0) > 0;
            const jsPassed = (combatErrors["Sintaxe JS"] || 0) > 0;
            const cssPassed = (combatErrors["Tipografia CSS"] || 0) > 0;
            const indentPassed = (combatErrors["Indentação"] || 0) > 0;
            const unlockedCount = [
              tagsPassed,
              jsPassed,
              cssPassed,
              indentPassed,
            ].filter(Boolean).length;
            const isLendario = unlockedCount === 4;

            return (
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-full select-none">
                <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 font-mono">
                  Medalhas:
                </span>
                <span className="font-mono text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  {unlockedCount} de 4
                </span>
                {isLendario && (
                  <span
                    className="text-xs animate-bounce"
                    title="Você é lendário!"
                  >
                    👑
                  </span>
                )}
              </div>
            );
          })()}
        </div>

        {(() => {
          const tagsCount = combatErrors["Tags Órfãs"] || 0;
          const jsCount = combatErrors["Sintaxe JS"] || 0;
          const cssCount = combatErrors["Tipografia CSS"] || 0;
          const indentCount = combatErrors["Indentação"] || 0;

          const listBadges = [
            {
              id: "tags",
              title: "Domador de Tags",
              description:
                "Escreva markups limpos, fechando e aninhando tags HTML sem órfãs.",
              errorName: "Tags Órfãs",
              count: tagsCount,
              unlocked: tagsCount > 0,
              icon: <Code2 className="w-5 h-5" />,
              color: "text-sky-400",
              bgBorder: "border-sky-500/30",
              shadowColor: "hover:shadow-sky-500/5",
              glowBg: "from-sky-500/10 to-transparent",
            },
            {
              id: "js",
              title: "Mestre da Sintaxe",
              description:
                "Implemente lógica em JS com escuta e manipulação fluída do DOM.",
              errorName: "Sintaxe JS",
              count: jsCount,
              unlocked: jsCount > 0,
              icon: <Braces className="w-5 h-5" />,
              color: "text-amber-400",
              bgBorder: "border-amber-500/30",
              shadowColor: "hover:shadow-amber-500/5",
              glowBg: "from-amber-500/10 to-transparent",
            },
            {
              id: "css",
              title: "Alquimista do Design",
              description:
                "Defina classes CSS dominando fontes, cores e estruturas visuais rápidas.",
              errorName: "Tipografia CSS",
              count: cssCount,
              unlocked: cssCount > 0,
              icon: <Palette className="w-5 h-5" />,
              color: "text-pink-400",
              bgBorder: "border-pink-500/30",
              shadowColor: "hover:shadow-pink-500/5",
              glowBg: "from-pink-500/10 to-transparent",
            },
            {
              id: "indent",
              title: "Zen do Código Limpo",
              description:
                "Formate com espaçamento consistente e indentação impecável.",
              errorName: "Indentação",
              count: indentCount,
              unlocked: indentCount > 0,
              icon: <BugOff className="w-5 h-5" />,
              color: "text-emerald-400",
              bgBorder: "border-emerald-500/30",
              shadowColor: "hover:shadow-emerald-500/5",
              glowBg: "from-emerald-500/10 to-transparent",
            },
          ];

          const allUnlocked = listBadges.every((b) => b.unlocked);

          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {listBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={cn(
                      "relative rounded-xl border p-3 overflow-hidden transition-all duration-300 flex flex-col justify-between group",
                      badge.unlocked
                        ? `bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 shadow-md ${badge.shadowColor}`
                        : "bg-neutral-950/20 border-neutral-900/80 opacity-50",
                    )}
                  >
                    {badge.unlocked && (
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity duration-300",
                          badge.glowBg,
                        )}
                      />
                    )}

                    <div className="flex items-center justify-between gap-2.5">
                      <div
                        className={cn(
                          "p-2 rounded-lg border transition-all duration-300 shrink-0",
                          badge.unlocked
                            ? `bg-neutral-950/70 border-neutral-800 ${badge.color}`
                            : "bg-neutral-900/30 border-neutral-900/50 text-neutral-705",
                        )}
                      >
                        {badge.icon}
                      </div>

                      {badge.unlocked ? (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                          <Unlock className="w-2 h-2" /> Desbloqueado x
                          {badge.count}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-neutral-600 bg-neutral-900/40 border border-neutral-900/50 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono font-bold">
                          <Lock className="w-2 h-2" /> Bloqueado
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className={cn(
                            "font-bold text-xs tracking-tight",
                            badge.unlocked
                              ? "text-neutral-200"
                              : "text-neutral-500",
                          )}
                        >
                          {badge.title}
                        </h4>
                        <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                          {badge.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/40 text-[9px] font-mono text-neutral-500">
                        Disparador:{" "}
                        <span className="text-neutral-400">
                          {badge.errorName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {allUnlocked && (
                <div className="relative rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 p-4 flex flex-col md:flex-row items-center justify-between gap-3 animate-in zoom-in-95 duration-550 overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/40 to-amber-500/20" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-600/10 border-2 border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/5 text-xl animate-pulse">
                      🏆
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-400 text-xs flex items-center gap-1.5 uppercase tracking-wider font-mono">
                        Caçador de Bugs Supremo Adquirido!{" "}
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      </h4>
                      <p className="text-[10px] text-neutral-400 leading-normal mt-0.5 max-w-xl">
                        Superpoder Máximo desbloqueado de madrugada! Você
                        dominou a depuração de Tags Órfãs, Sintaxe JS, Estilos
                        CSS e Indentação no CodeSandbox.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/35 px-2.5 py-1.5 rounded-lg uppercase tracking-widest shrink-0 shadow-sm shadow-amber-500/5">
                    Lenda Certificada 👑
                  </span>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* AI Performance Insights Panel */}
      <div
        className={cn(
          "rounded-xl p-5 border mb-5 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300",
          isNightMode ? "bg-neutral-950 border-neutral-900" : "bg-neutral-900/40 border-neutral-800/50",
        )}
      >
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-neutral-200 text-sm flex items-center gap-1.5 uppercase tracking-wider font-mono">
              Aceleração por IA — Performance Insights
            </h3>
            <p className="text-[10px] text-neutral-500 font-mono">
              Análise de eficiência acadêmica e metas realistas de foco na madrugada
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          {/* Chart 1: Time Spent vs Goal */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-neutral-300 text-xs flex items-center gap-1.5 mb-1 font-mono uppercase">
                <Target className="w-3.5 h-3.5 text-neutral-400" /> Meta versus Foco Realizado (7 dias)
              </h4>
              <p className="text-[10px] text-neutral-500 mb-4 leading-relaxed font-mono">
                Minutos gastando programando versus a meta base recomendada (25 min por dia) para fixação cognitiva ideal.
              </p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysGoalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      borderColor: "#262626",
                      borderRadius: "12px",
                      color: "#e5e5e5",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                    cursor={{ fill: isNightMode ? "#171717" : "#27272a" }}
                  />
                  <Bar dataKey="Minutos de Foco" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar
                    dataKey="Meta Diária"
                    fill="#f59e0b"
                    fillOpacity={0.25}
                    radius={[3, 3, 0, 0]}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Consistency Score and Custom AI Rating */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-800/60 pt-6 lg:pt-0 lg:pl-6">
            <div>
              <h4 className="font-bold text-neutral-300 text-xs flex items-center gap-1.5 mb-1 font-mono uppercase">
                <TrendingUp className="w-3.5 h-3.5 text-neutral-400" /> Métrica de Consistência (30 dias)
              </h4>
              <p className="text-[10px] text-neutral-500 mb-4 leading-relaxed font-mono">
                Sua dedicação geral calculada integrando ritmo de estudo, metas batidas e ofensivas consecutivas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Radial Score Gauge */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={36}
                      outerRadius={48}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell
                        fill={
                          focusConsistencyScore >= 80
                            ? "#10b981"
                            : focusConsistencyScore >= 50
                              ? "#6366f1"
                              : "#a3a3a3"
                        }
                      />
                      <Cell fill={isNightMode ? "#1e1b4b" : "#e4e4e7"} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col justify-center items-center pt-4">
                  <span className="text-xl font-black text-neutral-200 leading-none">
                    {focusConsistencyScore}%
                  </span>
                  <span className="text-[7.5px] uppercase tracking-widest text-neutral-500 font-mono font-bold mt-1">
                    Consistência
                  </span>
                </div>
              </div>

              {/* Feedback and dynamic advice */}
              <div className="flex-1 space-y-2">
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider",
                    aiInsightFeedback.color,
                  )}
                >
                  {aiInsightFeedback.rating}
                </div>
                <p className="text-[10.5px] text-neutral-400 leading-relaxed font-mono">
                  {aiInsightFeedback.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Next Module Suggestion Panel */}
      <div
        className={cn(
          "rounded-xl p-5 border mb-8",
          isNightMode ? "bg-indigo-950/20 border-indigo-900" : "bg-indigo-50 border-indigo-100"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className={cn("font-bold text-sm uppercase tracking-wider font-mono", isNightMode ? "text-indigo-200" : "text-indigo-900")}>
                Próximo Passo (RAG Analytics)
              </h3>
              <p className={cn("text-[10px] font-mono", isNightMode ? "text-indigo-400/70" : "text-indigo-700/70")}>
                Análise de currículo baseada no seu histórico de missões
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSuggestNextModule}
            disabled={isGeneratingNextModule}
            className={cn(
              "text-xs px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2",
              isNightMode
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 shadow-md disabled:opacity-50"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 shadow-md disabled:opacity-50"
            )}
          >
            {isGeneratingNextModule ? (
              <>
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>Analisando...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Sugerir Módulo</span>
              </>
            )}
          </button>
        </div>

        {nextModuleSuggestion && (
          <div className="mt-4 pt-4 border-t border-indigo-500/20">
            <div className={cn(
              "prose prose-sm max-w-none font-mono text-xs leading-relaxed",
              isNightMode ? "text-indigo-200 prose-invert" : "text-indigo-900"
            )}>
              <Markdown>{nextModuleSuggestion}</Markdown>
            </div>
          </div>
        )}
      </div>

      {/* Study Consistency Heatmap (Annual) */}
      <div
        className={cn(
          "rounded-xl p-5 border mb-8",
          isNightMode
            ? "bg-black border-neutral-900/50"
            : "bg-neutral-900/40 border-neutral-800/50",
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-neutral-200 text-base">
                Consistência de Estudos
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Mapa de calor de foco anual (1 quadrado = 1 dia)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span>Sequência de Pomodoros:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                {currentStreak} {currentStreak === 1 ? "dia" : "dias"} 🔥
              </span>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-50",
                isNightMode
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50",
              )}
            >
              {isGeneratingSummary ? (
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>✨</span>
              )}
              Mentoria AI
            </button>
          </div>
        </div>

        {weeklySummary && (
          <div
            className={cn(
              "mb-6 p-5 rounded-xl border flex flex-col gap-3",
              isNightMode
                ? "bg-indigo-900/10 border-indigo-500/20 text-indigo-100"
                : "bg-indigo-50 border-indigo-100 text-indigo-900",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📊</span>
              <h4 className="font-bold text-lg">Relatório Semanal de Foco</h4>
            </div>
            <div
              className={cn(
                "prose prose-sm max-w-none opacity-90 overflow-hidden",
                isNightMode ? "prose-invert" : "",
              )}
            >
              <Markdown>{weeklySummary}</Markdown>
            </div>
          </div>
        )}

        {/* Heatmap Grid Wrapper */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start overflow-x-auto pb-4 custom-scrollbar select-none">
            {/* Row Headers (Weekdays) */}
            <div className="flex flex-col gap-[3px] text-[10px] text-neutral-500 font-mono pr-2.5 pt-[18px] shrink-0 w-8">
              <div className="h-[11px] leading-[11px]">Dom</div>
              <div className="h-[11px] leading-[11px] text-neutral-400 font-medium">
                Seg
              </div>
              <div className="h-[11px] leading-[11px]">Ter</div>
              <div className="h-[11px] leading-[11px] text-neutral-400 font-medium font-bold">
                Qua
              </div>
              <div className="h-[11px] leading-[11px]">Qui</div>
              <div className="h-[11px] leading-[11px] text-neutral-400 font-medium font-bold">
                Sex
              </div>
              <div className="h-[11px] leading-[11px]">Sáb</div>
            </div>

            {/* Grid with Month Headers */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Month abbreviations line */}
              <div className="flex gap-[3px] mb-1.5 h-4 relative">
                {annualWeeks.map((week, idx) => {
                  const firstDay = week[0];
                  const previousWeek = annualWeeks[idx - 1];
                  const showMonthLabel =
                    idx === 0 ||
                    (firstDay &&
                      previousWeek &&
                      firstDay.month !== previousWeek[0].month);
                  return (
                    <div key={idx} className="w-[11px] shrink-0 relative">
                      {showMonthLabel && firstDay && (
                        <span className="absolute left-0 bottom-0 text-[10px] uppercase tracking-wider text-neutral-400 font-bold whitespace-nowrap animate-fade-in">
                          {firstDay.month}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Matrix of Squares */}
              <div className="flex gap-[3px]">
                {annualWeeks.map((week, weekIdx) => (
                  <div
                    key={weekIdx}
                    className="flex flex-col gap-[3px] shrink-0"
                  >
                    {week.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.minutes} min estudados${day.metGoal ? " (Meta batida!)" : ""}`}
                        className={cn(
                          "w-[11px] h-[11px] rounded-[2px] transition-all duration-300 cursor-pointer",
                          getHeatmapColor(day.minutes),
                          day.isToday &&
                            "ring-[1.5px] ring-indigo-500 ring-offset-1 ring-offset-neutral-900",
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend and stats footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800/40 pt-4 mt-2 gap-2">
            <div className="flex items-center gap-1.5 font-mono">
              <span>Meta diária:</span>
              <span className="font-bold text-neutral-300 bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-800">
                25 min (1 Pomodoro)
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono self-end sm:self-auto">
              <span>Menos</span>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-neutral-200/50 border border-neutral-300/40" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-950/40 border border-emerald-900/30" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-800/50 border border-emerald-700/40" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-500/80 border border-emerald-400/45" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400 border border-emerald-300/50" />
              <span>Mais</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
