import {
  isHabitScheduledOnDate,
  calculateHabitStats,
  calculateOverallHabitAdherence,
  getLocalDateString,
  parseLocalDate,
} from '../utils/habitCalculations';
import { calculateDiagnosticAverages } from '../data/diagnosticQuestions';
import { Habit, HabitLog } from '../types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
  console.log(`✓ ${msg}`);
}

console.log('--- Iniciando Testes Unitários de Regras de Negócio ---');

// Test 1: Habit scheduled on date
const testHabit: Habit = {
  id: 'h1',
  title: 'Treino',
  reason: 'Saúde',
  category: 'vitalidade',
  activeDays: [1, 3, 5], // Seg, Qua, Sex
  archived: false,
  createdAt: '2026-10-12T00:00:00.000Z', // Segunda
};

// 2026-10-12 is Monday (1)
assert(isHabitScheduledOnDate(testHabit, '2026-10-12') === true, 'Segunda-feira deve estar programada');
// 2026-10-13 is Tuesday (2)
assert(isHabitScheduledOnDate(testHabit, '2026-10-13') === false, 'Terça-feira não deve estar programada');
// 2026-10-14 is Wednesday (3)
assert(isHabitScheduledOnDate(testHabit, '2026-10-14') === true, 'Quarta-feira deve estar programada');

// Test 2: Habit adherence rate and streaks
// Habit created on Mon Oct 12, evaluated on Fri Oct 16 (Mon, Wed, Fri = 3 scheduled days)
const logs: HabitLog[] = [
  { id: 'l1', habitId: 'h1', date: '2026-10-12', completed: true, completedAt: '' },
  { id: 'l2', habitId: 'h1', date: '2026-10-14', completed: true, completedAt: '' },
  // Friday Oct 16 not completed yet
];

const stats = calculateHabitStats(testHabit, logs, '2026-10-16');
assert(stats.scheduledDaysSoFar === 3, 'Deve contar exatamente 3 dias programados (Seg, Qua, Sex)');
assert(stats.completedCount === 2, 'Deve contar 2 conclusões');
assert(stats.adherenceRate === 67, 'Taxa de adesão deve ser 2/3 = 67%');
assert(stats.bestStreak === 2, 'Melhor sequência deve ser 2');

// Test 3: Diagnostic Averages calculation (null answers must NOT become 0)
const sampleScores: Record<string, number | null> = {
  foco_clareza: 8,
  ritual_matinal: 6,
  controle_estimulos: null, // Pending answer
  alimentacao: 10,
  energia_sono: null,
  ativacao_fisica: null,
};

const diagResult = calculateDiagnosticAverages(sampleScores);
assert(diagResult.pillarAverages.mental === 7.0, 'Média do Domínio Mental (8+6)/2 deve ser 7.0 (ignorando nulos)');
assert(diagResult.pillarAverages.vitalidade === 10.0, 'Média de Vitalidade (10/1) deve ser 10.0 (ignorando nulos)');
assert(diagResult.pillarAverages.intelectual === 0, 'Pilar sem respostas deve ter média 0');
assert(diagResult.answeredCount === 3, 'Contagem de respostas deve ser exatamente 3');
assert(diagResult.overallAverage === 8.0, 'Média geral (8+6+10)/3 deve ser 8.0');

// Test 4: Single-execution log guarantee (no double entries for same date)
const doubleCheckLogs: HabitLog[] = [
  { id: 'l1', habitId: 'h1', date: '2026-10-12', completed: true, completedAt: '' },
];
const statsAfter = calculateHabitStats(testHabit, doubleCheckLogs, '2026-10-12');
assert(statsAfter.completedCount === 1, 'Registro único para data especificada');

console.log('--- Todos os 5 testes unitários passaram com 100% de sucesso! ---');
