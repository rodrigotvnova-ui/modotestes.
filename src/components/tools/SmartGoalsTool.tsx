import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartGoal, Milestone, WeeklyReview } from '../../types';
import { getLocalDateString } from '../../utils/habitCalculations';
import { Target, Plus, CheckCircle2, Circle, ChevronDown, ChevronUp, Calendar, Trash2, Archive, MessageSquare } from 'lucide-react';

export const SmartGoalsTool: React.FC = () => {
  const { goals, habits, addGoal, updateGoal, archiveGoal, toggleMilestone, addWeeklyReview, addPriority } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [activeReviewGoalId, setActiveReviewGoalId] = useState<string | null>(null);

  const activeGoals = goals.filter((g) => !g.archived);

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9275FF]/10 border border-[#9275FF]/30 flex items-center justify-center text-[#9275FF]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F5F7FC]">Metas SMART & Prioridades</h2>
            <p className="text-xs text-[#B4BFD2]">
              Objetivos com prazos claros, marcos verificáveis e rituais de revisão semanal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#D4FF63]/20 min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Meta SMART</span>
        </button>
      </div>

      {/* Goals list */}
      {activeGoals.length === 0 ? (
        <div className="p-8 rounded-xl bg-[#090E1A] border border-dashed border-[#222F4A] text-center space-y-3">
          <p className="text-xs text-[#B4BFD2]">Nenhuma meta ativa cadastrada ainda.</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1D2940] text-xs font-semibold text-[#F5F7FC] hover:bg-[#2C3C5C]"
          >
            Cadastrar Primeira Meta SMART
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            // Calculate progress
            let progressPercent = 0;
            if (goal.metricType === 'numeric' && goal.targetValue && goal.initialValue !== undefined) {
              const totalSpan = goal.targetValue - goal.initialValue;
              const currentSpan = (goal.currentValue ?? goal.initialValue) - goal.initialValue;
              progressPercent = totalSpan > 0 ? Math.min(100, Math.max(0, Math.round((currentSpan / totalSpan) * 100))) : 0;
            } else if (goal.milestones.length > 0) {
              const doneMilestones = goal.milestones.filter((m) => m.completed).length;
              progressPercent = Math.round((doneMilestones / goal.milestones.length) * 100);
            }

            const connectedHabit = habits.find((h) => h.id === goal.connectedHabitId);

            return (
              <article
                key={goal.id}
                className="p-5 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#D4FF63] tracking-wider">
                        Prazo: {goal.deadline}
                      </span>
                      {connectedHabit && (
                        <span className="text-[10px] text-[#9275FF] bg-[#9275FF]/10 px-2 py-0.5 rounded border border-[#9275FF]/20">
                          Hábito: {connectedHabit.title}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#F5F7FC]">{goal.what}</h3>
                    <p className="text-xs text-[#B4BFD2]">{goal.why}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => archiveGoal(goal.id)}
                      className="p-2 text-[#B4BFD2] hover:text-[#FFD080]"
                      title="Arquivar meta"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-[#B4BFD2]">Progresso Verificável</span>
                    <span className="text-[#65D6A4] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#141D30] overflow-hidden border border-[#222F4A]">
                    <div
                      className="h-full bg-[#65D6A4] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones list */}
                {goal.milestones.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#1D2940]">
                    <p className="text-[11px] font-semibold text-[#B4BFD2] uppercase tracking-wider">
                      Marcos Intermediários:
                    </p>
                    <div className="space-y-1">
                      {goal.milestones.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className="w-full p-2 rounded-lg bg-[#141D30] hover:bg-[#1D2940] text-left flex items-center justify-between gap-2 text-xs transition-colors"
                        >
                          <span className={m.completed ? 'line-through text-[#8C98AF]' : 'text-[#F5F7FC]'}>
                            {m.label}
                          </span>
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#B4BFD2] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connect to daily priority shortcut */}
                <div className="pt-2 border-t border-[#1D2940] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const ok = addPriority(`Meta: ${goal.firstStep || goal.what}`);
                      if (ok) alert('Adicionada às 3 Prioridades de Hoje!');
                      else alert('Limite de 3 prioridades diárias já atingido.');
                    }}
                    className="text-xs text-[#D4FF63] hover:underline font-semibold"
                  >
                    + Enviar primeiro passo para as Prioridades de Hoje
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveReviewGoalId(goal.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#1D2940] hover:bg-[#2C3C5C] text-xs font-semibold text-[#F5F7FC] flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#9275FF]" />
                    <span>Revisão Semanal ({goal.weeklyReviews?.length || 0})</span>
                  </button>
                </div>

                {/* Active Weekly Reviews List */}
                {activeReviewGoalId === goal.id && (
                  <WeeklyReviewModal
                    goal={goal}
                    onClose={() => setActiveReviewGoalId(null)}
                    onSaveReview={(rev) => addWeeklyReview(goal.id, rev)}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Goal creation modal */}
      {showModal && <GoalFormModal onClose={() => setShowModal(false)} onSave={addGoal} habits={habits} />}
    </div>
  );
};

// Modal for SMART Goal creation
interface GoalFormModalProps {
  onClose: () => void;
  onSave: (data: Omit<SmartGoal, 'id' | 'createdAt' | 'completed' | 'archived' | 'weeklyReviews'>) => void;
  habits: any[];
}

const GoalFormModal: React.FC<GoalFormModalProps> = ({ onClose, onSave, habits }) => {
  const [what, setWhat] = useState('');
  const [why, setWhy] = useState('');
  const [metricType, setMetricType] = useState<'numeric' | 'milestones'>('milestones');
  const [metricUnit, setMetricUnit] = useState('');
  const [initialValue, setInitialValue] = useState('0');
  const [targetValue, setTargetValue] = useState('100');
  const [deadline, setDeadline] = useState(getLocalDateString());
  const [resourcesObstacles, setResourcesObstacles] = useState('');
  const [firstStep, setFirstStep] = useState('');
  const [connectedHabitId, setConnectedHabitId] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!what.trim() || !why.trim()) return;

    const milestones: Milestone[] = milestonesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label, idx) => ({ id: `m_${idx}_${Date.now()}`, label, completed: false }));

    onSave({
      what: what.trim(),
      why: why.trim(),
      metricType,
      metricUnit: metricType === 'numeric' ? metricUnit.trim() : undefined,
      initialValue: metricType === 'numeric' ? Number(initialValue) : undefined,
      targetValue: metricType === 'numeric' ? Number(targetValue) : undefined,
      currentValue: metricType === 'numeric' ? Number(initialValue) : undefined,
      deadline,
      resourcesObstacles: resourcesObstacles.trim(),
      firstStep: firstStep.trim(),
      milestones,
      connectedHabitId: connectedHabitId || undefined,
      isPriority: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#141D30] border border-[#222F4A] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-base font-bold text-[#F5F7FC]">Estruturar Nova Meta SMART</h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label htmlFor="goal-what-input" className="block text-[#B4BFD2] mb-1 font-semibold">1. O que quero alcançar? (Específica) *</label>
            <input
              id="goal-what-input"
              type="text"
              required
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="Ex: Concluir leitura de 3 livros densos..."
              className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="goal-why-input" className="block text-[#B4BFD2] mb-1 font-semibold">2. Por que isso importa? (Relevante) *</label>
            <input
              id="goal-why-input"
              type="text"
              required
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Ex: Para alavancar meu posicionamento e foco..."
              className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="goal-deadline-input" className="block text-[#B4BFD2] mb-1 font-semibold">3. Prazo Limite (Temporal) *</label>
              <input
                id="goal-deadline-input"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
              />
            </div>
            <div>
              <label htmlFor="goal-connected-habit-select" className="block text-[#B4BFD2] mb-1 font-semibold">Conectar a um Hábito</label>
              <select
                id="goal-connected-habit-select"
                value={connectedHabitId}
                onChange={(e) => setConnectedHabitId(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
              >
                <option value="">Nenhum</option>
                {habits.map((h) => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="goal-first-step-input" className="block text-[#B4BFD2] mb-1 font-semibold">4. Primeiro Passo Prático de 10 minutos *</label>
            <input
              id="goal-first-step-input"
              type="text"
              value={firstStep}
              onChange={(e) => setFirstStep(e.target.value)}
              placeholder="Ex: Comprar o primeiro livro e deixar na bancada..."
              className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
            />
          </div>

          <div>
            <label htmlFor="goal-milestones-textarea" className="block text-[#B4BFD2] mb-1 font-semibold">
              5. Marcos Intermediários (1 por linha)
            </label>
            <textarea
              id="goal-milestones-textarea"
              rows={3}
              value={milestonesInput}
              onChange={(e) => setMilestonesInput(e.target.value)}
              placeholder="Marco 1: Terminar o primeiro livro&#10;Marco 2: Terminar o segundo livro&#10;Marco 3: Terminar o terceiro livro"
              className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#222F4A]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[#B4BFD2]">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#D4FF63] text-black font-bold">
              Cadastrar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Weekly review modal
const WeeklyReviewModal: React.FC<{
  goal: SmartGoal;
  onClose: () => void;
  onSaveReview: (review: Omit<WeeklyReview, 'id'>) => void;
}> = ({ goal, onClose, onSaveReview }) => {
  const [progressed, setProgressed] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [adjustments, setAdjustments] = useState('');
  const [nextStep, setNextStep] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressed.trim()) return;

    onSaveReview({
      date: getLocalDateString(),
      progressed: progressed.trim(),
      obstacles: obstacles.trim(),
      adjustments: adjustments.trim(),
      nextStep: nextStep.trim(),
    });
    setProgressed('');
    setObstacles('');
    setAdjustments('');
    setNextStep('');
  };

  return (
    <div className="p-4 rounded-xl bg-[#0E1524] border border-[#222F4A] space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-[#F5F7FC]">Protocolo de Revisão Semanal</h4>
        <button type="button" onClick={onClose} className="text-[#B4BFD2]">Fechar</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="weekly-progress-input" className="block text-[#B4BFD2] mb-1">1. O que avancei esta semana? *</label>
          <input
            id="weekly-progress-input"
            type="text"
            required
            value={progressed}
            onChange={(e) => setProgressed(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
          />
        </div>

        <div>
          <label htmlFor="weekly-obstacles-input" className="block text-[#B4BFD2] mb-1">2. O que dificultou ou travou?</label>
          <input
            id="weekly-obstacles-input"
            type="text"
            value={obstacles}
            onChange={(e) => setObstacles(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
          />
        </div>

        <div>
          <label htmlFor="weekly-adjustments-input" className="block text-[#B4BFD2] mb-1">3. Qual ajuste farei para a próxima semana?</label>
          <input
            id="weekly-adjustments-input"
            type="text"
            value={adjustments}
            onChange={(e) => setAdjustments(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
          />
        </div>

        <div>
          <label htmlFor="weekly-next-step-input" className="block text-[#B4BFD2] mb-1">4. Qual será meu próximo passo inegociável?</label>
          <input
            id="weekly-next-step-input"
            type="text"
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
          />
        </div>

        <button type="submit" className="w-full py-2 rounded-lg bg-[#9275FF] text-white font-bold">
          Salvar Registro de Revisão
        </button>
      </form>

      {/* History */}
      {goal.weeklyReviews && goal.weeklyReviews.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#1D2940]">
          <span className="text-[10px] text-[#B4BFD2] font-bold uppercase">Histórico de Revisões:</span>
          {goal.weeklyReviews.map((r) => (
            <div key={r.id} className="p-2.5 rounded-lg bg-[#090E1A] space-y-1">
              <span className="text-[10px] text-[#D4FF63] font-mono">{r.date}</span>
              <p className="text-[#F5F7FC]"><strong>Avanço:</strong> {r.progressed}</p>
              {r.nextStep && <p className="text-[#65D6A4]"><strong>Próximo passo:</strong> {r.nextStep}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
