import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LESSONS_DATA } from '../../data/lessons';
import { DayLesson, WeekNumber } from '../../types';
import { soundController } from '../../utils/audioFeedback';
import {
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Award,
  Check,
  TrendingUp,
} from 'lucide-react';

interface JourneyScreenProps {
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  onNavigateToTool?: (toolId: string) => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  selectedDay,
  onSelectDay,
  onNavigateToTool,
}) => {
  const {
    lessonsProgress,
    currentDayOfJourney,
    completedDaysCount,
    toggleLessonCheckItem,
    completeLesson,
    undoLessonCompletion,
    saveLessonReflection,
    restartJourney,
  } = useApp();

  const [activeWeek, setActiveWeek] = useState<WeekNumber>(
    selectedDay ? (selectedDay <= 7 ? 1 : selectedDay <= 14 ? 2 : 3) : 1
  );
  const [openedDay, setOpenedDay] = useState<number>(selectedDay || currentDayOfJourney);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const currentLesson: DayLesson =
    LESSONS_DATA.find((l) => l.day === openedDay) || LESSONS_DATA[0];
  const lessonProgress = lessonsProgress[openedDay] || {
    day: openedDay,
    completed: false,
    checkedItems: {},
    reflection: '',
  };

  const allChecklistItemsCompleted =
    currentLesson.checklist.length > 0 &&
    currentLesson.checklist
      .filter((c) => c.required)
      .every((c) => lessonProgress.checkedItems?.[c.id]);

  const handleToggleCheck = (itemId: string) => {
    toggleLessonCheckItem(openedDay, itemId);
    soundController.playTick(600);
  };

  const handleComplete = () => {
    if (!allChecklistItemsCompleted) return;
    completeLesson(openedDay, lessonProgress.reflection);
    soundController.playCompletionChime();
  };

  const handleUndo = () => {
    undoLessonCompletion(openedDay);
  };

  const weeks: { number: WeekNumber; label: string; range: string }[] = [
    { number: 1, label: 'O Alinhamento', range: 'Dias 1 a 7' },
    { number: 2, label: 'A Execução', range: 'Dias 8 a 14' },
    { number: 3, label: 'A Maestria', range: 'Dias 15 a 21' },
  ];

  const lessonsInWeek = LESSONS_DATA.filter((l) => l.week === activeWeek);

  return (
    <div className="space-y-6 pb-24 text-[#F5F7FC] animate-fade-in">
      {/* Journey Header & Metrics */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4FF63]" />
              <span className="text-xs font-semibold text-[#D4FF63] uppercase tracking-wider">
                Programa de 21 Dias
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FC]">
              Jornada Modo Avanço
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] font-mono tabular-nums">
              <strong className="text-[#D4FF63]">{completedDaysCount}</strong>/21 Concluídos
            </span>
            {completedDaysCount >= 21 && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-[#65D6A4]/20 text-[#65D6A4] font-semibold flex items-center gap-1 border border-[#65D6A4]/30">
                <Award className="w-3.5 h-3.5" />
                Graduado
              </span>
            )}
          </div>
        </div>

        {/* Week Segmented Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#090E1A] border border-[#222F4A]">
          {weeks.map((w) => {
            const isActive = activeWeek === w.number;
            const weekDoneCount = LESSONS_DATA.filter(
              (l) => l.week === w.number && lessonsProgress[l.day]?.completed
            ).length;

            return (
              <button
                key={w.number}
                type="button"
                onClick={() => setActiveWeek(w.number)}
                className={`py-2 px-2 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                    : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
                }`}
              >
                <p className="text-[11px] uppercase tracking-wider font-semibold">Semana {w.number}</p>
                <p className="text-[10px] text-[#8C98AF]">{weekDoneCount}/7 dias</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Day Selector Strip & Detailed Lesson View */}
      <div className="space-y-4">
        {/* Horizontal Day Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {lessonsInWeek.map((lesson) => {
            const isDone = !!lessonsProgress[lesson.day]?.completed;
            const isSelected = lesson.day === openedDay;
            const isRecommended = lesson.day === currentDayOfJourney;

            return (
              <button
                key={lesson.day}
                type="button"
                onClick={() => {
                  setOpenedDay(lesson.day);
                  if (onSelectDay) onSelectDay(lesson.day);
                }}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
                  isSelected
                    ? 'bg-[#D4FF63] text-black border-[#D4FF63] font-bold shadow-md shadow-[#D4FF63]/20'
                    : isDone
                    ? 'bg-[#141D30] text-[#65D6A4] border-[#65D6A4]/40 hover:border-[#65D6A4]'
                    : isRecommended
                    ? 'bg-[#141D30] text-[#F5F7FC] border-[#D4FF63]/50 hover:border-[#D4FF63]'
                    : 'bg-[#141D30] text-[#B4BFD2] border-[#222F4A] hover:border-[#2C3C5C]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#65D6A4]'}`} />
                  ) : isRecommended ? (
                    <span className="w-2 h-2 rounded-full bg-[#D4FF63]" />
                  ) : null}
                  <span className="text-xs font-mono">Dia {lesson.day}</span>
                </div>
                <p
                  className={`text-[10px] truncate max-w-[110px] mt-0.5 ${
                    isSelected ? 'text-black/90 font-medium' : 'text-[#8C98AF]'
                  }`}
                >
                  {lesson.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Lesson Card */}
        <article className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
          {/* Lesson Header */}
          <div className="border-b border-[#222F4A] pb-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#D4FF63] uppercase tracking-wider">
                Semana {currentLesson.week} • Dia {currentLesson.day} de 21
              </span>
              <span className="text-[11px] text-[#B4BFD2]">
                Referência: {currentLesson.sourceDoc} ({currentLesson.sourcePage})
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FC]">{currentLesson.title}</h2>
            <p className="text-sm text-[#B4BFD2] font-medium">{currentLesson.subtitle}</p>

            <div className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] mt-3">
              <p className="text-xs text-[#B4BFD2]">
                <strong className="text-[#F5F7FC]">Objetivo:</strong> {currentLesson.objective}
              </p>
            </div>
          </div>

          {/* Reading Brief (Mobile Adapted) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B4BFD2]">
              <BookOpen className="w-4 h-4 text-[#9275FF]" />
              <span>Fundamentação & Leitura Breve</span>
            </div>
            <p className="text-xs sm:text-sm text-[#E0E6F0] leading-relaxed bg-[#0E1524] p-4 rounded-xl border border-[#222F4A]">
              {currentLesson.readingBrief}
            </p>
          </div>

          {/* Practical Mission */}
          <div className="p-4 rounded-xl bg-[#D4FF63]/10 border border-[#D4FF63]/30 space-y-2">
            <h3 className="text-xs font-bold text-[#D4FF63] uppercase tracking-wider">
              Missão Prática de Hoje
            </h3>
            <p className="text-xs sm:text-sm text-[#F5F7FC] leading-relaxed font-medium">
              {currentLesson.practicalMission}
            </p>
            {currentLesson.relatedToolId && onNavigateToTool && (
              <button
                type="button"
                onClick={() => onNavigateToTool(currentLesson.relatedToolId!)}
                className="inline-flex items-center gap-1.5 text-xs text-[#D4FF63] hover:underline font-semibold mt-1"
              >
                <span>Abrir ferramenta prática sugerida</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Checklist (Required for Completion) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#F5F7FC] uppercase tracking-wider">
                Checklist Obrigatório
              </h3>
              <span className="text-[11px] text-[#B4BFD2]">
                {currentLesson.checklist.filter((c) => lessonProgress.checkedItems?.[c.id]).length} de{' '}
                {currentLesson.checklist.length} concluídos
              </span>
            </div>

            <div className="space-y-2">
              {currentLesson.checklist.map((item) => {
                const isChecked = !!lessonProgress.checkedItems?.[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleCheck(item.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 min-h-[48px] ${
                      isChecked
                        ? 'bg-[#65D6A4]/10 border-[#65D6A4]/30 text-[#F5F7FC]'
                        : 'bg-[#090E1A] border-[#222F4A] text-[#E0E6F0] hover:border-[#2C3C5C]'
                    }`}
                  >
                    <span className={`text-xs ${isChecked ? 'line-through text-[#8C98AF]' : ''}`}>
                      {item.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        isChecked
                          ? 'bg-[#65D6A4] border-[#65D6A4] text-black'
                          : 'border-[#2C3C5C] bg-[#141D30]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Reflection (Optional, Auto-Saved) */}
          <div className="space-y-2">
            <label htmlFor="reflection-textarea" className="block text-xs font-semibold text-[#F5F7FC] uppercase tracking-wider">
              Reflexão Pessoal (Opcional)
            </label>
            <p className="text-xs text-[#B4BFD2]">{currentLesson.reflectionPrompt}</p>
            <textarea
              id="reflection-textarea"
              rows={3}
              value={lessonProgress.reflection || ''}
              onChange={(e) => saveLessonReflection(openedDay, e.target.value)}
              placeholder="Escreva seus aprendizados sobre o dia aqui (salva automaticamente)..."
              className="w-full p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] placeholder-[#6E7B94] focus:outline-none focus:border-[#D4FF63] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Completion Action Bar */}
          <div className="pt-4 border-t border-[#222F4A] flex flex-wrap items-center justify-between gap-3">
            {lessonProgress.completed ? (
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#65D6A4] bg-[#65D6A4]/15 px-3 py-2 rounded-xl border border-[#65D6A4]/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Dia Concluído Oficialmente
                </span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="px-3 py-2 text-xs font-medium text-[#B4BFD2] hover:text-red-400 transition-colors"
                >
                  Desfazer conclusão
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={!allChecklistItemsCompleted}
                onClick={handleComplete}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4FF63]/20 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px]"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {allChecklistItemsCompleted
                    ? 'Confirmar Conclusão do Dia'
                    : 'Complete o checklist acima para concluir'}
                </span>
              </button>
            )}

            {/* Quick Next Day Navigator */}
            {openedDay < 21 && (
              <button
                type="button"
                onClick={() => {
                  const next = openedDay + 1;
                  setOpenedDay(next);
                  setActiveWeek(next <= 7 ? 1 : next <= 14 ? 2 : 3);
                }}
                className="px-4 py-2 rounded-xl bg-[#090E1A] border border-[#222F4A] hover:border-[#2C3C5C] text-xs text-[#E0E6F0] flex items-center gap-1.5 ml-auto min-h-[44px]"
              >
                <span>Próximo Dia ({openedDay + 1})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </article>
      </div>

      {/* Restart Journey Option with Safe Confirmation */}
      <section className="pt-4 border-t border-[#222F4A] flex items-center justify-between">
        <p className="text-xs text-[#8C98AF]">
          Concluiu ou deseja reiniciar o ciclo de 21 dias do início?
        </p>
        <button
          type="button"
          onClick={() => setShowRestartConfirm(true)}
          className="text-xs text-[#B4BFD2] hover:text-[#D4FF63] flex items-center gap-1 transition-colors min-h-[40px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Jornada</span>
        </button>
      </section>

      {/* Safe Restart Modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#141D30] border border-[#222F4A] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F5F7FC]">Reiniciar a Jornada de 21 Dias?</h3>
            <p className="text-xs text-[#B4BFD2] leading-relaxed">
              O status das 21 lições será redefinido para não concluído para que você possa percorrer o programa
              novamente. Seus hábitos cadastrados, histórico de registros e metas <strong>serão preservados</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-[#B4BFD2] hover:text-[#F5F7FC]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  restartJourney();
                  setShowRestartConfirm(false);
                  setOpenedDay(1);
                  setActiveWeek(1);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
