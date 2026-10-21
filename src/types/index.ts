export type WeekNumber = 1 | 2 | 3;

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonChecklistItem {
  id: string;
  label: string;
  required: boolean;
}

export interface DayLesson {
  day: number;
  week: WeekNumber;
  title: string;
  subtitle: string;
  objective: string;
  readingBrief: string;
  practicalMission: string;
  checklist: LessonChecklistItem[];
  reflectionPrompt: string;
  sourceDoc: string;
  sourcePage: string;
  relatedToolId?: string;
}

export interface LessonProgress {
  day: number;
  completed: boolean;
  completedAt?: string;
  reflection?: string;
  checkedItems: Record<string, boolean>;
}

export interface UserProfile {
  name: string;
  mainGoal: string;
  startDate: string; // YYYY-MM-DD
  preferredReminderTime: string; // HH:mm
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  fontScale: 'normal' | 'large' | 'extra_large';
  reducedMotion: boolean;
}

export type HabitCategory = 'mental' | 'vitalidade' | 'intelectual' | 'financas' | 'rotina';

export interface Habit {
  id: string;
  title: string;
  reason: string;
  category: HabitCategory;
  activeDays: number[]; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  reminderTime?: string;
  archived: boolean;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt: string;
}

export interface DailyPriority {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  completed: boolean;
  goalId?: string;
}

export interface PillarScore {
  pillarId: 'mental' | 'vitalidade' | 'intelectual' | 'autoridade';
  subItemId: string;
  score: number | null; // 0 to 10 or null if unanswered
}

export interface DiagnosticEvaluation {
  id: string;
  date: string;
  scores: Record<string, number | null>;
  pillarAverages: Record<string, number>;
  overallAverage: number;
  answeredCount: number;
  chosenFocusPillar?: string;
}

export interface Milestone {
  id: string;
  label: string;
  completed: boolean;
}

export interface WeeklyReview {
  id: string;
  date: string;
  progressed: string;
  obstacles: string;
  adjustments: string;
  nextStep: string;
}

export interface SmartGoal {
  id: string;
  what: string;
  why: string;
  metricType: 'numeric' | 'milestones';
  metricUnit?: string;
  initialValue?: number;
  targetValue?: number;
  currentValue?: number;
  deadline: string; // YYYY-MM-DD
  resourcesObstacles: string;
  firstStep: string;
  milestones: Milestone[];
  connectedHabitId?: string;
  isPriority: boolean;
  completed: boolean;
  archived: boolean;
  weeklyReviews: WeeklyReview[];
  createdAt: string;
}

export interface FocusSession {
  id: string;
  task: string;
  presetMinutes: number;
  actualMinutes: number;
  startedAt: string;
  completedAt: string;
  completed: boolean;
}

export interface TwoMinuteSession {
  id: string;
  task: string;
  microAction: string;
  completed: boolean;
  continuedWork: boolean;
  difficultyLogged?: string;
  date: string;
}

export interface DigitalDetoxPlan {
  estimatedDailyMinutes: number;
  targetDailyMinutes: number;
  checkedEnvironment: Record<string, boolean>;
  allowedWindows: string[];
  alternativeActivities: string[];
  updatedAt: string;
}

export interface HabitLoopEntry {
  id: string;
  title: string;
  trigger: string;
  currentBehavior: string;
  perceivedReward: string;
  alternativeBehavior: string;
  effective: boolean;
  notes?: string;
  date: string;
}

export interface FinancialItem {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}

export interface FinancialPlan {
  emergencyReserveGoal: number;
  currentReserve: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  subtitle: string;
  sourceDoc: string;
  authorCredits: string;
  summary: string;
  chapters: {
    title: string;
    content: string;
  }[];
  practicalApplication: string;
  isFavorite?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: string;
  unlockedAt: string | null;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  app: string;
  profile: UserProfile;
  lessonsProgress: Record<number, LessonProgress>;
  habits: Habit[];
  habitLogs: HabitLog[];
  priorities: DailyPriority[];
  diagnostics: DiagnosticEvaluation[];
  goals: SmartGoal[];
  focusSessions: FocusSession[];
  twoMinuteSessions: TwoMinuteSession[];
  detoxPlan: DigitalDetoxPlan;
  habitLoops: HabitLoopEntry[];
  finances: FinancialItem[];
  financialPlan: FinancialPlan;
  favoriteBookIds: string[];
  dailyReflections: Record<string, string>;
}
