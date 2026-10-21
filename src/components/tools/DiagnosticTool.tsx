import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DIAGNOSTIC_PILLARS, calculateDiagnosticAverages } from '../../data/diagnosticQuestions';
import { soundController } from '../../utils/audioFeedback';
import { Shield, Sparkles, Check, ChevronDown, ChevronUp, History, TrendingUp, Info } from 'lucide-react';

export const DiagnosticTool: React.FC = () => {
  const { diagnostics, saveDiagnostic } = useApp();

  // Current active scores form state (can be null for unanswered)
  const [scores, setScores] = useState<Record<string, number | null>>(() => {
    const latest = diagnostics[0];
    const initial: Record<string, number | null> = {};
    for (const pillar of DIAGNOSTIC_PILLARS) {
      for (const item of pillar.items) {
        initial[item.id] = latest ? latest.scores[item.id] ?? null : null;
      }
    }
    return initial;
  });

  const [selectedFocusPillar, setSelectedFocusPillar] = useState<string>('mental');
  const [showHistory, setShowHistory] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentCalculations = calculateDiagnosticAverages(scores);

  const handleScoreChange = (itemId: string, val: number | null) => {
    setScores((prev) => ({ ...prev, [itemId]: val }));
    soundController.playTick(500);
  };

  const handleSave = () => {
    saveDiagnostic(scores, selectedFocusPillar);
    soundController.playCompletionChime();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const latestEvaluation = diagnostics[0];
  const previousEvaluation = diagnostics[1];

  // Modern palette for pillars:
  const pillarColorMap: Record<string, string> = {
    mental: '#D4FF63', // action lime
    vitalidade: '#65D6A4', // success mint
    intelectual: '#9275FF', // violet
    autoridade: '#38BDF8', // sky blue
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4FF63]/10 border border-[#D4FF63]/30 flex items-center justify-center text-[#D4FF63]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F5F7FC]">Mapa de Diagnóstico dos 4 Pilares</h2>
            <p className="text-xs text-[#B4BFD2]">
              Autoavaliação de 0 a 10 para identificar alavancas de foco, clareza e evolução.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {diagnostics.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-xl bg-[#090E1A] border border-[#222F4A] hover:border-[#2C3C5C] text-xs text-[#E0E6F0] flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-[#D4FF63]" />
              <span>{showHistory ? 'Ocultar Histórico' : `Histórico (${diagnostics.length})`}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={currentCalculations.answeredCount === 0}
            className="px-4 py-2 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 min-h-[40px]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Salvar Avaliação</span>
          </button>
        </div>
      </div>

      {/* Notice & Calculation Rule Banner */}
      <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#B4BFD2] space-y-1">
        <p className="leading-relaxed">
          <strong className="text-[#F5F7FC]">Percepção Pessoal e Não-Clínica:</strong> Este mapa é um instrumento de
          consciência prática, nunca uma avaliação psicológica clínica.
        </p>
        <p className="text-[11px] text-[#8C98AF]">
          <strong>Regra de Cálculo:</strong> A média de cada pilar considera exclusivamente os itens preenchidos (soma das
          notas dividida pelo número de respostas). Itens sem nota não contam como zero.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-[#65D6A4]/15 border border-[#65D6A4]/40 text-xs font-semibold text-[#65D6A4] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Avaliação gravada com sucesso no histórico local do dispositivo!</span>
        </div>
      )}

      {/* Pillar Averages Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DIAGNOSTIC_PILLARS.map((pillar) => {
          const avg = currentCalculations.pillarAverages[pillar.id] || 0;
          const color = pillarColorMap[pillar.id] || '#D4FF63';
          return (
            <div
              key={pillar.id}
              className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#F5F7FC]">{pillar.name}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
              <p className="text-xl font-bold font-mono text-[#F5F7FC] tabular-nums">
                {avg.toFixed(1)} <span className="text-[10px] text-[#B4BFD2]">/10</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Global Average & Answered count */}
      <div className="p-4 rounded-xl bg-[#0E1524] border border-[#222F4A] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[#B4BFD2]">Média Geral Pessoal:</span>{' '}
          <strong className="text-lg font-mono text-[#D4FF63] ml-1 tabular-nums">
            {currentCalculations.overallAverage.toFixed(1)} / 10
          </strong>
        </div>
        <div className="text-[#B4BFD2]">
          Respostas preenchidas:{' '}
          <strong className="text-[#F5F7FC] font-mono tabular-nums">
            {currentCalculations.answeredCount} de 12
          </strong>
        </div>
      </div>

      {/* Accessible Visual Chart: Pillar Comparison Bars */}
      <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Visualização dos Pilares (Gráfico Acessível)
        </h3>

        <div className="space-y-2.5">
          {DIAGNOSTIC_PILLARS.map((pillar) => {
            const currentAvg = currentCalculations.pillarAverages[pillar.id] || 0;
            const prevAvg = previousEvaluation?.pillarAverages[pillar.id];
            const color = pillarColorMap[pillar.id] || '#D4FF63';

            return (
              <div key={pillar.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F5F7FC]">{pillar.name}</span>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    {prevAvg !== undefined && (
                      <span className="text-[10px] text-[#8C98AF]">
                        Anterior: {prevAvg.toFixed(1)}
                      </span>
                    )}
                    <span className="font-bold text-[#F5F7FC]">{currentAvg.toFixed(1)} / 10</span>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-[#141D30] overflow-hidden border border-[#222F4A] p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, currentAvg * 10)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12 Detailed Assessment Questions */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Autoavaliação Detalhada por Item
        </h3>

        {DIAGNOSTIC_PILLARS.map((pillar) => {
          const color = pillarColorMap[pillar.id] || '#D4FF63';
          return (
            <div key={pillar.id} className="space-y-3 p-4 rounded-xl bg-[#090E1A] border border-[#222F4A]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <h4 className="text-sm font-bold text-[#F5F7FC]">{pillar.name}</h4>
              </div>
              <p className="text-xs text-[#B4BFD2]">{pillar.description}</p>

              <div className="space-y-4 pt-2">
                {pillar.items.map((item) => {
                  const currentScore = scores[item.id];

                  return (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#141D30] border border-[#222F4A] space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-bold text-[#F5F7FC]">{item.title}</h5>
                          <p className="text-[11px] text-[#B4BFD2] mt-0.5">{item.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold font-mono tabular-nums text-[#D4FF63]">
                            {currentScore !== null ? `${currentScore} / 10` : 'Pendente'}
                          </span>
                        </div>
                      </div>

                      {/* Numeric Selector (0 to 10) */}
                      <div className="grid grid-cols-11 gap-1 pt-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleScoreChange(item.id, num)}
                            className={`py-1.5 rounded text-xs font-mono font-bold transition-all min-h-[36px] ${
                              currentScore === num
                                ? 'bg-[#D4FF63] text-black shadow-md shadow-[#D4FF63]/30'
                                : 'bg-[#090E1A] text-[#B4BFD2] hover:text-[#F5F7FC] border border-[#222F4A]'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between text-[10px] text-[#8C98AF] pt-0.5">
                        <span>0: {item.lowPrompt}</span>
                        <span>10: {item.highPrompt}</span>
                      </div>

                      {/* Action Suggestion */}
                      <div className="text-[11px] text-[#65D6A4] bg-[#65D6A4]/10 p-2 rounded-lg border border-[#65D6A4]/20 mt-1">
                        <strong>Ação sugerida:</strong> {item.recommendedAction}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Evaluations Comparison */}
      {showHistory && (
        <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
            Histórico Datado de Avaliações ({diagnostics.length})
          </h3>

          <div className="space-y-2">
            {diagnostics.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-lg bg-[#141D30] border border-[#222F4A] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono text-[#D4FF63] font-semibold">{d.date}</span>
                  <p className="text-[11px] text-[#B4BFD2] mt-0.5">
                    {d.answeredCount} respostas • Mental: {d.pillarAverages.mental || 0} • Vitalidade:{' '}
                    {d.pillarAverages.vitalidade || 0} • Intelectual: {d.pillarAverages.intelectual || 0} • Finanças:{' '}
                    {d.pillarAverages.autoridade || 0}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-[#F5F7FC] tabular-nums">
                    {d.overallAverage.toFixed(1)} / 10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
