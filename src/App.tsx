/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { curriculums, defaultCurriculumId, Module } from "./data/curriculum";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Target,
  Play,
  Pause,
  RotateCcw,
  Moon,
  Sun,
  Zap,
  Loader2,
  BrainCircuit,
  Trophy,
  Wind,
  X,
  Flame,
  Settings,
  HelpCircle,
  Users,
  Copy,
  Clock,
  Award,
  ClipboardList,
  Plug,
  Briefcase,
  Palette,
  Maximize,
  Minimize,
  Droplets,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MentorChat from "./components/MentorChat";
import CodeSandbox from "./components/CodeSandbox";
import { StudyStatsDashboard } from "./components/StudyStatsDashboard";
import Logbook from "./components/Logbook";
import { MissionLogbook } from "./components/MissionLogbook";
import { AIPackageSuggester } from "./components/AIPackageSuggester";
import { CurriculumDrawer } from "./components/CurriculumDrawer";
import SaaSTabsArea from "./components/SaaSTabsArea";
import { ProTipsSidebar } from "./components/ProTipsSidebar";
import { useArchitectureTips } from "./hooks/useArchitectureTips";
import { ArchitectureTipNotification } from "./components/ArchitectureTipNotification";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Local Storage Hooks
function useStickyState<T>(
  defaultValue: T,
  key: string,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

const getLevelInfo = (completedCount: number) => {
  const xpPerMission = 100;
  const totalXP = completedCount * xpPerMission;
  let level = 1;
  let title = "Recruta Aleatório";
  let nextLevelXP = 300;
  let currentLevelXP = 0;

  if (completedCount >= 15) {
    level = 5;
    title = "Mestre Jedi";
    currentLevelXP = 1500;
    nextLevelXP = 1500;
  } else if (completedCount >= 10) {
    level = 4;
    title = "Ninja Fullstack";
    currentLevelXP = 1000;
    nextLevelXP = 1500;
  } else if (completedCount >= 6) {
    level = 3;
    title = "Explorador de Código";
    currentLevelXP = 600;
    nextLevelXP = 1000;
  } else if (completedCount >= 3) {
    level = 2;
    title = "Padawan do Front";
    currentLevelXP = 300;
    nextLevelXP = 600;
  } else {
    level = 1;
    title = "Novato Curioso";
    currentLevelXP = 0;
    nextLevelXP = 300;
  }

  const progress =
    totalXP >= nextLevelXP
      ? 100
      : ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return { level, title, totalXP, progress, nextLevelXP, currentLevelXP };
};

interface MicroTask {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [completedItems, setCompletedItems] = useStickyState<string[]>(
    [],
    "senai-completed-items",
  );
  const [completionTimes, setCompletionTimes] = useStickyState<
    Record<string, string>
  >({}, "senai-completion-times");
  const [badges, setBadges] = useStickyState<string[]>([], "senai-badges");
  const [activeItem, setActiveItem] = useStickyState<string | null>(
    null,
    "senai-active-item",
  );
  const [expandedModules, setExpandedModules] = useState<number[]>([0, 1]);
  const [isNightMode, setIsNightMode] = useState(false);

  const [customCurriculum, setCustomCurriculum] = useStickyState<
    Module[] | null
  >(null, "senai-custom-curriculum");
  const [selectedCurriculumId, setSelectedCurriculumId] =
    useStickyState<string>(defaultCurriculumId, "senai-selected-curriculum-id");
  const baseCurriculum =
    curriculums[selectedCurriculumId]?.modules ||
    curriculums[defaultCurriculumId].modules;
  const curriculum = customCurriculum || baseCurriculum;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isAutoFormatEnabled, setIsAutoFormatEnabled] = useStickyState(
    false,
    "senai-auto-format",
  );
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "sandbox">(
    "chat",
  );
  const [activeSaaSTab, setActiveSaaSTab] = useStickyState<
    "lab" | "curriculum" | "stats" | "chat" | "career"
  >("stats", "senai-saas-active-tab");
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [curriculumJson, setCurriculumJson] = useState("");
  const [jsonError, setJsonError] = useState("");
  // Gamification & Progress
  const [sctecGoals, setSctecGoals] = useStickyState<Record<string, boolean>>(
    {
      "assistir-videos": false,
      "desafio-extra": false,
      "avaliacao-regular": false,
      "prazo-20-dias": false,
    },
    "senai-sctec-goals",
  );
  const [dailyStudyGoalHours, setDailyStudyGoalHours] = useStickyState<number>(
    4,
    "senai-daily-study-goals-hours",
  );

  // ADHD Smart Notifications
  const [adhdNotificationsEnabled, setAdhdNotificationsEnabled] =
    useStickyState<boolean>(false, "senai-adhd-notifications");
  const [pauseFrequencyMins, setPauseFrequencyMins] = useStickyState<number>(
    30,
    "senai-adhd-pause-freq",
  );
  const [hydrationFrequencyMins, setHydrationFrequencyMins] =
    useStickyState<number>(60, "senai-adhd-hydration-freq");

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewQuestion, setReviewQuestion] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewStatus, setReviewStatus] = useStickyState<
    Record<string, string>
  >({}, "senai-review-status");
  const [microChallenges, setMicroChallenges] = useStickyState<
    Record<string, string>
  >({}, "senai-micro-challenges");
  const [microTasks, setMicroTasks] = useStickyState<
    Record<string, MicroTask[]>
  >({}, "senai-micro-tasks-v2");
  const [newMicroTaskText, setNewMicroTaskText] = useState("");

  const [evaluatingItem, setEvaluatingItem] = useState<string | null>(null);
  const [evaluationExplanation, setEvaluationExplanation] =
    useState<string>("");

  const [streak, setStreak] = useStickyState<number>(0, "senai-study-streak");
  const [lastStudyDate, setLastStudyDate] = useStickyState<string | null>(
    null,
    "senai-last-study-date",
  );

  const [dailyFocusDataRaw, setDailyFocusDataRaw] = useStickyState<
    Record<string, number>
  >({}, "senai-daily-focus-raw");
  const [missionTime, setMissionTime] = useStickyState<Record<string, number>>(
    {},
    "senai-mission-time-data",
  );
  const [shiftFocus, setShiftFocus] = useStickyState<Record<string, number>>(
    { manha: 0, tarde: 0, madrugada: 0 },
    "senai-shift-focus-data",
  );
  const [combatErrors, setCombatErrors] = useStickyState<
    Record<string, number>
  >(
    { "Tags Órfãs": 0, "Sintaxe JS": 0, "Tipografia CSS": 0, Indentação: 0 },
    "senai-combat-errors-data",
  );
  const [mobileActiveTab, setMobileActiveTab] = useState<"foco" | "trilha">(
    "foco",
  );
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [isCurriculumDrawerOpen, setIsCurriculumDrawerOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useStickyState<number>(
    25 * 60,
    "senai-time-left",
  );
  const [timerDurationMinutes, setTimerDurationMinutes] =
    useStickyState<number>(25, "senai-timer-duration");
  const [isActive, setIsActive] = useStickyState<boolean>(
    false,
    "senai-is-active",
  );

  // Architecture Tips custom hook
  const { activeTip, dismissTip, triggerRandomTipManual } = useArchitectureTips(isActive);

  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [showErgonomicsTip, setShowErgonomicsTip] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    msg: string;
    icon?: React.ReactNode;
  } | null>(null);

  const [rewardModal, setRewardModal] = useState<{
    type: 'levelUp' | 'medal';
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  } | null>(null);

  const ERGONOMICS_TIPS = [
    {
      title: "Postura de Sobrevivência",
      text: "Endireite as costas, relaxe os ombros e apoie os pés no chão.",
    },
    {
      title: "Regra 20-20-20",
      text: "Olhe para algo a 6 metros de distância por 20 segundos para descansar a visão.",
    },
    {
      title: "Respiração 4-7-8",
      text: "Inspire por 4s, segure por 7s, expire por 8s. Ajuda a focar.",
    },
    {
      title: "Movimento Rápido",
      text: "Levante-se e dê uma pequena caminhada ou alongamento de 1 minuto.",
    },
    {
      title: "Hidratação",
      text: "Beba um copo de água agora mesmo para manter o cérebro alerta.",
    },
    {
      title: "Técnica: Body Doubling",
      text: "Trabalhar ao lado de alguém, mesmo virtualmente via 'Study with Me', ajuda a manter o foco em tarefas difíceis.",
    },
    {
      title: "Mini-Blocos de Tempo",
      text: "Apenas 5 minutos. Não pense no resto da missão. Foque apenas no próximo checkpoint minúsculo.",
    },
    {
      title: "Ruído de Fundo (White/Brown Noise)",
      text: "Sons contínuos ajudam a abafar distrações internas e ambientais para mentes aceleradas.",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);

      const today = new Date().toISOString().split("T")[0];
      if (lastStudyDate !== today) {
        const todayDate = new Date(today);
        const lastDate = lastStudyDate ? new Date(lastStudyDate) : null;

        if (lastDate) {
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            setStreak((prev) => prev + 1);
          } else if (diffDays > 1) {
            setStreak(1);
          }
        } else {
          setStreak(1);
        }
        setLastStudyDate(today);
      } else if (streak === 0) {
        setStreak(1);
      }

      setDailyFocusDataRaw((prev) => ({
        ...prev,
        [today]: (prev[today] || 0) + 5,
      }));

      const currentHour = new Date().getHours();
      let shiftKey: "manha" | "tarde" | "madrugada" = "madrugada";
      if (currentHour >= 6 && currentHour < 12) {
        shiftKey = "manha";
      } else if (currentHour >= 12 && currentHour < 18) {
        shiftKey = "tarde";
      }

      setShiftFocus((prev) => ({
        ...prev,
        [shiftKey]: (prev[shiftKey] || 0) + 5,
      }));

      if (activeItem) {
        setMissionTime((prev) => ({
          ...prev,
          [activeItem]: (prev[activeItem] || 0) + 5,
        }));
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#4ade80", "#2dd4bf", "#3b82f6"],
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    let sessionInterval: NodeJS.Timeout | null = null;
    if (isActive) {
      sessionInterval = setInterval(() => {
        setActiveSessionSeconds((prev) => {
          const newSeconds = prev + 1;

          if (adhdNotificationsEnabled) {
            const pauseSeconds = pauseFrequencyMins * 60;
            const hydrationSeconds = hydrationFrequencyMins * 60;

            // Trigger tip/pause based on customized frequency
            if (newSeconds % pauseSeconds === 0 && newSeconds > 0) {
              setCurrentTipIndex((i) => (i + 1) % ERGONOMICS_TIPS.length);
              setShowErgonomicsTip(true);
            }

            // Trigger hydration reminder based on customized frequency
            if (newSeconds % hydrationSeconds === 0 && newSeconds > 0) {
              setToastMessage({
                title: "Hora de se Hidratar! 💧",
                msg: `Você já focou por ${hydrationFrequencyMins} minutos. Beba um pouco de água para manter a cognição afiada.`,
                icon: <Droplets className="w-5 h-5 text-cyan-400" />,
              });
              setTimeout(() => setToastMessage(null), 8000);
            }
          } else {
            // Default behavior if not customized
            if (newSeconds % 1800 === 0 && newSeconds > 0) {
              setCurrentTipIndex((i) => (i + 1) % ERGONOMICS_TIPS.length);
              setShowErgonomicsTip(true);
            }

            if (newSeconds % 3600 === 0 && newSeconds > 0) {
              setToastMessage({
                title: "Hora de se Hidratar! 💧",
                msg: "Você já focou por 60 minutos. Beba um pouco de água para manter a cognição afiada.",
                icon: <Droplets className="w-5 h-5 text-cyan-400" />,
              });
              setTimeout(() => setToastMessage(null), 8000);
            }
          }

          return newSeconds;
        });
      }, 1000);
    }
    return () => {
      if (sessionInterval) clearInterval(sessionInterval);
    };
  }, [
    isActive,
    adhdNotificationsEnabled,
    pauseFrequencyMins,
    hydrationFrequencyMins,
  ]);

  // Shortcut listener for TDAH fast access toggle (Alt+Q) and Function Keys (F1-F4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        setActiveRightTab((prev) => (prev === "chat" ? "sandbox" : "chat"));
      }

      // Map F1 to F4 keys to change tabs instantly to limit cognitive friction
      if (e.key === "F1") {
        e.preventDefault();
        setActiveSaaSTab("stats");
      } else if (e.key === "F2") {
        e.preventDefault();
        setActiveSaaSTab("curriculum");
      } else if (e.key === "F3") {
        e.preventDefault();
        setActiveSaaSTab("lab");
      } else if (e.key === "F4") {
        e.preventDefault();
        setActiveSaaSTab("chat");
      } else if (e.key === "F5") {
        e.preventDefault();
        setActiveSaaSTab("career");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveSaaSTab]);

  const handleAttemptCompletion = (item: string) => {
    if (completedItems.includes(item)) {
      setCompletedItems((prev) => prev.filter((i) => i !== item));
    } else {
      setEvaluatingItem(item);
      setEvaluationExplanation("");
    }
  };

  const handleAddMicroTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newMicroTaskText.trim() !== "") {
      if (!activeItem) return;
      const newTask = {
        id: crypto.randomUUID(),
        text: newMicroTaskText.trim(),
        completed: false,
      };
      setMicroTasks((prev) => ({
        ...prev,
        [activeItem]: [...(prev[activeItem] || []), newTask],
      }));
      setNewMicroTaskText("");
    }
  };

  const toggleMicroTask = (taskId: string) => {
    if (!activeItem) return;
    setMicroTasks((prev) => {
      const currentTasks = prev[activeItem] || [];
      const updatedTasks = currentTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );

      const justCompletedAll =
        updatedTasks.length > 0 &&
        updatedTasks.every((t) => t.completed) &&
        !currentTasks.every((t) => t.completed);

      if (justCompletedAll) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#818cf8", "#c084fc", "#4ade80"],
        });
      }

      return {
        ...prev,
        [activeItem]: updatedTasks,
      };
    });
  };

  const deleteMicroTask = (taskId: string) => {
    if (!activeItem) return;
    setMicroTasks((prev) => {
      const currentTasks = prev[activeItem] || [];
      return {
        ...prev,
        [activeItem]: currentTasks.filter((t) => t.id !== taskId),
      };
    });
  };

  const confirmEvaluation = () => {
    if (evaluatingItem) {
      const now = new Date();
      const hour = now.getHours();

      const currentLevelInfo = getLevelInfo(completedItems.length);
      const nextLevelInfo = getLevelInfo(completedItems.length + 1);

      setCompletedItems((prev) => [...prev, evaluatingItem]);
      setCompletionTimes((prev) => ({
        ...prev,
        [evaluatingItem]: now.toISOString(),
      }));

      const newBadges: string[] = [];
      if (
        hour >= 0 &&
        hour <= 5 &&
        !badges.includes("⭐ Notívago Codificador")
      ) {
        newBadges.push("⭐ Notívago Codificador");
      }

      const htmlCount =
        completedItems.filter((i) => i.toLowerCase().includes("html")).length +
        1;
      if (htmlCount >= 4 && !badges.includes("👑 Mestre HTML")) {
        newBadges.push("👑 Mestre HTML");
      }

      if (newBadges.length > 0) {
        setBadges((prev) => [...prev, ...newBadges]);
      }

      if (nextLevelInfo.level > currentLevelInfo.level) {
        setRewardModal({
          type: "levelUp",
          title: "SUBIU DE NÍVEL!",
          subtitle: `Você agora é: ${nextLevelInfo.title}`,
          icon: <Award className="w-20 h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />,
        });
        setTimeout(() => setRewardModal(null), 5000);
      } else if (newBadges.length > 0) {
        setRewardModal({
          type: "medal",
          title: "NOVA MEDALHA!",
          subtitle: `Desbloqueada: ${newBadges[0]}`,
          icon: <Trophy className="w-20 h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />,
        });
        setTimeout(() => setRewardModal(null), 5000);
      } else {
        setToastMessage({
          title: "Micro-dose de Dopamina! 🧠",
          msg: "Missão concluída. Muito bem!",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        });
        setTimeout(() => setToastMessage(null), 3000);
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#eab308", "#ec4899", "#14b8a6"],
      });
      setEvaluatingItem(null);
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerDurationMinutes * 60);
  };

  const handleTimerDurationChange = (minutes: number) => {
    setTimerDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(false);
  };

  const copyInviteLink = () => {
    // Copia um link com a missão atual ou genérico
    const url = new URL(window.location.href);
    if (activeItem) {
      url.searchParams.set("missao", encodeURIComponent(activeItem));
    }
    navigator.clipboard.writeText(url.toString());
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 3000);
  };

  const openSettings = () => {
    setCurriculumJson(JSON.stringify(curriculum, null, 2));
    setJsonError("");
    setIsSettingsOpen(true);
  };

  const saveCurriculum = () => {
    try {
      const parsed = JSON.parse(curriculumJson);
      if (!Array.isArray(parsed))
        throw new Error("A trilha deve ser um array JSON.");
      parsed.forEach((mod) => {
        if (!mod.title || !Array.isArray(mod.items)) {
          throw new Error(
            "Cada módulo deve ter 'title' (string) e 'items' (array de strings).",
          );
        }
      });
      setCustomCurriculum(parsed);
      setIsSettingsOpen(false);
    } catch (e) {
      setJsonError((e as Error).message);
    }
  };

  const startQuickReview = async () => {
    if (!activeItem) return;
    setIsReviewLoading(true);
    setIsReviewOpen(true);
    setReviewQuestion("");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeItem }),
      });
      const data = await res.json();
      setReviewQuestion(data.text);
    } catch (err) {
      console.error(err);
      setReviewQuestion("Erro ao carregar revisão. Tente novamente.");
    }
    setIsReviewLoading(false);
  };

  const startFocusAfterReview = () => {
    setIsReviewOpen(false);
    setReviewQuestion("");
    setIsActive(true);
    if (activeItem) {
      setReviewStatus((prev) => ({
        ...prev,
        [activeItem]: new Date().toISOString().split("T")[0],
      }));
    }
  };

  useEffect(() => {
    // Check for shared mission link
    const searchParams = new URLSearchParams(window.location.search);
    const sharedMission = searchParams.get("missao");
    if (sharedMission) {
      const decodedMissao = decodeURIComponent(sharedMission);
      const allValidItems = curriculum.flatMap((c) => c.items);
      if (allValidItems.includes(decodedMissao)) {
        setActiveItem(decodedMissao);
      }

      // Clean up URL without reloading
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("missao");
      window.history.replaceState({}, "", newUrl.toString());
    }

    // Cleanup invalid data from previous curriculums
    const allValidItems = curriculum.flatMap((c) => c.items);

    setCompletedItems((prev) => {
      const valid = prev.filter((i) => allValidItems.includes(i));
      return valid.length !== prev.length ? valid : prev;
    });

    setActiveItem((prev) => {
      if (prev && !allValidItems.includes(prev)) return null;
      return prev;
    });
  }, []);

  const averageMissionTime = useMemo(() => {
    const completedWithTime = completedItems.filter(
      (item) => missionTime[item] && missionTime[item] > 0,
    );
    if (completedWithTime.length === 0) return 0;
    const totalMinutes = completedWithTime.reduce(
      (sum, item) => sum + missionTime[item],
      0,
    );
    return Math.round(totalMinutes / completedWithTime.length);
  }, [completedItems, missionTime]);

  const totalItems = curriculum.reduce(
    (acc, curr) => acc + curr.items.length,
    0,
  );
  const allCurriculumItems = React.useMemo(
    () => curriculum.flatMap((c) => c.items),
    [curriculum],
  );
  const completedInCurrentCurriculum = completedItems.filter((item) =>
    allCurriculumItems.includes(item),
  );
  const progressPercent =
    totalItems > 0
      ? Math.round((completedInCurrentCurriculum.length / totalItems) * 100)
      : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const totalFocusMinutes = dailyFocusDataRaw[todayStr] || 0;

  // Derive last 5 days of focus data
  const chartData = useMemo(() => {
    const today = new Date();
    const result = [];
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const minutes = dailyFocusDataRaw[dateString] || 0;

      let name = days[d.getDay()];
      if (i === 0) name = "Hoje";

      result.push({ name, minutes });
    }
    return result;
  }, [dailyFocusDataRaw]);

  const levelInfo = getLevelInfo(completedItems.length);

  return (
    <div
      className={cn(
        "min-h-screen font-sans transition-colors duration-500 relative",
        isNightMode
          ? "bg-black text-neutral-600"
          : "bg-neutral-950 text-neutral-300 selection:bg-indigo-500/30",
      )}
    >
      {/* Curriculum Sidebar */}
      <CurriculumDrawer
        isOpen={isCurriculumDrawerOpen}
        onClose={() => setIsCurriculumDrawerOpen(false)}
        curriculum={curriculum}
        expandedModules={expandedModules}
        toggleModule={toggleModule}
        completedItems={completedItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        handleAttemptCompletion={handleAttemptCompletion}
        isNightMode={isNightMode}
      />

      {/* Top XP Bar */}
      <div
        className={cn(
          "w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b transition-colors z-40 sticky top-0 backdrop-blur-md",
          isNightMode
            ? "bg-black/80 border-neutral-900"
            : "bg-neutral-950/80 border-neutral-900",
        )}
      >
        <div className="flex flex-col flex-1 max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-white">
                Nível {levelInfo.level} —{" "}
                <span className="text-emerald-400 font-bold tracking-wide">
                  {levelInfo.title}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-neutral-400 font-mono text-[10px] sm:text-xs">
                {levelInfo.totalXP} <span className="text-neutral-600">/</span>{" "}
                {levelInfo.nextLevelXP} XP
              </span>
              <button
                onClick={() => setIsImmersiveMode(!isImmersiveMode)}
                className={cn(
                  "hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
                  isImmersiveMode
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "hover:bg-neutral-800 text-neutral-400 hover:text-white border border-transparent",
                )}
                title={
                  isImmersiveMode
                    ? "Sair do Modo Hiperfoco"
                    : "Ativar Modo Hiperfoco"
                }
              >
                {isImmersiveMode ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
                {isImmersiveMode ? "Sair do Hiperfoco" : "Modo Hiperfoco"}
              </button>
            </div>
          </div>
          <div className="h-1.5 sm:h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${Math.max(1, levelInfo.progress)}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Peer Evaluation Modal */}
      <AnimatePresence>
        {evaluatingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEvaluatingItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-lg p-6 rounded-2xl border shadow-2xl overflow-hidden",
                isNightMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-neutral-950 border-neutral-800",
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] pointer-events-none rounded-full" />
              <h2 className="text-xl font-bold text-white mb-2">
                Validação por Pares Simulado
              </h2>
              <p
                className={cn(
                  "text-sm mb-4",
                  isNightMode ? "text-neutral-500" : "text-neutral-400",
                )}
              >
                (Estilo École 42 & Técnica Feynman). Explique o conceito
                principal em suas palavras para consolidar a missão.
              </p>

              <div
                className={cn(
                  "mb-5 p-3 rounded-lg border text-xs leading-relaxed",
                  isNightMode
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                    : "bg-indigo-500/5 border-indigo-500/10 text-indigo-400",
                )}
              >
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  Dica para destravar:
                </span>
                Não sabe o que escrever? Tente completar a frase: <br />
                "Na prática, isso serve para..."
              </div>

              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-2">
                  Missão Atual
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg text-sm border",
                    isNightMode
                      ? "bg-neutral-800/50 border-neutral-700/50 text-neutral-300"
                      : "bg-neutral-900/50 border-neutral-800/80 text-neutral-200",
                  )}
                >
                  {evaluatingItem}
                </div>
              </div>

              <textarea
                value={evaluationExplanation}
                onChange={(e) => setEvaluationExplanation(e.target.value)}
                placeholder="Exemplo: Este código faz um fetch na API e salva a resposta no estado..."
                className={cn(
                  "w-full h-28 rounded-xl p-4 text-sm focus:outline-none mb-6 resize-none transition-colors",
                  isNightMode
                    ? "bg-black border border-neutral-800 text-neutral-300 focus:border-neutral-700 placeholder:text-neutral-700"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-200 focus:border-indigo-500/50 placeholder:text-neutral-600",
                )}
              />

              <div className="flex gap-3 justify-end relative z-10">
                <button
                  onClick={() => setEvaluatingItem(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Ainda não sei
                </button>
                <button
                  onClick={confirmEvaluation}
                  disabled={evaluationExplanation.trim().length < 5}
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white transition-colors"
                >
                  Validar Missão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tools / Extensions Modal */}
      <AnimatePresence>
        {isToolsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsToolsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-2xl p-6 md:p-8 rounded-2xl border shadow-2xl overflow-y-auto max-h-[85vh] flex flex-col",
                isNightMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-neutral-950 border-neutral-800",
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg border",
                      isNightMode
                        ? "bg-neutral-800 border-neutral-700"
                        : "bg-purple-500/10 border-purple-500/20",
                    )}
                  >
                    <Briefcase
                      className={cn(
                        "w-5 h-5",
                        isNightMode ? "text-neutral-400" : "text-purple-400",
                      )}
                    />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-0">
                    Kit de Ferramentas Visual
                  </h2>
                </div>
                <button
                  onClick={() => setIsToolsModalOpen(false)}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
                {/* VS Code Extensions for TDAH */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Temas de Acessibilidade
                    (Cores)
                  </h3>
                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800/80">
                    <p className="mb-2">
                      Para quem estuda de madrugada ou tem sensibilidade visual,
                      temas "Soft" com baixo contraste ajudam muito a evitar a
                      fadiga ocular.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                      <li>
                        <strong className="text-indigo-300">
                          Dracula Official / Dracula Soft:
                        </strong>{" "}
                        Um dos melhores. As cores pastéis no fundo escuro mantêm
                        a atenção sem "gritar".
                      </li>
                      <li>
                        <strong className="text-indigo-300">Nord:</strong> Cores
                        frias inspiradas no ártico. Excelente para acalmar a
                        mente durante a leitura de código extenso.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Organization & Setup */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <Plug className="w-4 h-4" /> Extensões Recomendadas
                    (Obrigatórias)
                  </h3>
                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800/80 space-y-3">
                    <div>
                      <strong className="text-amber-300 block mb-0.5">
                        Prettier - Code formatter
                      </strong>
                      <p className="text-neutral-400 text-xs">
                        Mantém o código organizado independentemente do seu
                        nível de bagunça. Um atalho formata tudo sozinho.
                      </p>
                    </div>
                    <div>
                      <strong className="text-amber-300 block mb-0.5">
                        Live Server
                      </strong>
                      <p className="text-neutral-400 text-xs">
                        Cria um servidor local rápido para você ver as
                        alterações no HTML imediatamente ao salvar o arquivo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Assistants */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> O que é "Antigravity"?
                  </h3>
                  <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                    <p className="mb-2">
                      <strong>Antigravity</strong> (também referido às vezes no
                      escopo do Google Cloud) é o motor de agente (AI Agent) que
                      impulsiona o Google AI Studio.
                    </p>
                    <p className="text-neutral-400">
                      Ferramentas de IA como o Antigravity/Gemini funcionam como
                      co-pilotos. Elas podem ser chamadas no VS Code (através de
                      extensões oficiais ou APIs) para explicar código quebrado
                      instantaneamente. Mas lembre-se:{" "}
                      <strong className="text-rose-400">
                        A IA sugere, você testa. O código confirma.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setIsToolsModalOpen(false)}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Friends Modal */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsInviteOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-md p-6 md:p-8 rounded-2xl border shadow-2xl overflow-hidden flex flex-col",
                isNightMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-neutral-950 border-neutral-800",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg border",
                      isNightMode
                        ? "bg-neutral-800 border-neutral-700"
                        : "bg-indigo-500/10 border-indigo-500/20",
                    )}
                  >
                    <Users
                      className={cn(
                        "w-5 h-5",
                        isNightMode ? "text-neutral-400" : "text-indigo-400",
                      )}
                    />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-0">
                    Squad de Foco
                  </h2>
                </div>
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p
                className={cn(
                  "text-sm leading-relaxed mb-6",
                  isNightMode ? "text-neutral-500" : "text-neutral-400",
                )}
              >
                Sabia que estudar no mesmo horário que um amigo ou colega (mesmo
                mutados no Discord) aumenta o foco em até 200%? Isso se chama{" "}
                <strong>Body Doubling</strong>. Convide alguém para a missão de
                hoje compartilhando o link abaixo:
              </p>

              <div
                className={cn(
                  "flex flex-col gap-3 p-4 rounded-xl mb-6 border",
                  isNightMode
                    ? "bg-neutral-800/50 border-neutral-700/50"
                    : "bg-neutral-900/50 border-neutral-800",
                )}
              >
                {activeItem && (
                  <div className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-1">
                    Missão Atual Selecionada:
                    <div className="text-white normal-case tracking-normal font-normal mt-1 text-sm bg-neutral-950/50 p-2 rounded-md border border-neutral-800/50">
                      {activeItem}
                    </div>
                  </div>
                )}
                <button
                  onClick={copyInviteLink}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors border",
                    hasCopiedLink
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : isNightMode
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500",
                  )}
                >
                  {hasCopiedLink ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Link Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar Link de Convite
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end shrink-0">
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 text-neutral-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Help / How to Use Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsHelpOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-3xl p-6 md:p-8 rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]",
                isNightMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-neutral-950 border-neutral-800",
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Como dominar suas madrugadas de código
                  </h2>
                  <p
                    className={cn(
                      "text-sm",
                      isNightMode ? "text-neutral-500" : "text-neutral-400",
                    )}
                  >
                    Manual rápido de sobrevivência e estudos universais
                  </p>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 pb-4 space-y-4 custom-scrollbar">
                <div
                  className={cn(
                    "p-5 rounded-xl border",
                    isNightMode
                      ? "bg-neutral-800/30 border-neutral-700/50"
                      : "bg-neutral-900/40 border-neutral-800",
                  )}
                >
                  <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    1. Organizando sua Madrugada
                  </h3>
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      isNightMode ? "text-neutral-400" : "text-neutral-300",
                    )}
                  >
                    Seu cérebro está cansado. Esqueça "estudar por horas". Use a
                    **Regra dos 5 Minutos**: inicie o timer e comprometa-se a
                    focar apenas 5 minutos no problema. O botão{" "}
                    <Moon className="w-3 h-3 inline text-indigo-400" /> ativa o
                    foco extremo para minimizar brilho e distrações.
                  </p>
                </div>

                <div
                  className={cn(
                    "p-5 rounded-xl border",
                    isNightMode
                      ? "bg-neutral-800/30 border-neutral-700/50"
                      : "bg-neutral-900/40 border-neutral-800",
                  )}
                >
                  <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    2. Estratégia de Micro-desafios
                  </h3>
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      isNightMode ? "text-neutral-400" : "text-neutral-300",
                    )}
                  >
                    Não tente "aprender Banco de Dados" de uma vez. Defina
                    micro-desafios. Uma missão grande deve ser quebrada no campo
                    **"Qual o próximo checkpoint pequeno?"**. Resolva um pequeno
                    problema de cada vez para gerar micro-vitórias antes do sono
                    bater.
                  </p>
                </div>

                <div
                  className={cn(
                    "p-5 rounded-xl border",
                    isNightMode
                      ? "bg-neutral-800/30 border-neutral-700/50"
                      : "bg-neutral-900/40 border-neutral-800",
                  )}
                >
                  <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    3. Utilizando o Mentor Inteligente
                  </h3>
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      isNightMode ? "text-neutral-400" : "text-neutral-300",
                    )}
                  >
                    Não peça a ele para fazer o código por você; peça para
                    explicar o que você não entende, ou te ensinar através de
                    conceitos rápidos, analogias ou trechos mínimos de código.
                    Clique no botão de Revisão Rápida para consolidar em 1
                    minuto o módulo da trilha. Use o Chat Lateral ativamente!
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800/50 flex justify-end shrink-0 mt-2">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                >
                  Entendi, bora codar!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-2xl p-6 rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]",
                isNightMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-neutral-950 border-neutral-800",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Configurações</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 space-y-6 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-neutral-800">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Trilha de Estudos Ativa
                  </label>
                  <div className="space-y-2">
                    {Object.values(curriculums).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Mudar para a trilha '${c.name}'? Seu progresso original não suportado neste layout ficará invisível até você voltar.`,
                            )
                          ) {
                            setSelectedCurriculumId(c.id);
                            setCustomCurriculum(null);
                          }
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl border transition-all flex flex-col gap-1",
                          selectedCurriculumId === c.id && !customCurriculum
                            ? "bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/50"
                            : "bg-neutral-900 border-neutral-800 hover:border-neutral-700",
                        )}
                      >
                        <span className="font-medium text-white">{c.name}</span>
                        <span className="text-xs text-neutral-500">
                          {c.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-neutral-300">
                      Notificações Inteligentes (Perfil TDAH)
                    </h3>
                    <button
                      onClick={() =>
                        setAdhdNotificationsEnabled(!adhdNotificationsEnabled)
                      }
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        adhdNotificationsEnabled
                          ? "bg-indigo-500"
                          : "bg-neutral-700",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all",
                          adhdNotificationsEnabled ? "left-5" : "left-1",
                        )}
                      />
                    </button>
                  </div>
                  <p
                    className={cn(
                      "text-xs mb-4",
                      isNightMode ? "text-neutral-500" : "text-neutral-400",
                    )}
                  >
                    Ative lembretes dinâmicos para pausas e hidratação. Ideal
                    para prevenir hiperfoco destrutivo.
                  </p>

                  {adhdNotificationsEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                        <label className="block text-xs font-medium text-neutral-400 mb-2 flex items-center gap-2">
                          <Wind className="w-3.5 h-3.5" /> Frequência de Pausa
                          (Minutos)
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={120}
                          value={pauseFrequencyMins}
                          onChange={(e) =>
                            setPauseFrequencyMins(
                              parseInt(e.target.value) || 30,
                            )
                          }
                          className={cn(
                            "w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50",
                          )}
                        />
                      </div>
                      <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                        <label className="block text-xs font-medium text-neutral-400 mb-2 flex items-center gap-2">
                          <Droplets className="w-3.5 h-3.5" /> Frequência de
                          Hidratação (Minutos)
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={240}
                          value={hydrationFrequencyMins}
                          onChange={(e) =>
                            setHydrationFrequencyMins(
                              parseInt(e.target.value) || 60,
                            )
                          }
                          className={cn(
                            "w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50",
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 mb-2">
                    Trilha Personalizada (Avançado)
                  </h3>
                  <p
                    className={cn(
                      "text-xs mb-3",
                      isNightMode ? "text-neutral-500" : "text-neutral-400",
                    )}
                  >
                    Substitua a trilha padrão colando seu próprio JSON.
                  </p>

                  {jsonError && (
                    <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                      {jsonError}
                    </div>
                  )}

                  <textarea
                    value={curriculumJson}
                    onChange={(e) => setCurriculumJson(e.target.value)}
                    spellCheck={false}
                    className={cn(
                      "w-full h-32 rounded-xl p-3 text-xs font-mono focus:outline-none mb-4 resize-none transition-colors",
                      isNightMode
                        ? "bg-black border border-neutral-800 text-neutral-300 focus:border-neutral-700"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-200 focus:border-indigo-500/50",
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end shrink-0 mt-auto flex-wrap">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Esta ação vai apagar todas as missões concluídas, diário, histórico de tempo e medalhas. O currículo original ou JSON personalizado continuará intacto. Deseja mesmo começar um novo ciclo de estudos?",
                      )
                    ) {
                      const keysToKeep = [
                        "senai-custom-curriculum",
                        "senai-selected-curriculum-id",
                        "senai-auto-format",
                      ];
                      Object.keys(localStorage).forEach((key) => {
                        if (
                          key.startsWith("senai-") &&
                          !keysToKeep.includes(key)
                        ) {
                          localStorage.removeItem(key);
                        }
                      });
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors mr-auto"
                  title="Começar Novo Semestre (Resetar Histórico)"
                >
                  🚀 Novo Semestre
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Restaurar a trilha ${curriculums[selectedCurriculumId].name}?`,
                      )
                    ) {
                      setCustomCurriculum(null);
                      setIsSettingsOpen(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                >
                  Limpar Custom
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCurriculum}
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                >
                  Salvar Trilha
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ergonomics Tip Popup */}
      <AnimatePresence>
        {showErgonomicsTip && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 w-80 bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start justify-between mb-2 text-teal-400">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <h3 className="font-medium text-sm">
                  {ERGONOMICS_TIPS[currentTipIndex].title}
                </h3>
              </div>
              <button
                onClick={() => setShowErgonomicsTip(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              {ERGONOMICS_TIPS[currentTipIndex].text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Absolute Night Mode Exit */}
      {isNightMode && (
        <button
          onClick={() => setIsNightMode(false)}
          className="absolute top-20 right-6 flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-900 bg-neutral-950 text-neutral-500 justify-center hover:text-neutral-300 hover:bg-neutral-900 transition-colors text-sm z-50"
        >
          <Sun className="w-4 h-4" /> Sair do Modo Madrugada
        </button>
      )}

      {/* Layout SaaS de Alta Performance com Sidebar */}
      <div
        className={cn(
          "min-h-screen flex flex-col md:flex-row transition-colors duration-500",
          isNightMode ? "bg-[#09090b]" : "bg-neutral-950",
        )}
      >
        {/* BARRA LATERAL ESQUERDA - SaaS Sidebar */}
        <div
          className={cn(
            "w-full md:w-64 border-b md:border-b-0 md:border-r p-5 shrink-0 flex flex-col justify-between sticky top-0 md:h-screen z-30 backdrop-blur-md",
            isNightMode
              ? "bg-[#09090b]/90 border-neutral-900/60"
              : "bg-neutral-950/95 border-neutral-900/80",
          )}
        >
          <div className="space-y-6">
            {/* Logo do SaaS com Rank / Nível Acoplado */}
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                  <Trophy className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-bold text-neutral-100 text-sm tracking-tight">
                    UNIVERSAL DEV HOOD
                  </h2>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    MODO MADRUGADA ACTIVE
                  </p>
                </div>
              </div>

              {/* Perfil do Estudante / Progresso de XP */}
              <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl p-3 mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nível {levelInfo.level}</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500 font-bold">
                    {levelInfo.totalXP}/{levelInfo.nextLevelXP} XP
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(1, levelInfo.progress)}%` }}
                  />
                </div>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider text-center">
                  {levelInfo.title}
                </p>
              </div>
            </div>

            {/* SELEÇÃO DE TABULAÇOES - Botões de Funções Focados */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block px-1">
                Menu SaaS
              </span>

              <button
                onClick={() => setActiveSaaSTab("stats")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                  activeSaaSTab === "stats"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm"
                    : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Dashboard & Selos</span>
                </div>
                <div className="flex items-center gap-1">
                  {streak > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {streak}d
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-500 border border-neutral-900">
                    F1
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveSaaSTab("curriculum")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                  activeSaaSTab === "curriculum"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm"
                    : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-400" />
                  <span>Roteiro da Trilha</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-500 border border-neutral-900">
                  F2
                </span>
              </button>

              <button
                onClick={() => setActiveSaaSTab("lab")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                  activeSaaSTab === "lab"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm"
                    : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Laboratório Prático</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-500 border border-neutral-900">
                  F3
                </span>
              </button>

              <button
                onClick={() => setActiveSaaSTab("chat")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                  activeSaaSTab === "chat"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm"
                    : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" />
                  <span>Orientador IA Chat</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-500 border border-neutral-900">
                  F4
                </span>
              </button>

              <button
                onClick={() => setActiveSaaSTab("career")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                  activeSaaSTab === "career"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm"
                    : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>Carreira & Pós-Graduação</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-500 border border-neutral-900">
                  F5
                </span>
              </button>
            </div>

            {/* Micro Vitórias rápidas na lateral */}
            {completedItems.length > 0 && (
              <div className="hidden md:block space-y-2 mt-4 pt-4 border-t border-neutral-900">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block px-1">
                  Concluídos Recentes
                </span>
                <div className="space-y-1">
                  {completedItems
                    .slice()
                    .reverse()
                    .slice(0, 2)
                    .map((item, id) => (
                      <div
                        key={`${item}-${id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900/30 border border-neutral-900 text-[10px] text-neutral-400 truncate"
                        title={item}
                      >
                        ✓ {item}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTROLES DO RODAPÉ DA SIDEBAR */}
          <div className="space-y-2.5 pt-4 md:border-t md:border-neutral-900">
            {/* Botão de Modo Noturno */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                isNightMode
                  ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
                  : "bg-neutral-900/40 border-neutral-950 text-neutral-400 hover:text-neutral-200",
              )}
              title={
                isNightMode
                  ? "Desativar modo madrugada"
                  : "Ativar modo madrugada de foco extremo"
              }
            >
              {isNightMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>{isNightMode ? "Modo Luz" : "Modo Madrugada"}</span>
            </button>

            {/* Outros Utilitários */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="py-2.5 rounded-lg border border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:text-indigo-400 transition-colors flex items-center justify-center"
                title="Ajuda e Manual do Aluno"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsToolsModalOpen(true)}
                className="py-2.5 rounded-lg border border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:text-indigo-400 transition-colors flex items-center justify-center"
                title="Ferramentas e Extensões"
              >
                <Briefcase className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="py-2.5 rounded-lg border border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:text-indigo-400 transition-colors flex items-center justify-center"
                title="Configurações da Trilha"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CONTAINER DO CONTEÚDO PRINCIPAL SaaS */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Cabeçalho superior dinâmico */}
          <div className="px-5 py-4 border-b border-neutral-900/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {activeSaaSTab === "lab" && (
                <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
              )}
              {activeSaaSTab === "chat" && (
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              )}
              {activeSaaSTab === "curriculum" && (
                <ClipboardList className="w-5 h-5 text-indigo-400" />
              )}
              {activeSaaSTab === "stats" && (
                <Flame className="w-5 h-5 text-indigo-400" />
              )}
              {activeSaaSTab === "career" && (
                <Briefcase className="w-5 h-5 text-purple-400" />
              )}
              <span className="font-bold text-neutral-200 text-sm uppercase tracking-wide">
                {activeSaaSTab === "lab" && "Laboratório e Sandbox de Código"}
                {activeSaaSTab === "chat" && "Conversa e Orientador com IA"}
                {activeSaaSTab === "curriculum" && "Minha Trilha Acadêmica"}
                {activeSaaSTab === "stats" && "Estatísticas de Foco & Medalhas"}
                {activeSaaSTab === "career" && "Roadmap de Carreira Tech"}
              </span>
            </div>

            {/* Invite Squad Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Convidar Squad</span>
              </button>
            </div>
          </div>

          {/* ÁREA DE EXIBIÇÃO DINÂMICA DAS ABAS */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
            <SaaSTabsArea
              activeSaaSTab={activeSaaSTab}
              setActiveSaaSTab={setActiveSaaSTab}
              isNightMode={isNightMode}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              startQuickReview={startQuickReview}
              isReviewLoading={isReviewLoading}
              microTasks={microTasks}
              handleToggleMicroTask={toggleMicroTask}
              handleDeleteMicroTask={deleteMicroTask}
              newMicroTaskText={newMicroTaskText}
              setNewMicroTaskText={setNewMicroTaskText}
              handleAddMicroTask={handleAddMicroTask}
              timerDurationMinutes={timerDurationMinutes}
              handleTimerDurationChange={handleTimerDurationChange}
              timeLeft={timeLeft}
              formatTime={formatTime}
              isActive={isActive}
              setIsActive={setIsActive}
              resetTimer={resetTimer}
              selectedCurriculumId={selectedCurriculumId}
              completedItems={completedItems}
              handleToggleSelectionOnly={handleAttemptCompletion}
              progressPercent={progressPercent}
              curriculum={curriculum}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
              streak={streak}
              totalFocusMinutes={totalFocusMinutes}
              focusGoalMinutes={dailyStudyGoalHours * 60}
              sctecGoals={sctecGoals}
              toggleSctecGoal={(goal) =>
                setSctecGoals((prev) => ({ ...prev, [goal]: !prev[goal] }))
              }
              dailyFocusDataRaw={dailyFocusDataRaw}
              shiftFocus={shiftFocus}
              combatErrors={combatErrors}
              chartData={chartData}
              setCombatErrors={setCombatErrors}
              isAutoFormatEnabled={isAutoFormatEnabled}
              setIsAutoFormatEnabled={setIsAutoFormatEnabled}
              setSelectedCurriculumId={setSelectedCurriculumId}
              setCustomCurriculum={setCustomCurriculum}
            />

            {false && (
              <div className="grid grid-cols-1 gap-6">
                <div
                  className={cn(
                    "space-y-6 animate-in fade-in slide-in-from-left-4 duration-500",
                    isImmersiveMode ? "hidden" : "lg:col-span-5",
                    isNightMode &&
                      "opacity-30 hover:opacity-100 transition-opacity duration-500 contrast-75 saturate-0",
                    mobileActiveTab === "trilha" ? "block" : "hidden lg:block",
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-3xl font-medium tracking-tight text-white flex items-center gap-2">
                        Stats & Foco
                      </h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsCurriculumDrawerOpen(true)}
                          className="flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                          title="Menu de Roteiro de Aula"
                        >
                          <ClipboardList className="w-5 h-5" />
                          <span className="text-sm font-bold hidden sm:inline">
                            Roteiro
                          </span>
                        </button>
                        <button
                          onClick={() => setIsInviteOpen(true)}
                          className="p-3 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Convidar Squad (Body Doubling)"
                        >
                          <Users className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsHelpOpen(true)}
                          className="p-3 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Como usar o sistema"
                        >
                          <HelpCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsToolsModalOpen(true)}
                          className="p-3 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Kit de Ferramentas (Extensões úteis)"
                        >
                          <Briefcase className="w-5 h-5" />
                        </button>
                        <button
                          onClick={openSettings}
                          className="p-3 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Configurar Trilha Personalizada"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsNightMode(true)}
                          className="p-3 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Ativar Modo Madrugada (Foco Extremo)"
                        >
                          <Moon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-neutral-500 mb-6">
                      Plataforma Universal de Desenvolvimento Full-Stack. Foco
                      noturno.
                    </p>

                    {/* Progress Bar */}
                    <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-5 mb-8">
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="font-medium text-neutral-300">
                          Trilha de Missões Práticas
                        </span>
                        <div className="flex items-center gap-2">
                          <AnimatePresence mode="popLayout">
                            <motion.span
                              key={progressPercent}
                              initial={{ opacity: 0, y: -10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className="text-indigo-400 font-bold"
                            >
                              {progressPercent}%
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-indigo-400/60 font-medium">
                            completo
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "h-2 w-full rounded-full overflow-hidden relative",
                          isNightMode ? "bg-neutral-950" : "bg-neutral-800",
                        )}
                      >
                        <motion.div
                          className={cn(
                            "h-full relative",
                            isNightMode ? "bg-neutral-800" : "bg-indigo-500",
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{
                            type: "spring",
                            bounce: 0.25,
                            duration: 0.8,
                          }}
                        >
                          {!isNightMode && (
                            <motion.div
                              className="absolute inset-x-0 top-0 h-full bg-white/30"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                                repeatDelay: 1,
                              }}
                            />
                          )}
                        </motion.div>
                      </div>
                      <div className="mt-3 text-xs text-neutral-500 flex justify-between items-center">
                        <span>
                          {completedInCurrentCurriculum.length} de {totalItems}{" "}
                          missões concluídas
                        </span>
                      </div>
                    </div>

                    {/* Victory Gallery */}
                    {completedInCurrentCurriculum.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5 text-yellow-500" />{" "}
                          Galeria de Vitórias
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {completedInCurrentCurriculum
                              .slice()
                              .reverse()
                              .slice(0, 5)
                              .map((item) => (
                                <motion.div
                                  key={item}
                                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/60 border border-neutral-800 rounded-lg text-xs"
                                >
                                  <span className="text-neutral-300 truncate max-w-[150px]">
                                    {item}
                                  </span>
                                </motion.div>
                              ))}
                            {completedInCurrentCurriculum.length > 5 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center px-3 py-1.5 bg-neutral-900/30 border border-neutral-800/50 rounded-lg text-xs text-neutral-500 font-medium"
                              >
                                +{completedInCurrentCurriculum.length - 5}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Badges Gallery */}
                    {badges && badges.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-medium text-neutral-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-500" /> Medalhas
                          Especiais
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {badges.map((badge, idx) => (
                              <motion.div
                                key={`${badge}-${idx}`}
                                initial={{
                                  opacity: 0,
                                  scale: 0.5,
                                  y: 20,
                                  rotate: -5,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                  y: 0,
                                  rotate: 0,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 350,
                                  damping: 25,
                                  delay: idx * 0.05,
                                }}
                                className={cn(
                                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold shadow-lg shadow-purple-500/10",
                                  isNightMode
                                    ? "bg-purple-900/10 border-purple-500/20 text-purple-400"
                                    : "bg-purple-500/10 border-purple-500/30 text-purple-300",
                                )}
                              >
                                {badge}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Advanced Study Dashboard */}
                    <StudyStatsDashboard
                      isNightMode={isNightMode}
                      dailyFocusData={dailyFocusDataRaw}
                      completedItems={completedItems}
                      shiftFocus={shiftFocus}
                      combatErrors={combatErrors}
                    />

                    {/* Progress Chart and Streak */}
                    <div
                      className={cn(
                        "rounded-xl p-5 mb-8 relative overflow-hidden transition-colors duration-500",
                        isNightMode
                          ? "bg-black border border-neutral-900/50"
                          : "bg-neutral-900/40 border border-neutral-800/50",
                      )}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-medium text-neutral-300">
                          Minutos de Foco (Últimos Dias)
                        </h3>
                        {streak > 0 && (
                          <div
                            className={cn(
                              "flex items-center gap-1.5 border px-2.5 py-1 rounded-full",
                              isNightMode
                                ? "bg-neutral-900 border-neutral-800"
                                : "bg-orange-500/10 border-orange-500/20",
                            )}
                          >
                            <Flame
                              className={cn(
                                "w-3.5 h-3.5",
                                isNightMode
                                  ? "text-neutral-500 fill-neutral-500"
                                  : "text-orange-500 fill-orange-500",
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-bold",
                                isNightMode
                                  ? "text-neutral-500"
                                  : "text-orange-500",
                              )}
                            >
                              {streak} {streak === 1 ? "Dia" : "Dias"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#737373", fontSize: 12 }}
                              dy={10}
                            />
                            <Tooltip
                              cursor={{ fill: "#262626" }}
                              contentStyle={{
                                backgroundColor: "#171717",
                                borderColor: "#262626",
                                borderRadius: "8px",
                                color: "#e5e5e5",
                              }}
                              itemStyle={{ color: "#818cf8" }}
                            />
                            <Bar
                              dataKey="minutes"
                              fill={isNightMode ? "#3f3f46" : "#6366f1"}
                              radius={[4, 4, 0, 0]}
                              name="Minutos"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Active Task Card */}
                  <div
                    className={cn(
                      "rounded-2xl border backdrop-blur-sm transition-colors",
                      isNightMode
                        ? "border-neutral-900 bg-neutral-950/40 p-8"
                        : "border-indigo-500/20 bg-indigo-500/5 p-6",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between mb-4",
                        isNightMode ? "text-neutral-600" : "text-indigo-400",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        <h2 className="font-medium">Foco Atual</h2>
                      </div>
                      {activeItem && !isReviewOpen && (
                        <button
                          onClick={startQuickReview}
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors",
                            isNightMode
                              ? "bg-neutral-900 text-neutral-500 hover:bg-neutral-800"
                              : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
                          )}
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" /> Revisão
                          Rápida
                        </button>
                      )}
                    </div>

                    {activeItem ? (
                      <div>
                        {isReviewOpen ? (
                          <div className="animate-in fade-in duration-300">
                            <div className="flex items-start gap-3 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-5">
                              <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-neutral-300 mb-2">
                                  Desafio de Aquecimento:
                                </div>
                                {isReviewLoading ? (
                                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                    Gerando pergunta...
                                  </div>
                                ) : (
                                  <p className="text-sm text-indigo-200 leading-relaxed">
                                    {reviewQuestion}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={startFocusAfterReview}
                              disabled={isReviewLoading}
                              className={cn(
                                "w-full flex justify-center items-center gap-2 py-3 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium rounded-xl transition-colors text-sm",
                                isNightMode
                                  ? "bg-neutral-900 hover:bg-neutral-800"
                                  : "bg-indigo-500 hover:bg-indigo-600",
                              )}
                            >
                              <Play className="w-4 h-4 fill-current" /> Começar
                              Foco de 5 Minutos
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-4 mb-6">
                              <p
                                className={cn(
                                  "font-medium leading-snug",
                                  isNightMode
                                    ? "text-xl text-neutral-300"
                                    : "text-lg text-white",
                                )}
                              >
                                {activeItem}
                              </p>
                              {reviewStatus[activeItem] ===
                              new Date().toISOString().split("T")[0] ? (
                                <span
                                  className={cn(
                                    "shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border",
                                    isNightMode
                                      ? "bg-neutral-900 text-neutral-500 border-neutral-800"
                                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                                  )}
                                >
                                  Revisado Hoje
                                </span>
                              ) : (
                                <span
                                  className={cn(
                                    "shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border",
                                    isNightMode
                                      ? "bg-neutral-900 text-neutral-500 border-neutral-800"
                                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                  )}
                                >
                                  Pendente
                                </span>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div
                                  className={cn(
                                    "text-sm font-medium",
                                    isNightMode
                                      ? "text-neutral-700"
                                      : "text-neutral-400",
                                  )}
                                >
                                  Micro-desafios (Checkpoints):
                                </div>
                                {microTasks[activeItem]?.length > 0 && (
                                  <span
                                    className={cn(
                                      "text-xs font-mono",
                                      isNightMode
                                        ? "text-neutral-600"
                                        : "text-neutral-500",
                                    )}
                                  >
                                    {
                                      microTasks[activeItem].filter(
                                        (t) => t.completed,
                                      ).length
                                    }
                                    /{microTasks[activeItem].length}
                                  </span>
                                )}
                              </div>

                              {microTasks[activeItem]?.length > 0 && (
                                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/50">
                                  <div
                                    className="h-full bg-indigo-500 transition-all duration-500"
                                    style={{
                                      width: `${(microTasks[activeItem].filter((t) => t.completed).length / microTasks[activeItem].length) * 100}%`,
                                    }}
                                  />
                                </div>
                              )}

                              <div className="space-y-2 mt-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                                {microTasks[activeItem]?.map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-2 group"
                                  >
                                    <button
                                      onClick={() => toggleMicroTask(task.id)}
                                      className={cn(
                                        "mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                                        task.completed
                                          ? "bg-indigo-500 border-indigo-500 text-white"
                                          : isNightMode
                                            ? "border-neutral-700"
                                            : "border-neutral-600",
                                      )}
                                    >
                                      {task.completed && (
                                        <CheckCircle2 className="w-3 h-3" />
                                      )}
                                    </button>
                                    <span
                                      className={cn(
                                        "text-sm",
                                        task.completed
                                          ? isNightMode
                                            ? "text-neutral-700 line-through"
                                            : "text-neutral-500 line-through"
                                          : isNightMode
                                            ? "text-neutral-400"
                                            : "text-neutral-300",
                                      )}
                                    >
                                      {task.text}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <input
                                type="text"
                                placeholder="Adicionar pequeno passo... (Enter)"
                                value={newMicroTaskText}
                                onChange={(e) =>
                                  setNewMicroTaskText(e.target.value)
                                }
                                onKeyDown={handleAddMicroTask}
                                className={cn(
                                  "w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors mt-2 border",
                                  isNightMode
                                    ? "bg-black border-neutral-900 text-neutral-400 placeholder:text-neutral-800 focus:border-neutral-700"
                                    : "bg-neutral-900/50 border-neutral-800 text-neutral-200 placeholder:text-neutral-600 focus:border-indigo-500/50",
                                )}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "text-sm",
                          isNightMode ? "text-neutral-700" : "text-neutral-500",
                        )}
                      >
                        Selecione uma missão na trilha para definir seu foco e
                        evitar distrações.
                      </div>
                    )}
                  </div>

                  {/* Timer */}
                  <div
                    className={cn(
                      "rounded-2xl border p-6 transition-colors",
                      isNightMode
                        ? "border-neutral-900 bg-neutral-950/40 p-8"
                        : "border-neutral-800 bg-neutral-900/20",
                    )}
                  >
                    <div className="flex flex-col items-center mb-6">
                      <div className="flex w-full items-center justify-between gap-4 mb-4">
                        <div
                          className={cn(
                            "text-xs font-mono uppercase tracking-widest hidden sm:block",
                            isNightMode
                              ? "text-neutral-700"
                              : "text-neutral-500",
                          )}
                        >
                          Ciclo
                        </div>
                        <div className="flex items-center gap-1 mx-auto sm:mx-0">
                          {[5, 25, 45, 60].map((min) => (
                            <button
                              key={min}
                              onClick={() => handleTimerDurationChange(min)}
                              className={cn(
                                "px-2 py-1 text-xs font-medium rounded-md transition-all border",
                                timerDurationMinutes === min
                                  ? isNightMode
                                    ? "bg-neutral-800 text-neutral-300 border-neutral-700"
                                    : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                                  : isNightMode
                                    ? "text-neutral-700 hover:text-neutral-500 border-transparent hover:bg-neutral-900"
                                    : "text-neutral-500 hover:text-neutral-300 border-transparent hover:bg-neutral-800",
                              )}
                            >
                              {min}m
                            </button>
                          ))}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-5xl font-mono tracking-tight",
                          isNightMode ? "text-neutral-400" : "text-white",
                        )}
                      >
                        {formatTime(timeLeft)}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setIsActive(!isActive)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                          isActive
                            ? isNightMode
                              ? "bg-neutral-900 text-neutral-500"
                              : "bg-neutral-800 hover:bg-neutral-700 text-white"
                            : isNightMode
                              ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
                              : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20",
                        )}
                      >
                        {isActive ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <button
                        onClick={resetTimer}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                          isNightMode
                            ? "bg-neutral-900 text-neutral-600 hover:bg-neutral-800"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white",
                        )}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Produtividade / Average Time */}
                  <div
                    className={cn(
                      "rounded-2xl border p-6 transition-colors",
                      isNightMode
                        ? "border-neutral-900 bg-neutral-950/40 p-6"
                        : "border-neutral-800 bg-neutral-900/20",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <h2 className="font-medium text-white">
                        Resumo de Produtividade
                      </h2>
                    </div>
                    <div
                      className={cn(
                        "text-xs mb-3 leading-relaxed",
                        isNightMode ? "text-neutral-500" : "text-neutral-400",
                      )}
                    >
                      Média de tempo gasto nas missões que você já concluiu
                      nesta trilha.
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "text-3xl font-bold tracking-tight",
                          isNightMode ? "text-neutral-300" : "text-white",
                        )}
                      >
                        {averageMissionTime > 0 ? averageMissionTime : "--"}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          isNightMode ? "text-neutral-600" : "text-neutral-500",
                        )}
                      >
                        min / missão
                      </span>
                    </div>
                  </div>

                  {/* Dicas de IA (Copiloto) */}
                  <AIPackageSuggester
                    selectedCurriculumId={selectedCurriculumId}
                    isNightMode={isNightMode}
                  />

                  {/* Metas SCTEC / Carreira Tech Checklist */}
                  <div
                    className={cn(
                      "rounded-2xl border p-6 transition-colors",
                      isNightMode
                        ? "border-neutral-900 bg-neutral-950/40"
                        : "border-neutral-800 bg-neutral-900/20",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <h2 className="font-medium text-white">
                        Carreira Tech (SCTEC)
                      </h2>
                    </div>
                    <p
                      className={cn(
                        "text-xs mb-4 leading-relaxed",
                        isNightMode ? "text-neutral-500" : "text-neutral-400",
                      )}
                    >
                      Acompanhe os requisitos práticos para consolidar seu
                      perfil dev e ser mestre full-stack:
                    </p>

                    {/* Meta Diária */}
                    <div className="mb-5 pb-5 border-b border-neutral-800/60">
                      <label className="flex items-center justify-between text-sm mb-2">
                        <span
                          className={cn(
                            "font-medium",
                            isNightMode
                              ? "text-neutral-400"
                              : "text-neutral-300",
                          )}
                        >
                          Meta Diária de Foco
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="24"
                            value={dailyStudyGoalHours}
                            onChange={(e) =>
                              setDailyStudyGoalHours(
                                Math.max(
                                  1,
                                  Math.min(24, parseInt(e.target.value) || 1),
                                ),
                              )
                            }
                            className={cn(
                              "w-16 px-2 py-1 bg-transparent border rounded-lg text-center text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50",
                              isNightMode
                                ? "border-neutral-800"
                                : "border-neutral-700",
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs",
                              isNightMode
                                ? "text-neutral-500"
                                : "text-neutral-400",
                            )}
                          >
                            horas
                          </span>
                        </div>
                      </label>
                      <div className="flex w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, (totalFocusMinutes / 60 / dailyStudyGoalHours) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between items-center text-[10px] uppercase tracking-wider text-neutral-500">
                        <span>
                          {(totalFocusMinutes / 60).toFixed(1)}h focadas
                        </span>
                        <span>{dailyStudyGoalHours}h meta</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          setSctecGoals((prev) => ({
                            ...prev,
                            "assistir-videos": !prev["assistir-videos"],
                          }))
                        }
                        className="flex items-start gap-3 w-full text-left transition-colors group"
                      >
                        <div className="mt-0.5 shrink-0 transition-transform group-active:scale-95">
                          {sctecGoals["assistir-videos"] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 group-hover:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <div
                            className={cn(
                              "text-xs font-semibold",
                              sctecGoals["assistir-videos"]
                                ? "text-neutral-500 line-through"
                                : "text-neutral-200",
                            )}
                          >
                            Assistir Videoaulas Completas
                          </div>
                          <div className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                            Sem pular partes e sem trocar de aba para pontuar
                            corretamente.
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          setSctecGoals((prev) => ({
                            ...prev,
                            "desafio-extra": !prev["desafio-extra"],
                          }))
                        }
                        className="flex items-start gap-3 w-full text-left transition-colors group"
                      >
                        <div className="mt-0.5 shrink-0 transition-transform group-active:scale-95">
                          {sctecGoals["desafio-extra"] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 group-hover:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <div
                            className={cn(
                              "text-xs font-semibold",
                              sctecGoals["desafio-extra"]
                                ? "text-neutral-500 line-through"
                                : "text-neutral-200",
                            )}
                          >
                            Desafio Extra (Opcional)
                          </div>
                          <div className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                            Deve ser concluído e enviado antes de submeter a
                            avaliação final.
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          setSctecGoals((prev) => ({
                            ...prev,
                            "avaliacao-regular": !prev["avaliacao-regular"],
                          }))
                        }
                        className="flex items-start gap-3 w-full text-left transition-colors group"
                      >
                        <div className="mt-0.5 shrink-0 transition-transform group-active:scale-95">
                          {sctecGoals["avaliacao-regular"] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 group-hover:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <div
                            className={cn(
                              "text-xs font-semibold",
                              sctecGoals["avaliacao-regular"]
                                ? "text-neutral-500 line-through"
                                : "text-neutral-200",
                            )}
                          >
                            Avaliação Regular (Nota ≥ 7)
                          </div>
                          <div className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                            Questões objetivas. Até 5 tentativas disponíveis no
                            portal.
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          setSctecGoals((prev) => ({
                            ...prev,
                            "prazo-20-dias": !prev["prazo-20-dias"],
                          }))
                        }
                        className="flex items-start gap-3 w-full text-left transition-colors group"
                      >
                        <div className="mt-0.5 shrink-0 transition-transform group-active:scale-95">
                          {sctecGoals["prazo-20-dias"] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 group-hover:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <div
                            className={cn(
                              "text-xs font-semibold",
                              sctecGoals["prazo-20-dias"]
                                ? "text-neutral-500 line-through"
                                : "text-neutral-200",
                            )}
                          >
                            Prazo Limite: 20 Dias
                          </div>
                          <div className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                            Acompanhe sua data limite de 20 dias a partir da
                            matrícula.
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Lab & Chat */}
                <div
                  className={cn(
                    isNightMode
                      ? "animate-in zoom-in-95 fade-in duration-700"
                      : "",
                    isImmersiveMode
                      ? "lg:col-span-12 max-w-4xl mx-auto w-full"
                      : "lg:col-span-7",
                    mobileActiveTab === "foco" ? "block" : "hidden lg:block",
                  )}
                >
                  <div
                    className={cn(
                      "sticky top-16 flex flex-col h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border",
                      isNightMode
                        ? "bg-neutral-950/40 border-neutral-900"
                        : "bg-white/5 border-neutral-800",
                    )}
                  >
                    {/* Abas do Mentor & Laboratório */}
                    <div className="flex border-b border-neutral-800 bg-neutral-900/40 shrink-0">
                      <button
                        onClick={() => setActiveRightTab("chat")}
                        className={cn(
                          "flex-1 text-center py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all",
                          activeRightTab === "chat"
                            ? "text-indigo-400 border-indigo-500 bg-neutral-900/30 font-bold"
                            : "text-neutral-500 border-transparent hover:text-neutral-300",
                        )}
                      >
                        Chat do Mentor
                      </button>
                      <button
                        onClick={() => setActiveRightTab("sandbox")}
                        className={cn(
                          "flex-1 text-center py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all",
                          activeRightTab === "sandbox"
                            ? "text-indigo-400 border-indigo-500 bg-neutral-900/30 font-bold"
                            : "text-neutral-500 border-transparent hover:text-neutral-300",
                        )}
                      >
                        Laboratório Prático (HTML)
                      </button>
                    </div>

                    {activeRightTab === "chat" ? (
                      <div className="flex-1 flex flex-col h-full min-h-0 overflow-y-auto px-1 py-4 space-y-4 custom-scrollbar">
                        <MentorChat
                          activeTopic={activeItem}
                          isNightMode={isNightMode}
                          isAutoFormatEnabled={isAutoFormatEnabled}
                          onToggleAutoFormat={() =>
                            setIsAutoFormatEnabled(!isAutoFormatEnabled)
                          }
                          completedItems={completedItems}
                        />
                        <Logbook isNightMode={isNightMode} />
                      </div>
                    ) : (
                      <CodeSandbox
                        isNightMode={isNightMode}
                        isAutoFormatEnabled={isAutoFormatEnabled}
                        onSendToMentor={(codeMessage) => {
                          setActiveRightTab("chat");
                          setTimeout(() => {
                            window.dispatchEvent(
                              new CustomEvent("send-to-mentor", {
                                detail: codeMessage,
                              }),
                            );
                          }, 200);
                        }}
                        onSolvedBug={(category) => {
                          setCombatErrors((prev) => ({
                            ...prev,
                            [category]: (prev[category] || 0) + 1,
                          }));
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ProTipsSidebar isNightMode={isNightMode} />
      </div>

      <MissionLogbook
        completedItems={completedItems}
        completionTimes={completionTimes}
        missionTime={missionTime}
        isNightMode={isNightMode}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-50 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-4 flex items-center gap-4 max-w-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center shrink-0"
            >
              {toastMessage.icon || (
                <Award className="w-6 h-6 text-indigo-400" />
              )}
            </motion.div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">
                {toastMessage.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 leading-snug">
                {toastMessage.msg}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Reward Modal (Level Up / Medal) */}
      <AnimatePresence>
        {rewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100, rotateX: 45 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50, rotateX: -20, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm rounded-[2rem] bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 shadow-2xl overflow-hidden p-8 text-center"
            >
              {/* Radial glow background effect */}
              <div className={cn(
                "absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-full rounded-full blur-3xl opacity-20 pointer-events-none",
                rewardModal.type === 'levelUp' ? 'bg-emerald-500' : 'bg-amber-500'
              )} />

              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 15,
                  delay: 0.15,
                }}
                className="relative mx-auto flex items-center justify-center w-32 h-32 rounded-full bg-neutral-900/50 border border-neutral-800 shadow-inner mb-6"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {rewardModal.icon}
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "text-3xl font-black uppercase tracking-tight mb-2 drop-shadow-md",
                  rewardModal.type === 'levelUp' ? 'text-emerald-400' : 'text-amber-400'
                )}
              >
                {rewardModal.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-neutral-300 font-medium leading-tight mb-8"
              >
                {rewardModal.subtitle}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                onClick={() => setRewardModal(null)}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-black",
                  rewardModal.type === 'levelUp' 
                    ? 'bg-emerald-500 hover:bg-emerald-400 focus:ring-emerald-500/50' 
                    : 'bg-amber-500 hover:bg-amber-400 focus:ring-amber-500/50'
                )}
              >
                Continuar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 30s Architecture / Best Practice Tip */}
      <ArchitectureTipNotification
        tip={activeTip}
        onDismiss={dismissTip}
        onTriggerRandom={triggerRandomTipManual}
        isNightMode={isNightMode}
      />
    </div>
  );
}
