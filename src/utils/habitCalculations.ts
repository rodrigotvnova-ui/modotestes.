import { Habit, HabitLog } from '../types';

/**
 * Returns today's date formatted as YYYY-MM-DD in user's local timezone.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD into a local Date object without UTC drift.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Checks if a habit was scheduled on a given day of the week (0=Dom, 1=Seg, ... 6=Sab).
 */
export function isHabitScheduledOnDate(habit: Habit, dateStr: string): boolean {
  const date = parseLocalDate(dateStr);
  const dayOfWeek = date.getDay();
  return habit.activeDays.includes(dayOfWeek);
}

/**
 * Formats a local date into friendly Brazilian Portuguese representation: "Segunda, 24 de Outubro".
 */
export function formatFriendlyDate(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return `${weekDays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
}

/**
 * Computes exact adhesion rate and streaks for a habit strictly from its creation date up to today.
 * 
 * Rules:
 * 1. Only count days where the habit was scheduled (activeDays).
 * 2. Only consider dates between habit.createdAt and today (inclusive).
 * 3. Future dates NEVER count as missed.
 * 4. Non-scheduled days DO NOT break streak.
 */
export function calculateHabitStats(habit: Habit, logs: HabitLog[], todayStr: string = getLocalDateString()) {
  const habitLogsMap = new Set(
    logs
      .filter((l) => l.habitId === habit.id && l.completed)
      .map((l) => l.date)
  );

  const startDate = parseLocalDate(habit.createdAt.slice(0, 10));
  const todayDate = parseLocalDate(todayStr);

  // If created in the future or today is before creation, handle safely
  if (todayDate < startDate) {
    return {
      scheduledDaysSoFar: 0,
      completedCount: 0,
      adherenceRate: 100,
      currentStreak: 0,
      bestStreak: 0,
      isCompletedToday: habitLogsMap.has(todayStr),
      isScheduledToday: isHabitScheduledOnDate(habit, todayStr),
    };
  }

  let scheduledDaysSoFar = 0;
  let completedCount = 0;

  // Track streaks chronologically
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Iterate chronologically from creation to today
  const curr = new Date(startDate);
  while (curr <= todayDate) {
    const dStr = getLocalDateString(curr);
    const dayOfWeek = curr.getDay();

    if (habit.activeDays.includes(dayOfWeek)) {
      scheduledDaysSoFar += 1;
      const isDone = habitLogsMap.has(dStr);

      if (isDone) {
        completedCount += 1;
        tempStreak += 1;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        // Only break streak if this day has passed or if it's earlier than today
        // For today, if not yet done, we check if streak was active up to yesterday
        if (dStr !== todayStr) {
          tempStreak = 0;
        }
      }
    }
    // Advance 1 day
    curr.setDate(curr.getDate() + 1);
  }

  // Calculate current streak backwards from today
  currentStreak = 0;
  const backDate = new Date(todayDate);
  let streakCheckActive = true;

  while (streakCheckActive && backDate >= startDate) {
    const dStr = getLocalDateString(backDate);
    const dayOfWeek = backDate.getDay();

    if (habit.activeDays.includes(dayOfWeek)) {
      const isDone = habitLogsMap.has(dStr);
      if (isDone) {
        currentStreak += 1;
      } else {
        // If it's today and not done yet, don't break the streak immediately if yesterday was completed
        if (dStr === todayStr) {
          // just continue backwards to see previous streak
        } else {
          streakCheckActive = false;
        }
      }
    }
    backDate.setDate(backDate.getDate() - 1);
  }

  const adherenceRate = scheduledDaysSoFar > 0
    ? Math.round((completedCount / scheduledDaysSoFar) * 100)
    : 100;

  return {
    scheduledDaysSoFar,
    completedCount,
    adherenceRate,
    currentStreak,
    bestStreak,
    isCompletedToday: habitLogsMap.has(todayStr),
    isScheduledToday: isHabitScheduledOnDate(habit, todayStr),
  };
}

/**
 * Calculates overall adherence across all active habits.
 */
export function calculateOverallHabitAdherence(habits: Habit[], logs: HabitLog[], todayStr: string = getLocalDateString()): number {
  const activeHabits = habits.filter((h) => !h.archived);
  if (activeHabits.length === 0) return 0;

  let totalScheduled = 0;
  let totalCompleted = 0;

  for (const habit of activeHabits) {
    const stats = calculateHabitStats(habit, logs, todayStr);
    totalScheduled += stats.scheduledDaysSoFar;
    totalCompleted += stats.completedCount;
  }

  if (totalScheduled === 0) return 100;
  return Math.round((totalCompleted / totalScheduled) * 100);
}
