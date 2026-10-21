import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_HABIT_TEMPLATES } from '../../data/habitsTemplates';
import { getLocalDateString } from '../../utils/habitCalculations';
import { Check, Bell, Sparkles, ArrowRight, ShieldCheck, Clock, TrendingUp } from 'lucide-react';

interface OnboardingModalProps {
  onOpenDiagnostic: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onOpenDiagnostic }) => {
  const { profile, completeOnboarding } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [name, setName] = useState(profile.name || '');
  const [mainGoal, setMainGoal] = useState(profile.mainGoal || '');
  const [startDate, setStartDate] = useState(profile.startDate || getLocalDateString());
  const [reminderTime, setReminderTime] = useState(profile.preferredReminderTime || '07:30');
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    INITIAL_HABIT_TEMPLATES[0].title,
    INITIAL_HABIT_TEMPLATES[1].title,
    INITIAL_HABIT_TEMPLATES[3].title,
  ]);

  if (profile.onboardingCompleted) {
    return null;
  }

  const toggleHabitSelection = (title: string) => {
    setSelectedHabits((prev) => {
      if (prev.includes(title)) {
        return prev.filter((t) => t !== title);
      } else {
        if (prev.length >= 5) return prev; // max 5
        return [...prev, title];
      }
    });
  };

  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setEnableNotifications(true);
        } else {
          setEnableNotifications(false);
        }
      } catch {
        setEnableNotifications(false);
      }
    } else {
      setEnableNotifications(true);
    }
  };

  const handleFinish = (openDiag = false) => {
    completeOnboarding(
      {
        name: name.trim(),
        mainGoal: mainGoal.trim(),
        startDate,
        preferredReminderTime: reminderTime,
        notificationsEnabled: enableNotifications,
      },
      selectedHabits
    );

    if (openDiag) {
      onOpenDiagnostic();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#141D30] border border-[#222F4A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header / Brand lockup */}
        <div className="p-6 border-b border-[#222F4A] bg-[#0E1524] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#090E1A] border border-[#D4FF63]/40 flex items-center justify-center overflow-hidden">
              <img
                src="/src/assets/images/modo_avanco_emblem_1792530180803.jpg"
                alt="Emblema Modo Avanço"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4FF63] font-semibold">Boas-vindas</span>
              <h2 className="text-lg font-bold text-[#F5F7FC] tracking-tight">MODO AVANÇO</h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-[#D4FF63]' : s < step ? 'w-2 bg-[#65D6A4]' : 'w-2 bg-[#222F4A]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#F5F7FC]">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-[#222F4A] aspect-video">
                <img
                  src="/src/assets/images/modo_avanco_horizon_1792530180718.jpg"
                  alt="Nova Perspectiva - Formas geométricas ascendentes para o horizonte"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141D30] via-transparent to-black/30" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-xs text-[#B4BFD2]">Proposta de Valor</p>
                  <p className="text-base font-semibold text-[#F5F7FC]">“Seu próximo nível começa hoje.”</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-[#F5F7FC]">Saia da estagnação e avance com clareza</h3>
                <p className="text-xs text-[#B4BFD2] leading-relaxed">
                  O <strong>Modo Avanço</strong> é um sistema prático e 100% offline para romper a inércia, transformar
                  metas abstratas em ações diárias e sustentar blocos de foco real sem ruídos ou distrações.
                </p>
              </div>

              <div className="pt-2 border-t border-[#222F4A] space-y-1 text-xs text-[#B4BFD2]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#65D6A4]" />
                  <span>Seus dados ficam 100% no seu dispositivo. Sem anúncios ou cadastro obrigatório.</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#F5F7FC]">Quem é você e qual seu próximo nível?</h3>
                <p className="text-xs text-[#B4BFD2]">
                  Campos opcionais. Você pode alterar tudo a qualquer momento nas configurações.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="user-name-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
                    Como prefere ser chamado? (Opcional)
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos, Ana..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] placeholder-[#6E7B94] focus:outline-none focus:border-[#D4FF63] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="main-goal-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
                    Qual seu principal objetivo para os próximos 21 dias?
                  </label>
                  <input
                    id="main-goal-input"
                    type="text"
                    value={mainGoal}
                    onChange={(e) => setMainGoal(e.target.value)}
                    placeholder="Ex: Estudar 1h por dia sem celular, acordar com energia..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] placeholder-[#6E7B94] focus:outline-none focus:border-[#D4FF63] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="start-date-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
                    Data de início da Jornada
                  </label>
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#F5F7FC]">Selecione de 3 a 5 hábitos fundamentais</h3>
                <p className="text-xs text-[#B4BFD2]">
                  Consistência supera volume. Escolha os hábitos que constroem a base da sua nova rotina.
                </p>
              </div>

              <div className="space-y-2">
                {INITIAL_HABIT_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedHabits.includes(tmpl.title);
                  return (
                    <button
                      key={tmpl.title}
                      type="button"
                      onClick={() => toggleHabitSelection(tmpl.title)}
                      className={`w-full p-3 text-left rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#D4FF63]/10 border-[#D4FF63] text-[#F5F7FC]'
                          : 'bg-[#090E1A] border-[#222F4A] text-[#B4BFD2] hover:border-[#2C3C5C]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className={`font-medium text-xs ${isSelected ? 'text-[#F5F7FC]' : 'text-[#E0E6F0]'}`}>
                          {tmpl.title}
                        </p>
                        <p className="text-[11px] text-[#B4BFD2]">{tmpl.reason}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                          isSelected
                            ? 'bg-[#D4FF63] border-[#D4FF63] text-black'
                            : 'border-[#2C3C5C] bg-[#141D30]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-right text-[#B4BFD2]">
                Selecionados: {selectedHabits.length} de 5 (mínimo 3 recomendado)
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#F5F7FC]">Lembretes e Diagnóstico Inicial</h3>
                <p className="text-xs text-[#B4BFD2]">
                  Defina um horário matinal para revisar suas prioridades do dia.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4FF63]" />
                    <span className="text-xs font-medium text-[#F5F7FC]">Horário preferido para lembretes</span>
                  </div>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#141D30] border border-[#222F4A] text-[#F5F7FC] text-xs font-mono"
                  />
                </div>

                <div className="pt-2 border-t border-[#1D2940] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#F5F7FC]">Ativar notificações no dispositivo</p>
                    <p className="text-[11px] text-[#B4BFD2]">Se recusar, o app continua funcionando 100%.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestNotification}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      enableNotifications
                        ? 'bg-[#65D6A4]/20 text-[#65D6A4] border border-[#65D6A4]/40'
                        : 'bg-[#1D2940] text-[#F5F7FC] hover:bg-[#2C3C5C]'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{enableNotifications ? 'Ativadas' : 'Permitir'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1D2940] border border-[#9275FF]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#9275FF]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Mapa de Diagnóstico Inicial</span>
                </div>
                <p className="text-xs text-[#E0E6F0] leading-relaxed">
                  Avalie seus 4 pilares (Domínio Mental, Vitalidade, Intelectual e Finanças) com notas de 0 a 10 para ter
                  sua linha de base de comparação. Você pode fazer agora ou deixar para depois.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-[#0E1524] border-t border-[#222F4A] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="px-4 py-2 text-xs font-medium text-[#B4BFD2] hover:text-[#F5F7FC] transition-colors"
            >
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#D4FF63] hover:bg-[#BFEC4E] rounded-xl transition-colors flex items-center gap-2 ml-auto shadow-md shadow-[#D4FF63]/20"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => handleFinish(false)}
                className="px-4 py-2.5 text-xs font-medium text-[#B4BFD2] hover:text-[#F5F7FC] rounded-xl transition-colors"
              >
                Pular Diagnóstico
              </button>
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="px-5 py-2.5 text-xs font-bold text-black bg-[#D4FF63] hover:bg-[#BFEC4E] rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-[#D4FF63]/20"
              >
                <span>Fazer Diagnóstico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
