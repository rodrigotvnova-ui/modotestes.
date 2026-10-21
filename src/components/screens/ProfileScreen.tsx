import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateOverallHabitAdherence } from '../../utils/habitCalculations';
import {
  User,
  Award,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Smartphone,
  Eye,
  Bell,
  Code,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  TrendingUp,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    updateProfile,
    completedDaysCount,
    habits,
    habitLogs,
    focusSessions,
    goals,
    achievements,
    exportBackupJson,
    previewBackupJson,
    applyImportedBackup,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'settings' | 'backup' | 'privacy' | 'android_dev'>('stats');

  // Edit profile state
  const [nameInput, setNameInput] = useState(profile.name);
  const [goalInput, setGoalInput] = useState(profile.mainGoal);
  const [reminderInput, setReminderInput] = useState(profile.preferredReminderTime);
  const [fontScaleInput, setFontScaleInput] = useState(profile.fontScale);
  const [reducedMotionInput, setReducedMotionInput] = useState(profile.reducedMotion);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Backup & Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<{ summary?: string; error?: string; backup?: any } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const overallAdhesion = calculateOverallHabitAdherence(habits, habitLogs);
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.actualMinutes, 0);
  const completedGoalsCount = goals.filter((g) => g.completed).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim(),
      mainGoal: goalInput.trim(),
      preferredReminderTime: reminderInput,
      fontScale: fontScaleInput,
      reducedMotion: reducedMotionInput,
    });
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modo_avanco_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = previewBackupJson(content);
      if (result.valid) {
        setImportPreview({ summary: result.summary, backup: result.backup });
      } else {
        setImportPreview({ error: result.error });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = () => {
    if (importPreview?.backup) {
      applyImportedBackup(importPreview.backup);
      setImportPreview(null);
      alert('Backup restaurado com sucesso!');
    }
  };

  return (
    <div className="space-y-6 pb-24 text-[#F5F7FC] animate-fade-in">
      {/* Profile Header Lockup */}
      <section className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#090E1A] border border-[#D4FF63]/40 flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/images/modo_avanco_emblem_1792530180803.jpg"
              alt="Avatar Modo Avanço"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-bold text-[#F5F7FC]">
              {profile.name || 'Praticante do Avanço'}
            </h1>
            <p className="text-xs text-[#B4BFD2]">
              {profile.mainGoal || '“Seu próximo nível começa hoje.”'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 p-1 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 rounded-lg transition-colors ${
              activeTab === 'stats'
                ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Progresso Real
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Configurações
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`py-2 px-1 rounded-lg transition-colors ${
              activeTab === 'backup'
                ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Backup & Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-2 px-1 rounded-lg transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#1D2940] text-[#D4FF63] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Privacidade
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('android_dev')}
            className={`py-2 px-1 rounded-lg transition-colors col-span-2 sm:col-span-1 ${
              activeTab === 'android_dev'
                ? 'bg-[#1D2940] text-[#65D6A4] font-bold shadow-sm border border-[#2C3C5C]'
                : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
            }`}
          >
            Google Play / Nativo
          </button>
        </div>
      </section>

      {/* TAB 1: REAL PROGRESS & ACHIEVEMENTS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#141D30] border border-[#222F4A] space-y-1">
              <span className="text-[10px] text-[#B4BFD2] uppercase font-bold">Dias Concluídos</span>
              <p className="text-2xl font-bold font-mono text-[#D4FF63] tabular-nums">
                {completedDaysCount} <span className="text-xs text-[#B4BFD2]">/21</span>
              </p>
              <p className="text-[10px] text-[#8C98AF]">
                {Math.round((completedDaysCount / 21) * 100)}% da jornada
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141D30] border border-[#222F4A] space-y-1">
              <span className="text-[10px] text-[#B4BFD2] uppercase font-bold">Adesão a Hábitos</span>
              <p className="text-2xl font-bold font-mono text-[#65D6A4] tabular-nums">
                {overallAdhesion}%
              </p>
              <p className="text-[10px] text-[#8C98AF]">Apenas dias programados</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141D30] border border-[#222F4A] space-y-1">
              <span className="text-[10px] text-[#B4BFD2] uppercase font-bold">Minutos de Foco</span>
              <p className="text-2xl font-bold font-mono text-[#F5F7FC] tabular-nums">
                {totalFocusMinutes}
              </p>
              <p className="text-[10px] text-[#8C98AF]">
                {(totalFocusMinutes / 60).toFixed(1)}h de imersão
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141D30] border border-[#222F4A] space-y-1">
              <span className="text-[10px] text-[#B4BFD2] uppercase font-bold">Metas Concluídas</span>
              <p className="text-2xl font-bold font-mono text-[#9275FF] tabular-nums">
                {completedGoalsCount}
              </p>
              <p className="text-[10px] text-[#8C98AF]">De {goals.length} metas cadastradas</p>
            </div>
          </div>

          {/* Non-punitive Achievements */}
          <div className="p-5 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4FF63]" />
              <h3 className="text-sm font-bold text-[#F5F7FC] uppercase tracking-wider">
                Marcos de Conquista Pessoal
              </h3>
            </div>
            <p className="text-xs text-[#B4BFD2]">
              Reconhecimento do seu esforço real. Sem penalidades ou perda punitiva de progresso.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => {
                const isUnlocked = !!ach.unlockedAt;
                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-[#090E1A] border-[#D4FF63]/40 text-[#F5F7FC]'
                        : 'bg-[#090E1A]/50 border-[#1D2940] text-[#6E7B94] opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-[#D4FF63]/20 text-[#D4FF63] border border-[#D4FF63]/40'
                          : 'bg-[#141D30] text-[#6E7B94]'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold">{ach.title}</h4>
                        {isUnlocked && (
                          <span className="text-[9px] font-bold text-[#65D6A4] uppercase bg-[#65D6A4]/10 px-1.5 py-0.2 rounded">
                            Desbloqueada
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#B4BFD2]">{ach.description}</p>
                      <p className="text-[10px] text-[#8C98AF]">Condição: {ach.condition}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SETTINGS & ACCESSIBILITY */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-5">
          <div className="flex items-center justify-between border-b border-[#222F4A] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#F5F7FC]">Configurações de Perfil & Acessibilidade</h3>
              <p className="text-xs text-[#B4BFD2]">Personalize sua experiência no aplicativo.</p>
            </div>
            {savedSettingsMsg && (
              <span className="text-xs text-[#65D6A4] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Salvo!
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label htmlFor="settings-name-input" className="block text-[#B4BFD2] font-semibold mb-1">Seu Nome ou Apelido</label>
              <input
                id="settings-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ex: Carlos"
                className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
              />
            </div>

            <div>
              <label htmlFor="settings-main-goal-input" className="block text-[#B4BFD2] font-semibold mb-1">Objetivo Central</label>
              <input
                id="settings-main-goal-input"
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Ex: Rotina de estudos e 50 min de foco diário..."
                className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="settings-reminder-input" className="block text-[#B4BFD2] font-semibold mb-1">
                  Horário Preferido para Lembretes
                </label>
                <input
                  id="settings-reminder-input"
                  type="time"
                  value={reminderInput}
                  onChange={(e) => setReminderInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC] font-mono"
                />
              </div>

              <div>
                <label htmlFor="settings-font-scale-select" className="block text-[#B4BFD2] font-semibold mb-1">Tamanho da Fonte (Acessibilidade)</label>
                <select
                  id="settings-font-scale-select"
                  value={fontScaleInput}
                  onChange={(e) => setFontScaleInput(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#F5F7FC]"
                >
                  <option value="normal">Normal (100%)</option>
                  <option value="large">Ampliada (115%)</option>
                  <option value="extra_large">Muito Ampliada (130%)</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#222F4A] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#F5F7FC]">Redução de Animações</p>
                <p className="text-[11px] text-[#B4BFD2]">Diminui efeitos de transição para maior conforto visual.</p>
              </div>
              <button
                type="button"
                onClick={() => setReducedMotionInput(!reducedMotionInput)}
                className={`w-11 h-6 rounded-full transition-colors p-1 ${
                  reducedMotionInput ? 'bg-[#D4FF63]' : 'bg-[#222F4A]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    reducedMotionInput ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#222F4A] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors min-h-[44px]"
            >
              Salvar Preferências
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: BACKUP, RESTORE & DATA ERASURE */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F5F7FC]">Gerenciamento de Dados & Backup JSON</h3>
            <p className="text-xs text-[#B4BFD2]">
              Exporte seus dados para um arquivo seguro ou restaure em outro aparelho sem depender de nuvens externas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export */}
            <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#D4FF63]">
                  <Download className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase">Exportar Backup Completo</h4>
                </div>
                <p className="text-xs text-[#B4BFD2] leading-relaxed">
                  Gera um arquivo <code>.json</code> versionado contendo todos os seus hábitos, histórico de 21 dias,
                  metas e reflexões.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full py-2.5 rounded-xl bg-[#1D2940] hover:bg-[#D4FF63] hover:text-black text-xs font-bold text-[#F5F7FC] transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Backup JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#9275FF]">
                  <Upload className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase">Restaurar de Arquivo</h4>
                </div>
                <p className="text-xs text-[#B4BFD2] leading-relaxed">
                  Carregue um arquivo JSON gerado anteriormente. Você poderá conferir uma prévia dos dados antes de
                  confirmar.
                </p>
              </div>
              <label className="w-full py-2.5 rounded-xl bg-[#1D2940] hover:bg-[#9275FF] hover:text-white text-xs font-bold text-[#F5F7FC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]">
                <Upload className="w-4 h-4" />
                <span>Selecionar Arquivo JSON</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Import Preview Modal / Card */}
          {importPreview && (
            <div className="p-4 rounded-xl bg-[#0E1524] border border-[#9275FF]/50 space-y-3 text-xs">
              <h4 className="font-bold text-[#F5F7FC]">Validação do Arquivo de Backup:</h4>
              {importPreview.error ? (
                <div className="text-red-400 font-medium">
                  {importPreview.error}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[#65D6A4] font-medium">{importPreview.summary}</p>
                  <p className="text-[#B4BFD2]">
                    Deseja substituir os dados locais atuais pelos dados contidos neste arquivo de backup?
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setImportPreview(null)}
                      className="px-3 py-1.5 text-xs text-[#B4BFD2]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="px-4 py-2 rounded-xl bg-[#9275FF] text-white font-bold text-xs"
                    >
                      Confirmar Restauração
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Android Auto-Backup Explanation */}
          <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#B4BFD2] space-y-2">
            <h4 className="font-bold text-[#F5F7FC]">Sobre o Backup Automático do Android:</h4>
            <p className="leading-relaxed">
              No aplicativo nativo Android, o recurso padrão <code>android:allowBackup="true"</code> do sistema
              operacional pode sincronizar dados privados do aplicativo com o Google Drive vinculado à sua conta Google,
              conforme as políticas do sistema Android. Caso prefira isolamento estrito sem sincronização na nuvem do
              Google, este parâmetro pode ser definido como falso no arquivo de manifesto.
            </p>
          </div>

          {/* Danger Zone: Delete all data */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase">Zona de Perigo • Excluir Todos os Dados</h4>
            </div>
            <p className="text-xs text-[#B4BFD2] leading-relaxed">
              Esta ação apagará permanentemente todos os registros, hábitos, metas, avaliações de diagnóstico e histórico
              deste aparelho. A operação é irreversível.
            </p>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/40 text-xs font-bold transition-colors min-h-[44px]"
            >
              Apagar Todos os Dados do Aplicativo
            </button>
          </div>

          {/* Safe Reset Modal */}
          {showResetConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-[#141D30] border border-red-600/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-red-400">Tem certeza absoluta?</h3>
                <p className="text-xs text-[#B4BFD2] leading-relaxed">
                  Todos os seus dados salvos neste dispositivo serão apagados agora. Recomendamos exportar um backup
                  antes se quiser guardá-los.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 text-xs font-medium text-[#B4BFD2]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetAllData();
                      setShowResetConfirm(false);
                      alert('Todos os dados foram excluídos. O aplicativo foi reiniciado.');
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
                  >
                    Confirmar Exclusão Total
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRIVACY */}
      {activeTab === 'privacy' && (
        <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-5 text-xs text-[#E0E6F0] leading-relaxed">
          <div className="flex items-center gap-2 text-[#65D6A4]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FC]">Política de Privacidade & Arquitetura Local</h3>
          </div>

          <div className="space-y-3 bg-[#090E1A] p-4 rounded-xl border border-[#222F4A]">
            <h4 className="font-bold text-[#F5F7FC]">1. Coleta e Armazenamento Local de Dados</h4>
            <p>
              O aplicativo <strong>Modo Avanço</strong> opera inteiramente em arquitetura <em>offline-first</em>.
              Todos os seus registros de hábitos, reflexões diárias, notas de autoavaliação, metas SMART e registros
              financeiros são salvos exclusivamente no armazenamento local do seu dispositivo (Room Database / Local
              Storage).
            </p>
          </div>

          <div className="space-y-3 bg-[#090E1A] p-4 rounded-xl border border-[#222F4A]">
            <h4 className="font-bold text-[#F5F7FC]">2. Ausência de Telemetria e Rastreadores</h4>
            <p>
              Esta versão não contém SDKs de publicidade, ferramentas de telemetria analítica, rastreadores de
              comportamento nem dependências de servidores externos. Suas anotações íntimas e reflexões nunca são
              enviadas a serviços de terceiros.
            </p>
          </div>

          <div className="space-y-3 bg-[#090E1A] p-4 rounded-xl border border-[#222F4A]">
            <h4 className="font-bold text-[#F5F7FC]">3. Pendências Formais de Lançamento (Play Store)</h4>
            <div className="p-3 rounded-lg bg-[#1D2940] border border-[#FFD080]/30 text-[#FFD080] text-[11px] space-y-1">
              <p>
                <strong>Sinalização Editorial:</strong> Antes da submissão formal à Google Play Console, deverão ser
                preenchidos os seguintes dados do responsável legal da publicação:
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Nome da entidade ou desenvolvedor responsável: [A definir antes da publicação]</li>
                <li>E-mail oficial de suporte ao usuário: [A definir antes da publicação]</li>
                <li>URL pública oficial da Política de Privacidade na web: [A definir antes da publicação]</li>
              </ul>
            </div>
          </div>

          {/* Audit of Original PDFs */}
          <div className="space-y-3 bg-[#090E1A] p-4 rounded-xl border border-[#222F4A]">
            <h4 className="font-bold text-[#D4FF63]">4. Auditoria dos Anexos Originais (PDFs): Pendências de Edição Autorizada</h4>
            <p className="text-[11px] text-[#B4BFD2] leading-relaxed">
              O aplicativo foi 100% atualizado para a marca comercial <strong>Modo Avanço</strong>. Caso os arquivos PDF brutos originais venham a ser distribuídos como downloads externos fora do app, sinalizamos abaixo os arquivos e páginas exatas que contêm marcas anteriores nos arquivos físicos e necessitam de uma reedição autorizada pela editora:
            </p>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#D4FF63] font-bold">1. Desafio 21 dias — Código da Virada.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Capa, Sumário, Apresentação (págs. 1 a 4) e rodapé em todas as lições diárias (págs. 5 a 28). Requer diagramação com o logotipo e nome Modo Avanço.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#D4FF63] font-bold">2. Mapa de Diagnóstico.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Capa e cabeçalhos superiores das matrizes de pontuação (págs. 1 a 6). Requer renomeação para "Mapa de Diagnóstico Modo Avanço".</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#D4FF63] font-bold">3. Redefinição de Metas.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Capa e bloco de autoria na introdução (pág. 2). Substituir referências ao programa legado por Modo Avanço.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#D4FF63] font-bold">4. Detox Digital.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Rodapés das seções práticas (págs. 7 e 12), onde cita o programa como requisito de acompanhamento.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#D4FF63] font-bold">5. Rastreador de Hábitos de Elite.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Capa e cabeçalho das tabelas de controle de 21 dias (págs. 1 e 3).</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#D4FF63] font-bold">6. Vencendo a Procrastinação.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Capa e texto do prefácio orientador (págs. 1 a 3).</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                <span className="text-[#65D6A4] font-bold">7. A Ciência dos Hábitos.pdf:</span>
                <p className="text-[#B4BFD2] mt-0.5">Texto estritamente conceitual e neurocientífico; isento de menções à marca comercial antiga no corpo teórico.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOOGLE PLAY SUBMISSION CHECKLIST & ANDROID NATIVE CODE */}
      {activeTab === 'android_dev' && (
        <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6 text-xs text-[#E0E6F0]">
          <div className="flex items-center gap-2 text-[#65D6A4]">
            <Smartphone className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7FC]">
              Preparação Técnica para Submissão à Google Play
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1524] border border-[#222F4A] space-y-2">
            <div className="flex items-center gap-2 text-[#D4FF63] font-bold">
              <Info className="w-4 h-4" />
              <span>Status Atual do Projeto e Métodos de Distribuição</span>
            </div>
            <p className="text-[#B4BFD2] leading-relaxed">
              <strong>1. Versão Web/PWA Instalável (Disponível Imediatamente):</strong> O Modo Avanço já pode ser instalado diretamente no celular com 1 clique (Android) ou via Safari "Adicionar à Tela de Início" (iOS). Funciona em tela cheia (standalone) com ícone próprio na home screen e suporte 100% offline via Service Worker e LocalStorage.
            </p>
            <p className="text-[#8C98AF] leading-relaxed">
              <strong>2. Google Play Store (Release Nativa AAB):</strong> Uma PWA instalável no celular não equivale automaticamente a um app publicado na loja. Para disponibilizar na Play Store, utilize os arquivos e o mapeamento de arquitetura Android abaixo para compilação do pacote <code>.aab</code> (Android App Bundle) via Gradle/Android Studio.
            </p>
          </div>

          <p className="leading-relaxed">
            Abaixo estão a estrutura de engenharia Android nativa (Kotlin + Jetpack Compose + Room) e o checklist
            exaustivo de conformidade técnica para submissão oficial à Play Console sob o título comercial{' '}
            <strong>Modo Avanço: Hábitos e Foco</strong>.
          </p>

          {/* Official Google Play Checklist */}
          <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
            <h4 className="font-bold text-[#D4FF63] uppercase tracking-wider text-xs">
              Checklist de Pendências da Google Play Store
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
                <span>
                  <strong>Título Sugerido para a Loja:</strong> <code>Modo Avanço: Hábitos e Foco</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
                <span>
                  <strong>Identificador Técnico do Pacote Preservado:</strong> <code>br.com.codigodavirada.app</code>{' '}
                  (conforme instrução de manter a integridade técnica sem recriar o pacote).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
                <span>
                  <strong>Configuração de Versão:</strong> <code>versionCode = 2</code>, <code>versionName = "2.0.0"</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
                <span>
                  <strong>Target SDK e Requisitos Vigentes:</strong> <code>compileSdk = 35</code>,{' '}
                  <code>targetSdk = 35</code>, <code>minSdk = 26</code> (Android 8.0+ Oreo).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
                <span>
                  <strong>Permissões Mínimas no Manifest:</strong> <code>POST_NOTIFICATIONS</code> (solicitada apenas quando o usuário ativar lembretes).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
                <span>
                  <strong>Formato de Release:</strong> Gerar Android App Bundle (<code>.aab</code>) assinado com chave
                  de release (Keystore RSA 4096 / Play App Signing).
                </span>
              </li>
            </ul>
          </div>

          {/* Android Jetpack Compose Architecture Guide */}
          <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
            <h4 className="font-bold text-[#F5F7FC] uppercase tracking-wider text-xs">
              Mapeamento da Arquitetura Android Nativa (Single-Activity)
            </h4>
            <div className="space-y-2 text-[11px] font-mono text-[#B4BFD2]">
              <p>• <strong>MainActivity.kt:</strong> Single Activity com <code>ComponentActivity</code> e <code>NavHost</code></p>
              <p>• <strong>Navigation:</strong> <code>Navigation Compose</code> (Rotas: hoje, jornada, habitos, ferramentas, perfil)</p>
              <p>• <strong>Persistência:</strong> <code>Room Database</code> (HabitEntity, HabitLogEntity, DayProgressEntity, GoalEntity)</p>
              <p>• <strong>Preferências:</strong> <code>Jetpack DataStore (Preferences)</code> para UserProfile e UI States</p>
              <p>• <strong>Async & State:</strong> <code>Kotlin Coroutines</code>, <code>StateFlow</code> e <code>ViewModel</code></p>
              <p>• <strong>Lembretes:</strong> <code>WorkManager</code> (PeriodicWorkRequest para verificação matinal)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
