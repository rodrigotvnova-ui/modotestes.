import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LESSONS_DATA } from '../../data/lessons';
import { getLocalDateString, formatFriendlyDate, isHabitScheduledOnDate } from '../../utils/habitCalculations';
import { soundController } from '../../utils/audioFeedback';
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Zap,
  Clock,
  ArrowRight,
  BookOpen,
  Trash2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface TodayScreenProps {
  onOpenLesson: (day: number) => void;
  onOpenTwoMinute: () => void;
  onOpenFocus: (defaultMinutes?: number) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  onOpenLesson,
  onOpenTwoMinute,
  onOpenFocus,
}) => {
  const {
    profile,
    currentDayOfJourney,
    completedDaysCount,
    lessonsProgress,
    habits,
    habitLogs,
    toggleHabitLog,
    todayPriorities,
    addPriority,
    togglePriority,
    deletePriority,
    dailyReflections,
    saveDailyReflection,
  } = useApp();

  const [newPriorityText, setNewPriorityText] = useState('');
  const todayStr = getLocalDateString();
  const currentLesson = LESSONS_DATA.find((l) => l.day === currentDayOfJourney) || LESSONS_DATA[0];
  const isLessonDone = !!lessonsProgress[currentDayOfJourney]?.completed;

  // Habits scheduled for today
  const activeHabits = habits.filter((h) => !h.archived);
  const habitsForToday = activeHabits.filter((h) => isHabitScheduledOnDate(h, todayStr));
  const completedHabitIds = new Set(
    habitLogs.filter((l) => l.date === todayStr && l.completed).map((l) => l.habitId)
  );

  const greeting = (() => {
    const hour = new Date().getHours();
    let prefix = 'Bom dia';
    if (hour >= 12 && hour < 18) prefix = 'Boa tarde';
    if (hour >= 18 || hour < 5) prefix = 'Boa noite';
    return profile.name ? `${prefix}, ${profile.name}` : prefix;
  })();

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriorityText.trim()) return;
    const ok = addPriority(newPriorityText);
    if (ok) {
      setNewPriorityText('');
      soundController.playTick(520);
    }
  };

  const handleToggleHabit = (habitId: string) => {
    const wasDone = completedHabitIds.has(habitId);
    toggleHabitLog(habitId, todayStr);
    if (!wasDone) {
      soundController.playCompletionChime();
    }
  };

  const currentReflection = dailyReflections[todayStr] || '';

  return (
    <div className="space-y-6 pb-24 text-[#F5F7FC] animate-fade-in">
      {/* Top Banner & Journey Status */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs text-[#B4BFD2] font-medium">{formatFriendlyDate(todayStr)}</p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FC]">{greeting}</h1>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#1D2940] text-[#D4FF63] font-semibold border border-[#D4FF63]/25">
              Dia {currentDayOfJourney} de 21
            </span>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="space-y-1.5 pt-1 border-t border-[#222F4A]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#B4BFD2]">Progresso da Jornada</span>
            <span className="font-mono text-[#F5F7FC] tabular-nums font-semibold">
              {completedDaysCount} de 21 concluídos ({Math.round((completedDaysCount / 21) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#090E1A] overflow-hidden border border-[#222F4A]">
            <div
              className={`h-full rounded-full bg-[#D4FF63] transition-all duration-500 ${
                completedDaysCount > 0 ? 'shadow-sm shadow-[#D4FF63]/50' : ''
              }`}
              style={{ width: `${completedDaysCount === 0 ? 0 : (completedDaysCount / 21) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Day Mission Card */}
        <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#D4FF63] uppercase tracking-wider">
                Missão de Hoje • Semana {currentLesson.week}
              </span>
              <h2 className="text-base font-bold text-[#F5F7FC]">{currentLesson.title}</h2>
              <p className="text-xs text-[#B4BFD2] line-clamp-2">{currentLesson.practicalMission}</p>
            </div>
            {isLessonDone && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#65D6A4] bg-[#65D6A4]/10 px-2 py-1 rounded-md shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Concluída
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenLesson(currentDayOfJourney)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#D4FF63]/20 min-h-[44px]"
          >
            <Compass className="w-4 h-4" />
            <span>{isLessonDone ? 'Revisar Missão do Dia' : 'Continuar Minha Jornada'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Action Shortcuts: 2-Minutes & Focus Session */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenTwoMinute}
          className="p-4 text-left rounded-2xl bg-[#141D30] border border-[#222F4A] hover:border-[#D4FF63]/50 transition-all flex items-start gap-3.5 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4FF63]/10 border border-[#D4FF63]/30 flex items-center justify-center text-[#D4FF63] shrink-0 group-hover:bg-[#D4FF63] group-hover:text-black transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#F5F7FC]">Começar por 2 Minutos</h3>
            <p className="text-xs text-[#B4BFD2]">
              Destrave uma tarefa paralisada com uma micro-ação imediata.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenFocus(25)}
          className="p-4 text-left rounded-2xl bg-[#141D30] border border-[#222F4A] hover:border-[#9275FF]/50 transition-all flex items-start gap-3.5 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-xl bg-[#9275FF]/10 border border-[#9275FF]/30 flex items-center justify-center text-[#9275FF] shrink-0 group-hover:bg-[#9275FF] group-hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#F5F7FC]">Sessão de Foco</h3>
            <p className="text-xs text-[#B4BFD2]">
              Inicie um bloco imersivo de 25 ou 50 min sem alternância.
            </p>
          </div>
        </button>
      </section>

      {/* Top 3 Priorities */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FC] uppercase tracking-wider">Três Prioridades de Hoje</h3>
            <p className="text-xs text-[#B4BFD2]">Concentre sua energia nas 3 ações mais decisivas.</p>
          </div>
          <span className="text-xs font-mono text-[#B4BFD2] tabular-nums">
            {todayPriorities.length}/3
          </span>
        </div>

        {/* Priority List */}
        <div className="space-y-2">
          {todayPriorities.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-dashed border-[#222F4A] text-center text-xs text-[#B4BFD2]">
              Nenhuma prioridade registrada ainda. Defina até 3 tarefas decisivas abaixo.
            </div>
          ) : (
            todayPriorities.map((item, index) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] flex items-center justify-between gap-3 group transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    togglePriority(item.id);
                    soundController.playTick(item.completed ? 400 : 700);
                  }}
                  className="flex items-center gap-3 text-left flex-1 min-h-[44px]"
                >
                  <span className="text-xs font-mono font-bold text-[#D4FF63] w-4">
                    #{index + 1}
                  </span>
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#65D6A4] shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#B4BFD2] group-hover:text-[#F5F7FC] shrink-0" />
                  )}
                  <span
                    className={`text-xs ${
                      item.completed ? 'line-through text-[#6E7B94]' : 'text-[#F5F7FC] font-medium'
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deletePriority(item.id)}
                  className="p-2 text-[#B4BFD2] hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Excluir prioridade"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Priority Input (if < 3) */}
        {todayPriorities.length < 3 && (
          <form onSubmit={handleAddPriority} className="flex gap-2">
            <input
              type="text"
              value={newPriorityText}
              onChange={(e) => setNewPriorityText(e.target.value)}
              placeholder={`Prioridade #${todayPriorities.length + 1}...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] placeholder-[#6E7B94] focus:outline-none focus:border-[#D4FF63] transition-colors"
            />
            <button
              type="submit"
              disabled={!newPriorityText.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-[#1D2940] text-[#F5F7FC] hover:bg-[#D4FF63] hover:text-black font-semibold text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </form>
        )}
      </section>

      {/* Habits Scheduled For Today */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FC] uppercase tracking-wider">Hábitos de Hoje</h3>
            <p className="text-xs text-[#B4BFD2]">Marque os hábitos programados para este dia.</p>
          </div>
          <span className="text-xs font-mono text-[#B4BFD2] tabular-nums">
            {habitsForToday.filter((h) => completedHabitIds.has(h.id)).length}/{habitsForToday.length}
          </span>
        </div>

        {habitsForToday.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-center text-xs text-[#B4BFD2]">
            Nenhum hábito agendado para hoje. Acesse a aba <strong>Hábitos</strong> para cadastrar ou calibrar a
            frequência semanal.
          </div>
        ) : (
          <div className="space-y-2">
            {habitsForToday.map((habit) => {
              const isDone = completedHabitIds.has(habit.id);
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`w-full p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-left min-h-[52px] ${
                    isDone
                      ? 'bg-[#65D6A4]/10 border-[#65D6A4]/30 text-[#F5F7FC]'
                      : 'bg-[#090E1A] border-[#222F4A] text-[#E0E6F0] hover:border-[#2C3C5C]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className={`text-xs font-medium ${isDone ? 'line-through text-[#B4BFD2]' : 'text-[#F5F7FC]'}`}>
                      {habit.title}
                    </p>
                    <p className="text-[11px] text-[#8C98AF]">{habit.reason}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      isDone
                        ? 'bg-[#65D6A4] border-[#65D6A4] text-black shadow-sm shadow-[#65D6A4]/40'
                        : 'border-[#2C3C5C] bg-[#141D30]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : <Circle className="w-4 h-4 text-transparent" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Daily Reflection Notebook */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#D4FF63]" />
          <h3 className="text-sm font-bold text-[#F5F7FC] uppercase tracking-wider">Reflexão do Dia</h3>
        </div>
        <p className="text-xs text-[#B4BFD2]">
          O que você aprendeu com suas ações de hoje? O que facilitou ou dificultou seu ritmo?
        </p>
        <textarea
          rows={3}
          value={currentReflection}
          onChange={(e) => saveDailyReflection(todayStr, e.target.value)}
          placeholder="Escreva sua reflexão honesta aqui (salva automaticamente no seu aparelho)..."
          className="w-full p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] placeholder-[#6E7B94] focus:outline-none focus:border-[#D4FF63] transition-colors resize-none leading-relaxed"
        />
      </section>
    </div>
  );
};
