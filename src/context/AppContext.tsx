import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  UserProfile,
  LessonProgress,
  Habit,
  HabitLog,
  DailyPriority,
  DiagnosticEvaluation,
  SmartGoal,
  FocusSession,
  TwoMinuteSession,
  DigitalDetoxPlan,
  HabitLoopEntry,
  FinancialItem,
  FinancialPlan,
  BackupData,
  Achievement,
} from '../types';
import { getLocalDateString, parseLocalDate } from '../utils/habitCalculations';
import { calculateDiagnosticAverages } from '../data/diagnosticQuestions';

const STORAGE_KEYS = {
  PROFILE: 'cdv_profile_v1',
  LESSONS: 'cdv_lessons_v1',
  HABITS: 'cdv_habits_v1',
  HABIT_LOGS: 'cdv_habit_logs_v1',
  PRIORITIES: 'cdv_priorities_v1',
  DIAGNOSTICS: 'cdv_diagnostics_v1',
  GOALS: 'cdv_goals_v1',
  FOCUS: 'cdv_focus_v1',
  TWO_MIN: 'cdv_twomin_v1',
  DETOX: 'cdv_detox_v1',
  HABIT_LOOPS: 'cdv_habit_loops_v1',
  FINANCES: 'cdv_finances_v1',
  FIN_PLAN: 'cdv_fin_plan_v1',
  FAVORITE_BOOKS: 'cdv_favorite_books_v1',
  DAILY_REFLECTIONS: 'cdv_daily_reflections_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  mainGoal: '',
  startDate: getLocalDateString(),
  preferredReminderTime: '08:00',
  notificationsEnabled: false,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  fontScale: 'normal',
  reducedMotion: false,
};

const DEFAULT_DETOX: DigitalDetoxPlan = {
  estimatedDailyMinutes: 180,
  targetDailyMinutes: 60,
  checkedEnvironment: {
    notifications_off: false,
    home_screen_clean: false,
    grayscale_mode: false,
    charging_outside_bedroom: false,
    no_phones_at_table: false,
  },
  allowedWindows: ['12:00 - 12:30', '19:30 - 20:00'],
  alternativeActivities: [
    'Leitura de 10 páginas de livro físico',
    'Caminhada rápida de 15 minutos sem fone',
    'Alongamento corporal e respiração guiada',
    'Conversa pessoal sem telas presentes',
    'Escrita das prioridades do dia seguinte',
  ],
  updatedAt: new Date().toISOString(),
};

const DEFAULT_FIN_PLAN: FinancialPlan = {
  emergencyReserveGoal: 5000,
  currentReserve: 0,
};

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>, initialHabits: string[]) => void;

  // Journey
  lessonsProgress: Record<number, LessonProgress>;
  currentDayOfJourney: number;
  completedDaysCount: number;
  toggleLessonCheckItem: (day: number, itemId: string) => void;
  completeLesson: (day: number, reflection?: string) => void;
  undoLessonCompletion: (day: number) => void;
  saveLessonReflection: (day: number, reflection: string) => void;
  restartJourney: () => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  toggleHabitLog: (habitId: string, dateStr?: string) => void;

  // Priorities
  priorities: DailyPriority[];
  todayPriorities: DailyPriority[];
  addPriority: (text: string, dateStr?: string) => boolean;
  togglePriority: (id: string) => void;
  deletePriority: (id: string) => void;

  // Diagnostics
  diagnostics: DiagnosticEvaluation[];
  saveDiagnostic: (scores: Record<string, number | null>, chosenFocusPillar?: string) => DiagnosticEvaluation;

  // Goals
  goals: SmartGoal[];
  addGoal: (goalData: Omit<SmartGoal, 'id' | 'createdAt' | 'completed' | 'archived' | 'weeklyReviews'>) => SmartGoal;
  updateGoal: (id: string, updates: Partial<SmartGoal>) => void;
  archiveGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addWeeklyReview: (goalId: string, review: Omit<SmartGoal['weeklyReviews'][0], 'id'>) => void;

  // Focus & Tools
  focusSessions: FocusSession[];
  recordFocusSession: (task: string, presetMinutes: number, actualMinutes: number) => void;
  twoMinuteSessions: TwoMinuteSession[];
  recordTwoMinuteSession: (session: Omit<TwoMinuteSession, 'id' | 'date'>) => void;

  // Detox
  detoxPlan: DigitalDetoxPlan;
  updateDetoxPlan: (updates: Partial<DigitalDetoxPlan>) => void;

  // Habit Loop
  habitLoops: HabitLoopEntry[];
  addHabitLoop: (entry: Omit<HabitLoopEntry, 'id' | 'date'>) => void;
  deleteHabitLoop: (id: string) => void;

  // Finances
  finances: FinancialItem[];
  financialPlan: FinancialPlan;
  addFinancialItem: (item: Omit<FinancialItem, 'id'>) => void;
  deleteFinancialItem: (id: string) => void;
  updateFinancialPlan: (updates: Partial<FinancialPlan>) => void;

  // Library & Reflections
  favoriteBookIds: string[];
  toggleBookFavorite: (bookId: string) => void;
  dailyReflections: Record<string, string>;
  saveDailyReflection: (dateStr: string, text: string) => void;

  // Achievements
  achievements: Achievement[];

  // Backup & Reset
  exportBackupJson: () => string;
  previewBackupJson: (jsonStr: string) => { valid: boolean; summary?: string; error?: string; backup?: BackupData };
  applyImportedBackup: (backup: BackupData) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
  const [lessonsProgress, setLessonsProgress] = useState<Record<number, LessonProgress>>(() =>
    loadFromStorage(STORAGE_KEYS.LESSONS, {})
  );
  const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage(STORAGE_KEYS.HABITS, []));
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => loadFromStorage(STORAGE_KEYS.HABIT_LOGS, []));
  const [priorities, setPriorities] = useState<DailyPriority[]>(() => loadFromStorage(STORAGE_KEYS.PRIORITIES, []));
  const [diagnostics, setDiagnostics] = useState<DiagnosticEvaluation[]>(() =>
    loadFromStorage(STORAGE_KEYS.DIAGNOSTICS, [])
  );
  const [goals, setGoals] = useState<SmartGoal[]>(() => loadFromStorage(STORAGE_KEYS.GOALS, []));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() =>
    loadFromStorage(STORAGE_KEYS.FOCUS, [])
  );
  const [twoMinuteSessions, setTwoMinuteSessions] = useState<TwoMinuteSession[]>(() =>
    loadFromStorage(STORAGE_KEYS.TWO_MIN, [])
  );
  const [detoxPlan, setDetoxPlan] = useState<DigitalDetoxPlan>(() =>
    loadFromStorage(STORAGE_KEYS.DETOX, DEFAULT_DETOX)
  );
  const [habitLoops, setHabitLoops] = useState<HabitLoopEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.HABIT_LOOPS, [])
  );
  const [finances, setFinances] = useState<FinancialItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.FINANCES, [])
  );
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan>(() =>
    loadFromStorage(STORAGE_KEYS.FIN_PLAN, DEFAULT_FIN_PLAN)
  );
  const [favoriteBookIds, setFavoriteBookIds] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.FAVORITE_BOOKS, [])
  );
  const [dailyReflections, setDailyReflections] = useState<Record<string, string>>(() =>
    loadFromStorage(STORAGE_KEYS.DAILY_REFLECTIONS, {})
  );

  // Sync state to storage
  useEffect(() => saveToStorage(STORAGE_KEYS.PROFILE, profile), [profile]);
  useEffect(() => saveToStorage(STORAGE_KEYS.LESSONS, lessonsProgress), [lessonsProgress]);
  useEffect(() => saveToStorage(STORAGE_KEYS.HABITS, habits), [habits]);
  useEffect(() => saveToStorage(STORAGE_KEYS.HABIT_LOGS, habitLogs), [habitLogs]);
  useEffect(() => saveToStorage(STORAGE_KEYS.PRIORITIES, priorities), [priorities]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DIAGNOSTICS, diagnostics), [diagnostics]);
  useEffect(() => saveToStorage(STORAGE_KEYS.GOALS, goals), [goals]);
  useEffect(() => saveToStorage(STORAGE_KEYS.FOCUS, focusSessions), [focusSessions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TWO_MIN, twoMinuteSessions), [twoMinuteSessions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DETOX, detoxPlan), [detoxPlan]);
  useEffect(() => saveToStorage(STORAGE_KEYS.HABIT_LOOPS, habitLoops), [habitLoops]);
  useEffect(() => saveToStorage(STORAGE_KEYS.FINANCES, finances), [finances]);
  useEffect(() => saveToStorage(STORAGE_KEYS.FIN_PLAN, financialPlan), [financialPlan]);
  useEffect(() => saveToStorage(STORAGE_KEYS.FAVORITE_BOOKS, favoriteBookIds), [favoriteBookIds]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DAILY_REFLECTIONS, dailyReflections), [dailyReflections]);

  // Apply font scale or reduced motion class to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-large', 'text-scale-xl');
    if (profile.fontScale === 'large') root.classList.add('text-scale-large');
    if (profile.fontScale === 'extra_large') root.classList.add('text-scale-xl');
  }, [profile.fontScale]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (data: Partial<UserProfile>, initialHabitTitles: string[]) => {
    const today = getLocalDateString();
    const newProfile: UserProfile = {
      ...profile,
      ...data,
      onboardingCompleted: true,
      startDate: data.startDate || today,
    };
    setProfile(newProfile);

    // Create selected initial habits
    if (initialHabitTitles.length > 0) {
      const createdHabits: Habit[] = initialHabitTitles.map((title, idx) => ({
        id: `habit_init_${Date.now()}_${idx}`,
        title,
        reason: 'Hábito prioritário selecionado no início da jornada.',
        category: 'rotina',
        activeDays: [1, 2, 3, 4, 5, 6, 0], // todos os dias por padrão
        archived: false,
        createdAt: new Date().toISOString(),
      }));
      setHabits((prev) => [...prev, ...createdHabits]);
    }
  };

  // Journey logic:
  // "Não avance vários dias automaticamente porque a pessoa ficou ausente. Preserve o progresso e ofereça 'Retomar de onde parei'."
  const completedDaysCount = useMemo(() => {
    return Object.values(lessonsProgress).filter((p) => p.completed).length;
  }, [lessonsProgress]);

  const currentDayOfJourney = useMemo(() => {
    // Find the first uncompleted day from 1 to 21
    for (let d = 1; d <= 21; d++) {
      if (!lessonsProgress[d]?.completed) {
        return d;
      }
    }
    return 21; // all completed
  }, [lessonsProgress]);

  const toggleLessonCheckItem = (day: number, itemId: string) => {
    setLessonsProgress((prev) => {
      const current = prev[day] || { day, completed: false, checkedItems: {} };
      const currentChecked = current.checkedItems || {};
      const newChecked = { ...currentChecked, [itemId]: !currentChecked[itemId] };
      return {
        ...prev,
        [day]: {
          ...current,
          checkedItems: newChecked,
        },
      };
    });
  };

  const completeLesson = (day: number, reflection?: string) => {
    setLessonsProgress((prev) => {
      const current = prev[day] || { day, completed: false, checkedItems: {} };
      return {
        ...prev,
        [day]: {
          ...current,
          completed: true,
          completedAt: new Date().toISOString(),
          reflection: reflection !== undefined ? reflection : current.reflection,
        },
      };
    });
  };

  const undoLessonCompletion = (day: number) => {
    setLessonsProgress((prev) => {
      const current = prev[day];
      if (!current) return prev;
      return {
        ...prev,
        [day]: {
          ...current,
          completed: false,
          completedAt: undefined,
        },
      };
    });
  };

  const saveLessonReflection = (day: number, reflection: string) => {
    setLessonsProgress((prev) => {
      const current = prev[day] || { day, completed: false, checkedItems: {} };
      return {
        ...prev,
        [day]: {
          ...current,
          reflection,
        },
      };
    });
  };

  const restartJourney = () => {
    // Resets journey completion state while preserving habits, history and reflections
    setLessonsProgress({});
    setProfile((prev) => ({
      ...prev,
      startDate: getLocalDateString(),
    }));
  };

  // Habits
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>): Habit => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const archiveHabit = (id: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, archived: true } : h)));
  };

  const toggleHabitLog = (habitId: string, dateStr: string = getLocalDateString()) => {
    setHabitLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.habitId === habitId && l.date === dateStr);
      if (existingIdx >= 0) {
        // Toggle or remove
        const existing = prev[existingIdx];
        if (existing.completed) {
          // Remove completion log
          return prev.filter((_, idx) => idx !== existingIdx);
        } else {
          const updated = [...prev];
          updated[existingIdx] = { ...existing, completed: true, completedAt: new Date().toISOString() };
          return updated;
        }
      } else {
        // Add new completion log (preventing double entries)
        const newLog: HabitLog = {
          id: `log_${Date.now()}_${habitId}`,
          habitId,
          date: dateStr,
          completed: true,
          completedAt: new Date().toISOString(),
        };
        return [...prev, newLog];
      }
    });
  };

  // Priorities (Max 3 per day)
  const todayStr = getLocalDateString();
  const todayPriorities = useMemo(() => {
    return priorities.filter((p) => p.date === todayStr);
  }, [priorities, todayStr]);

  const addPriority = (text: string, dateStr: string = getLocalDateString()): boolean => {
    const existingCount = priorities.filter((p) => p.date === dateStr).length;
    if (existingCount >= 3) {
      return false; // Hard cap of 3
    }
    const newPriority: DailyPriority = {
      id: `prio_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: dateStr,
      text: text.trim(),
      completed: false,
    };
    setPriorities((prev) => [...prev, newPriority]);
    return true;
  };

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p))
    );
  };

  const deletePriority = (id: string) => {
    setPriorities((prev) => prev.filter((p) => p.id !== id));
  };

  // Diagnostics
  const saveDiagnostic = (scores: Record<string, number | null>, chosenFocusPillar?: string): DiagnosticEvaluation => {
    const calculation = calculateDiagnosticAverages(scores);
    const newDiag: DiagnosticEvaluation = {
      id: `diag_${Date.now()}`,
      date: getLocalDateString(),
      scores,
      pillarAverages: calculation.pillarAverages,
      overallAverage: calculation.overallAverage,
      answeredCount: calculation.answeredCount,
      chosenFocusPillar,
    };
    setDiagnostics((prev) => [newDiag, ...prev]);
    return newDiag;
  };

  // Goals
  const addGoal = (goalData: Omit<SmartGoal, 'id' | 'createdAt' | 'completed' | 'archived' | 'weeklyReviews'>): SmartGoal => {
    const newGoal: SmartGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      completed: false,
      archived: false,
      weeklyReviews: [],
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<SmartGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const archiveGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, archived: true } : g)));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allCompleted = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);
        return {
          ...g,
          milestones: updatedMilestones,
          completed: allCompleted ? true : g.completed,
        };
      })
    );
  };

  const addWeeklyReview = (goalId: string, review: Omit<SmartGoal['weeklyReviews'][0], 'id'>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newReview = { ...review, id: `rev_${Date.now()}` };
        return {
          ...g,
          weeklyReviews: [newReview, ...g.weeklyReviews],
        };
      })
    );
  };

  // Focus
  const recordFocusSession = (task: string, presetMinutes: number, actualMinutes: number) => {
    const now = new Date();
    const session: FocusSession = {
      id: `focus_${Date.now()}`,
      task,
      presetMinutes,
      actualMinutes,
      startedAt: new Date(now.getTime() - actualMinutes * 60000).toISOString(),
      completedAt: now.toISOString(),
      completed: actualMinutes >= presetMinutes * 0.8,
    };
    setFocusSessions((prev) => [session, ...prev]);
  };

  const recordTwoMinuteSession = (sessionData: Omit<TwoMinuteSession, 'id' | 'date'>) => {
    const session: TwoMinuteSession = {
      ...sessionData,
      id: `twomin_${Date.now()}`,
      date: getLocalDateString(),
    };
    setTwoMinuteSessions((prev) => [session, ...prev]);
  };

  // Detox
  const updateDetoxPlan = (updates: Partial<DigitalDetoxPlan>) => {
    setDetoxPlan((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Habit Loop
  const addHabitLoop = (entry: Omit<HabitLoopEntry, 'id' | 'date'>) => {
    const newLoop: HabitLoopEntry = {
      ...entry,
      id: `loop_${Date.now()}`,
      date: getLocalDateString(),
    };
    setHabitLoops((prev) => [newLoop, ...prev]);
  };

  const deleteHabitLoop = (id: string) => {
    setHabitLoops((prev) => prev.filter((l) => l.id !== id));
  };

  // Finances
  const addFinancialItem = (item: Omit<FinancialItem, 'id'>) => {
    const newItem: FinancialItem = {
      ...item,
      id: `fin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    setFinances((prev) => [newItem, ...prev]);
  };

  const deleteFinancialItem = (id: string) => {
    setFinances((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFinancialPlan = (updates: Partial<FinancialPlan>) => {
    setFinancialPlan((prev) => ({ ...prev, ...updates }));
  };

  // Library & Reflections
  const toggleBookFavorite = (bookId: string) => {
    setFavoriteBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const saveDailyReflection = (dateStr: string, text: string) => {
    setDailyReflections((prev) => ({ ...prev, [dateStr]: text }));
  };

  // Achievements
  const achievements = useMemo<Achievement[]>(() => {
    const hasFirstAction = completedDaysCount > 0 || habitLogs.length > 0 || focusSessions.length > 0;
    const hasFocus = focusSessions.length > 0;
    const hasFirstWeek = [1, 2, 3, 4, 5, 6, 7].every((d) => lessonsProgress[d]?.completed);
    const hasCompletedJourney = completedDaysCount >= 21;

    return [
      {
        id: 'ach_primeiro_passo',
        title: 'Primeiro Passo',
        description: 'Você rompeu a inércia e concluiu sua primeira ação registrada no app.',
        condition: 'Completar 1 dia de jornada ou 1 hábito',
        unlockedAt: hasFirstAction ? profile.createdAt : null,
      },
      {
        id: 'ach_primeiro_foco',
        title: 'Primeira Sessão de Foco',
        description: 'Você realizou um bloco oficial de trabalho imersivo sem interrupções.',
        condition: 'Completar 1 sessão de foco de 25 ou 50 minutos',
        unlockedAt: hasFocus ? focusSessions[focusSessions.length - 1]?.completedAt || null : null,
      },
      {
        id: 'ach_primeira_semana',
        title: 'Primeira Semana Concluída',
        description: 'Você finalizou todo o módulo O Alinhamento (Dias 1 a 7).',
        condition: 'Completar os dias 1 ao 7 da Jornada',
        unlockedAt: hasFirstWeek ? lessonsProgress[7]?.completedAt || null : null,
      },
      {
        id: 'ach_jornada_concluida',
        title: 'Jornada Concluída (21 Dias)',
        description: 'Parabéns! Você concluiu todos os 21 dias do Modo Avanço.',
        condition: 'Completar os 21 dias do programa oficial',
        unlockedAt: hasCompletedJourney ? lessonsProgress[21]?.completedAt || null : null,
      },
    ];
  }, [completedDaysCount, habitLogs.length, focusSessions, lessonsProgress, profile.createdAt]);

  // Backup & Import
  const exportBackupJson = (): string => {
    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'Modo Avanço',
      profile,
      lessonsProgress,
      habits,
      habitLogs,
      priorities,
      diagnostics,
      goals,
      focusSessions,
      twoMinuteSessions,
      detoxPlan,
      habitLoops,
      finances,
      financialPlan,
      favoriteBookIds,
      dailyReflections,
    };
    return JSON.stringify(backup, null, 2);
  };

  const previewBackupJson = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr) as BackupData;
      if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Arquivo inválido: JSON corrompido ou vazio.' };
      }
      const isRecognizedApp = data.app === 'Modo Avanço' || data.app === 'Código da Virada' || !!data.profile;
      if (!isRecognizedApp) {
        return { valid: false, error: 'O arquivo não parece ser um backup válido do Modo Avanço.' };
      }

      const habitsCount = Array.isArray(data.habits) ? data.habits.length : 0;
      const completedDays = data.lessonsProgress
        ? Object.values(data.lessonsProgress).filter((p) => p.completed).length
        : 0;
      const goalsCount = Array.isArray(data.goals) ? data.goals.length : 0;
      const diagCount = Array.isArray(data.diagnostics) ? data.diagnostics.length : 0;

      const summary = `Versão ${data.version || 1} • Exportado em: ${new Date(
        data.exportedAt || Date.now()
      ).toLocaleDateString('pt-BR')} • ${habitsCount} hábitos cadastrados • ${completedDays} dias de jornada concluídos • ${goalsCount} metas SMART • ${diagCount} autoavaliações.`;

      return { valid: true, summary, backup: data };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar o arquivo';
      return { valid: false, error: `Erro ao processar arquivo JSON: ${errorMessage}` };
    }
  };

  const applyImportedBackup = (backup: BackupData) => {
    if (backup.profile) setProfile(backup.profile);
    if (backup.lessonsProgress) setLessonsProgress(backup.lessonsProgress);
    if (Array.isArray(backup.habits)) setHabits(backup.habits);
    if (Array.isArray(backup.habitLogs)) setHabitLogs(backup.habitLogs);
    if (Array.isArray(backup.priorities)) setPriorities(backup.priorities);
    if (Array.isArray(backup.diagnostics)) setDiagnostics(backup.diagnostics);
    if (Array.isArray(backup.goals)) setGoals(backup.goals);
    if (Array.isArray(backup.focusSessions)) setFocusSessions(backup.focusSessions);
    if (Array.isArray(backup.twoMinuteSessions)) setTwoMinuteSessions(backup.twoMinuteSessions);
    if (backup.detoxPlan) setDetoxPlan(backup.detoxPlan);
    if (Array.isArray(backup.habitLoops)) setHabitLoops(backup.habitLoops);
    if (Array.isArray(backup.finances)) setFinances(backup.finances);
    if (backup.financialPlan) setFinancialPlan(backup.financialPlan);
    if (Array.isArray(backup.favoriteBookIds)) setFavoriteBookIds(backup.favoriteBookIds);
    if (backup.dailyReflections) setDailyReflections(backup.dailyReflections);
  };

  const resetAllData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setProfile(DEFAULT_PROFILE);
    setLessonsProgress({});
    setHabits([]);
    setHabitLogs([]);
    setPriorities([]);
    setDiagnostics([]);
    setGoals([]);
    setFocusSessions([]);
    setTwoMinuteSessions([]);
    setDetoxPlan(DEFAULT_DETOX);
    setHabitLoops([]);
    setFinances([]);
    setFinancialPlan(DEFAULT_FIN_PLAN);
    setFavoriteBookIds([]);
    setDailyReflections({});
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        completeOnboarding,
        lessonsProgress,
        currentDayOfJourney,
        completedDaysCount,
        toggleLessonCheckItem,
        completeLesson,
        undoLessonCompletion,
        saveLessonReflection,
        restartJourney,
        habits,
        habitLogs,
        addHabit,
        updateHabit,
        archiveHabit,
        toggleHabitLog,
        priorities,
        todayPriorities,
        addPriority,
        togglePriority,
        deletePriority,
        diagnostics,
        saveDiagnostic,
        goals,
        addGoal,
        updateGoal,
        archiveGoal,
        toggleMilestone,
        addWeeklyReview,
        focusSessions,
        recordFocusSession,
        twoMinuteSessions,
        recordTwoMinuteSession,
        detoxPlan,
        updateDetoxPlan,
        habitLoops,
        addHabitLoop,
        deleteHabitLoop,
        finances,
        financialPlan,
        addFinancialItem,
        deleteFinancialItem,
        updateFinancialPlan,
        favoriteBookIds,
        toggleBookFavorite,
        dailyReflections,
        saveDailyReflection,
        achievements,
        exportBackupJson,
        previewBackupJson,
        applyImportedBackup,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
