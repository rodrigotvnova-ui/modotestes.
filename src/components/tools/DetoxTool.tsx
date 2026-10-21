import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Check, ShieldCheck, Clock, Plus, Trash2, Sparkles, AlertTriangle } from 'lucide-react';

export const DetoxTool: React.FC = () => {
  const { detoxPlan, updateDetoxPlan } = useApp();

  const [estimatedDaily, setEstimatedDaily] = useState(detoxPlan.estimatedDailyMinutes);
  const [targetDaily, setTargetDaily] = useState(detoxPlan.targetDailyMinutes);
  const [newWindow, setNewWindow] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const checklistItems = [
    { key: 'notifications_off', label: 'Notificações de redes sociais e chats não-urgentes desativadas' },
    { key: 'home_screen_clean', label: 'Tela inicial limpa: feeds infinitos movidos para pastas secundárias' },
    { key: 'grayscale_mode', label: 'Modo escala de cinza ativado durante blocos de trabalho' },
    { key: 'charging_outside_bedroom', label: 'Carregador do celular fora do quarto ou longe da cama' },
    { key: 'no_phones_at_table', label: 'Mesa de refeições 100% livre de smartphones' },
  ];

  const handleToggleCheck = (key: string) => {
    const updated = {
      ...detoxPlan.checkedEnvironment,
      [key]: !detoxPlan.checkedEnvironment[key],
    };
    updateDetoxPlan({ checkedEnvironment: updated });
  };

  const handleSaveMinutes = () => {
    updateDetoxPlan({
      estimatedDailyMinutes: Number(estimatedDaily),
      targetDailyMinutes: Number(targetDaily),
    });
  };

  const handleAddWindow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWindow.trim()) return;
    updateDetoxPlan({
      allowedWindows: [...detoxPlan.allowedWindows, newWindow.trim()],
    });
    setNewWindow('');
  };

  const handleDeleteWindow = (idx: number) => {
    updateDetoxPlan({
      allowedWindows: detoxPlan.allowedWindows.filter((_, i) => i !== idx),
    });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    updateDetoxPlan({
      alternativeActivities: [...detoxPlan.alternativeActivities, newActivity.trim()],
    });
    setNewActivity('');
  };

  const handleDeleteActivity = (idx: number) => {
    updateDetoxPlan({
      alternativeActivities: detoxPlan.alternativeActivities.filter((_, i) => i !== idx),
    });
  };

  const minutesSaved = Math.max(0, detoxPlan.estimatedDailyMinutes - detoxPlan.targetDailyMinutes);
  const hoursSavedPerMonth = ((minutesSaved * 30) / 60).toFixed(0);

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#9275FF]/10 border border-[#9275FF]/30 flex items-center justify-center text-[#9275FF]">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#F5F7FC]">Plano de Detox Digital</h2>
          <p className="text-xs text-[#B4BFD2]">
            Recupere sua atenção com limites autodeclarados e redução gradual de dispersão.
          </p>
        </div>
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#222F4A] flex items-start gap-2.5 text-xs text-[#B4BFD2]">
        <ShieldCheck className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F5F7FC]">Transparência e Privacidade:</strong> Estes registros são 100% autodeclarados
          por você. O aplicativo não monitora, não bloqueia e não tem acesso a outros aplicativos nem coleta estatísticas
          de sistema.
        </p>
      </div>

      {/* Screen Time Self Assessment & Goal */}
      <div className="p-5 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Estimativa de Consumo Diário e Meta Gradual
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="daily-consumption-input" className="block text-xs text-[#B4BFD2] mb-1">
              Tempo diário estimado em redes/telas (minutos):
            </label>
            <div className="flex items-center gap-2">
              <input
                id="daily-consumption-input"
                type="number"
                min="0"
                step="15"
                value={estimatedDaily}
                onChange={(e) => setEstimatedDaily(Number(e.target.value))}
                className="w-28 px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs font-mono text-[#F5F7FC]"
              />
              <span className="text-xs text-[#B4BFD2]">
                ~{(estimatedDaily / 60).toFixed(1)}h por dia
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="target-consumption-input" className="block text-xs text-[#B4BFD2] mb-1">
              Sua meta gradual de consumo deliberado (minutos):
            </label>
            <div className="flex items-center gap-2">
              <input
                id="target-consumption-input"
                type="number"
                min="0"
                step="15"
                value={targetDaily}
                onChange={(e) => setTargetDaily(Number(e.target.value))}
                className="w-28 px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs font-mono text-[#F5F7FC]"
              />
              <span className="text-xs text-[#B4BFD2]">
                ~{(targetDaily / 60).toFixed(1)}h por dia
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#1D2940]">
          <p className="text-xs text-[#65D6A4] font-medium">
            Economia projetada: <strong>{minutesSaved} min/dia</strong> (~{hoursSavedPerMonth} horas livres por mês).
          </p>
          <button
            type="button"
            onClick={handleSaveMinutes}
            className="px-4 py-2 rounded-xl bg-[#D4FF63] text-black text-xs font-bold hover:bg-[#BFEC4E] transition-colors"
          >
            Atualizar Metas
          </button>
        </div>
      </div>

      {/* Environment & Notification Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Checklist de Blindagem de Ambiente
        </h3>
        <div className="space-y-2">
          {checklistItems.map((item) => {
            const isChecked = !!detoxPlan.checkedEnvironment[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleToggleCheck(item.key)}
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
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
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

      {/* Scheduled Windows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
            Janelas Deliberadas de Uso
          </h3>
          <span className="text-[11px] text-[#B4BFD2]">
            Acesse mensagens apenas nestes horários
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {detoxPlan.allowedWindows.map((win, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] flex items-center gap-2"
            >
              <Clock className="w-3 h-3 text-[#D4FF63]" />
              <span>{win}</span>
              <button
                type="button"
                onClick={() => handleDeleteWindow(idx)}
                className="text-[#B4BFD2] hover:text-red-400 p-1"
                aria-label="Remover janela"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddWindow} className="flex gap-2">
          <input
            type="text"
            value={newWindow}
            onChange={(e) => setNewWindow(e.target.value)}
            placeholder="Ex: 12:30 - 13:00, 18:00 - 18:30..."
            className="flex-1 px-3 py-2 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
          />
          <button
            type="submit"
            disabled={!newWindow.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#1D2940] hover:bg-[#D4FF63] hover:text-black text-xs font-semibold text-[#F5F7FC] transition-colors disabled:opacity-40"
          >
            Adicionar Janela
          </button>
        </form>
      </div>

      {/* Alternative Activities */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Atividades de Substituição Preparadas
        </h3>
        <p className="text-xs text-[#B4BFD2]">
          O que você fará no lugar do feed para evitar o tédio involuntário:
        </p>

        <div className="space-y-1.5">
          {detoxPlan.alternativeActivities.map((act, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] flex items-center justify-between gap-3 text-xs text-[#E0E6F0]"
            >
              <span>• {act}</span>
              <button
                type="button"
                onClick={() => handleDeleteActivity(idx)}
                className="text-[#B4BFD2] hover:text-red-400 p-1"
                aria-label="Remover atividade"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddActivity} className="flex gap-2">
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Nova atividade alternativa (ex: 20 flexões, chá relaxante...)"
            className="flex-1 px-3 py-2 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
          />
          <button
            type="submit"
            disabled={!newActivity.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#1D2940] hover:bg-[#D4FF63] hover:text-black text-xs font-semibold text-[#F5F7FC] transition-colors disabled:opacity-40"
          >
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
};
