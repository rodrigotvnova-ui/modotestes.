import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Habit, HabitCategory } from '../../types';
import {
  getLocalDateString,
  calculateHabitStats,
  calculateOverallHabitAdherence,
  isHabitScheduledOnDate,
} from '../../utils/habitCalculations';
import { soundController } from '../../utils/audioFeedback';
import { INITIAL_HABIT_TEMPLATES } from '../../data/habitsTemplates';
import {
  Plus,
  CheckCircle2,
  Flame,
  Calendar as CalendarIcon,
  Archive,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit2,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const HabitsScreen: React.FC = () => {
  const { habits, habitLogs, addHabit, updateHabit, archiveHabit, toggleHabitLog } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'monthly' | 'archive'>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Month navigation state
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date());

  const todayStr = getLocalDateString();
  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);
  const archivedHabits = useMemo(() => habits.filter((h) => h.archived), [habits]);

  const overallAdhesion = useMemo(() => {
    return calculateOverallHabitAdherence(habits, habitLogs, todayStr);
  }, [habits, habitLogs, todayStr]);

  // Calendar calculations
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Dom

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const handleToggle = (habitId: string, dateStr: string) => {
    toggleHabitLog(habitId, dateStr);
    soundController.playTick(500);
  };

  return (
    <div className="space-y-6 pb-24 text-[#F5F7FC] animate-fade-in">
      {/* Habits Header & Overall Stats */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4FF63]" />
              <span className="text-xs font-semibold text-[#D4FF63] uppercase tracking-wider">
                Rastreador de Hábitos
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FC]">
              Modo Avanço • Hábitos & Consistência
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingHabit(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#D4FF63]/20 min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Hábito</span>
          </button>
        </div>

        {/* Adhesion Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#222F4A]">
          <div className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A]">
            <p className="text-[11px] text-[#B4BFD2]">Adesão Geral (Programada)</p>
            <p className="text-lg font-bold font-mono text-[#65D6A4] tabular-nums mt-0.5">
              {overallAdhesion}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A]">
            <p className="text-[11px] text-[#B4BFD2]">Hábitos Ativos</p>
            <p className="text-lg font-bold font-mono text-[#F5F7FC] tabular-nums mt-0.5">
              {activeHabits.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] col-span-2 sm:col-span-1">
            <p className="text-[11px] text-[#B4BFD2]">Princípio de Retomada</p>
            <p className="text-xs text-[#E0E6F0] font-medium mt-0.5">
              “Seu próximo nível começa hoje.”
            </p>
          </div>
        </div>

        {/* View Switcher: Lista de Hoje vs Calendário Mensal */}
        <div className="flex gap-2 p-1 rounded-xl bg-[#090E1A] border border-[#222F4A]">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'today'
                ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Visão Geral & Sequências
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'monthly'
                ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Calendário Mensal
          </button>
          {archivedHabits.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('archive')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'archive'
                  ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                  : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
              }`}
            >
              Arquivados ({archivedHabits.length})
            </button>
          )}
        </div>
      </section>

      {/* VIEW 1: TODAY & STREAKS */}
      {activeTab === 'today' && (
        <section className="space-y-4">
          {activeHabits.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#141D30] border border-dashed border-[#222F4A] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4FF63]/10 text-[#D4FF63] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#F5F7FC]">Nenhum hábito ativo ainda</h3>
                <p className="text-xs text-[#B4BFD2] max-w-sm mx-auto">
                  Adicione seus 3 a 5 hábitos nucleares para iniciar o acompanhamento diário.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingHabit(null);
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#D4FF63] text-black font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Escolher Sugestões ou Criar</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeHabits.map((habit) => {
                const stats = calculateHabitStats(habit, habitLogs, todayStr);
                const weekDayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

                return (
                  <article
                    key={habit.id}
                    className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-[#F5F7FC]">{habit.title}</h2>
                          {habit.reminderTime && (
                            <span className="text-[10px] text-[#B4BFD2] flex items-center gap-1 bg-[#090E1A] px-2 py-0.5 rounded border border-[#222F4A]">
                              <Clock className="w-3 h-3 text-[#D4FF63]" />
                              {habit.reminderTime}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#B4BFD2]">{habit.reason}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingHabit(habit);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-[#B4BFD2] hover:text-[#F5F7FC] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label="Editar hábito"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => archiveHabit(habit.id)}
                          className="p-2 text-[#B4BFD2] hover:text-amber-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label="Arquivar hábito"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stats & Frequency Pill Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#222F4A] text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-[#090E1A]">
                        <Flame className="w-4 h-4 text-[#D4FF63]" />
                        <div>
                          <p className="text-[10px] text-[#B4BFD2]">Sequência Atual</p>
                          <p className="font-mono font-bold text-[#F5F7FC] tabular-nums">
                            {stats.currentStreak} dias
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-[#090E1A]">
                        <Sparkles className="w-4 h-4 text-[#9275FF]" />
                        <div>
                          <p className="text-[10px] text-[#B4BFD2]">Melhor Sequência</p>
                          <p className="font-mono font-bold text-[#F5F7FC] tabular-nums">
                            {stats.bestStreak} dias
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-[#090E1A]">
                        <div>
                          <p className="text-[10px] text-[#B4BFD2]">Adesão Própria</p>
                          <p className="font-mono font-bold text-[#65D6A4] tabular-nums">
                            {stats.adherenceRate}%
                          </p>
                        </div>
                      </div>

                      {/* Today quick toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggle(habit.id, todayStr)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold transition-all min-h-[44px] ${
                          stats.isCompletedToday
                            ? 'bg-[#65D6A4] text-black shadow-md shadow-[#65D6A4]/30'
                            : stats.isScheduledToday
                            ? 'bg-[#1D2940] text-[#F5F7FC] hover:bg-[#D4FF63] hover:text-black border border-[#222F4A]'
                            : 'bg-[#0E1524] text-[#8C98AF] border border-[#222F4A]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{stats.isCompletedToday ? 'Concluído Hoje' : 'Marcar Hoje'}</span>
                      </button>
                    </div>

                    {/* Active Days indicator */}
                    <div className="flex items-center gap-1 text-[11px] text-[#B4BFD2] pt-1">
                      <span className="mr-2">Frequência:</span>
                      {weekDayLabels.map((label, dIdx) => {
                        const isScheduled = habit.activeDays.includes(dIdx);
                        return (
                          <span
                            key={dIdx}
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] ${
                              isScheduled
                                ? 'bg-[#D4FF63]/20 text-[#D4FF63] font-bold border border-[#D4FF63]/40'
                                : 'bg-[#090E1A] text-[#6E7B94]'
                            }`}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* VIEW 2: MONTHLY INTERACTIVE CALENDAR */}
      {activeTab === 'monthly' && (
        <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F5F7FC]">
              {monthNames[month]} de {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg bg-[#090E1A] border border-[#222F4A] hover:border-[#2C3C5C] text-[#B4BFD2] hover:text-[#F5F7FC] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg bg-[#090E1A] border border-[#222F4A] hover:border-[#2C3C5C] text-[#B4BFD2] hover:text-[#F5F7FC] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Header Row */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#B4BFD2] pb-1 border-b border-[#222F4A]">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset days before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty_${idx}`} className="h-16 rounded-lg bg-[#090E1A]/40" />
            ))}

            {/* Real month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isFuture = dateStr > todayStr;

              // Habits scheduled on this specific date
              const scheduledHabits = activeHabits.filter((h) => isHabitScheduledOnDate(h, dateStr));
              const completedCountOnDay = habitLogs.filter((l) => l.date === dateStr && l.completed).length;

              return (
                <div
                  key={dateStr}
                  className={`h-20 p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-[#1D2940] border-[#D4FF63]'
                      : 'bg-[#090E1A] border-[#222F4A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        isToday ? 'font-bold text-[#D4FF63]' : 'text-[#B4BFD2]'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {scheduledHabits.length > 0 && !isFuture && (
                      <span className="text-[10px] font-mono text-[#65D6A4] font-semibold tabular-nums">
                        {completedCountOnDay}/{scheduledHabits.length}
                      </span>
                    )}
                  </div>

                  {/* Micro Habit Dots */}
                  <div className="flex flex-wrap gap-1 mt-1 overflow-hidden">
                    {scheduledHabits.slice(0, 4).map((h) => {
                      const isDone = habitLogs.some((l) => l.habitId === h.id && l.date === dateStr && l.completed);
                      return (
                        <button
                          key={h.id}
                          type="button"
                          disabled={isFuture}
                          onClick={() => handleToggle(h.id, dateStr)}
                          title={`${h.title}: ${isDone ? 'Concluído' : 'Pendente'}`}
                          className={`w-3 h-3 rounded-full transition-transform ${
                            isDone
                              ? 'bg-[#65D6A4] hover:scale-125'
                              : isFuture
                              ? 'bg-[#1D2940]'
                              : 'bg-[#2C3C5C] hover:bg-[#D4FF63]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#B4BFD2] pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#65D6A4]" />
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2C3C5C]" />
              <span>Pendente (passado)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1D2940]" />
              <span>Futuro (não conta como falha)</span>
            </div>
          </div>
        </section>
      )}

      {/* VIEW 3: ARCHIVED HABITS */}
      {activeTab === 'archive' && (
        <section className="space-y-3">
          <p className="text-xs text-[#B4BFD2]">
            Hábitos arquivados mantêm todo o seu histórico intacto no banco de dados, sem afetar o cálculo de adesão
            ativa atual.
          </p>
          {archivedHabits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 rounded-xl bg-[#141D30] border border-[#222F4A] flex items-center justify-between gap-3 opacity-75"
            >
              <div>
                <h4 className="text-sm font-semibold text-[#F5F7FC]">{habit.title}</h4>
                <p className="text-xs text-[#B4BFD2]">{habit.reason}</p>
              </div>
              <button
                type="button"
                onClick={() => updateHabit(habit.id, { archived: false })}
                className="px-3 py-1.5 rounded-lg bg-[#1D2940] hover:bg-[#D4FF63] hover:text-black text-xs font-semibold text-[#F5F7FC] transition-colors min-h-[44px]"
              >
                Desarquivar
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Add / Edit Habit Modal */}
      {showAddModal && (
        <HabitFormModal
          habit={editingHabit}
          onClose={() => {
            setShowAddModal(false);
            setEditingHabit(null);
          }}
          onSave={(data) => {
            if (editingHabit) {
              updateHabit(editingHabit.id, data);
            } else {
              addHabit(data);
            }
            setShowAddModal(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
};

interface HabitFormModalProps {
  habit: Habit | null;
  onClose: () => void;
  onSave: (data: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
}

const HabitFormModal: React.FC<HabitFormModalProps> = ({ habit, onClose, onSave }) => {
  const [title, setTitle] = useState(habit?.title || '');
  const [reason, setReason] = useState(habit?.reason || '');
  const [category, setCategory] = useState<HabitCategory>(habit?.category || 'rotina');
  const [activeDays, setActiveDays] = useState<number[]>(habit?.activeDays || [1, 2, 3, 4, 5]);
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || '');

  const weekDays = [
    { idx: 0, label: 'Dom' },
    { idx: 1, label: 'Seg' },
    { idx: 2, label: 'Ter' },
    { idx: 3, label: 'Qua' },
    { idx: 4, label: 'Qui' },
    { idx: 5, label: 'Sex' },
    { idx: 6, label: 'Sáb' },
  ];

  const toggleDay = (dayIdx: number) => {
    setActiveDays((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx].sort()
    );
  };

  const handleApplyTemplate = (tmpl: (typeof INITIAL_HABIT_TEMPLATES)[0]) => {
    setTitle(tmpl.title);
    setReason(tmpl.reason);
    setCategory(tmpl.category);
    setActiveDays(tmpl.defaultActiveDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || activeDays.length === 0) return;

    onSave({
      title: title.trim(),
      reason: reason.trim() || 'Fortalecer consistência e foco diário.',
      category,
      activeDays,
      reminderTime: reminderTime || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#141D30] border border-[#222F4A] rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#222F4A] pb-3">
          <h3 className="text-base font-bold text-[#F5F7FC]">
            {habit ? 'Editar Hábito' : 'Cadastrar Novo Hábito'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#B4BFD2] hover:text-[#F5F7FC] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            Fechar
          </button>
        </div>

        {/* Suggestion templates (if creating new) */}
        {!habit && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#B4BFD2] uppercase tracking-wider">
              Sugestões Rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {INITIAL_HABIT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#090E1A] border border-[#222F4A] hover:border-[#D4FF63] text-[#E0E6F0] transition-colors"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="habit-title-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
              Nome do Hábito *
            </label>
            <input
              id="habit-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treino físico, Leitura diária..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="habit-reason-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
              Motivo / Por que isso importa
            </label>
            <input
              id="habit-reason-input"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Manter clareza mental e energia constante..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#B4BFD2] mb-1">
              Frequência Semanal * (Dias programados)
            </label>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((w) => {
                const isSelected = activeDays.includes(w.idx);
                return (
                  <button
                    key={w.idx}
                    type="button"
                    onClick={() => toggleDay(w.idx)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all min-h-[44px] ${
                      isSelected
                        ? 'bg-[#D4FF63] text-black shadow-md shadow-[#D4FF63]/20'
                        : 'bg-[#090E1A] border border-[#222F4A] text-[#B4BFD2]'
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-[#8C98AF] mt-1">
              Dias desmarcados não contarão como falha e não quebrarão sua sequência.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="habit-category-select" className="block text-xs font-medium text-[#B4BFD2] mb-1">Categoria</label>
              <select
                id="habit-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
              >
                <option value="rotina">Rotina Diária</option>
                <option value="mental">Domínio Mental</option>
                <option value="vitalidade">Vitalidade / Saúde</option>
                <option value="intelectual">Intelectual / Estudos</option>
                <option value="financas">Finanças</option>
              </select>
            </div>

            <div>
              <label htmlFor="habit-reminder-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
                Lembrete (Opcional)
              </label>
              <input
                id="habit-reminder-input"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] font-mono focus:outline-none focus:border-[#D4FF63]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#222F4A] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#B4BFD2] hover:text-[#F5F7FC]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || activeDays.length === 0}
              className="px-5 py-2.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors disabled:opacity-40 min-h-[44px]"
            >
              {habit ? 'Salvar Alterações' : 'Criar Hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
