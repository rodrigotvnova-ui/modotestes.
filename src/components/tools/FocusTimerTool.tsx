import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { soundController } from '../../utils/audioFeedback';
import { Play, Pause, Square, RotateCcw, Clock, CheckCircle2, Coffee, Sparkles } from 'lucide-react';

interface FocusTimerToolProps {
  initialTask?: string;
  defaultMinutes?: number;
}

export const FocusTimerTool: React.FC<FocusTimerToolProps> = ({ initialTask = '', defaultMinutes = 25 }) => {
  const { recordFocusSession, focusSessions } = useApp();

  const [task, setTask] = useState(initialTask);
  const [targetMinutes, setTargetMinutes] = useState(defaultMinutes);
  const [customMinutesInput, setCustomMinutesInput] = useState('45');
  const [isCustom, setIsCustom] = useState(false);

  // Resilient timestamp-based timer state
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isBreakMode, setIsBreakMode] = useState(false);

  // Tracking references for screen backgrounding resilience
  const startTimeRef = useRef<number | null>(null);
  const accumulatedSecondsRef = useRef<number>(0);

  const totalTargetSeconds = targetMinutes * 60;
  const secondsRemaining = Math.max(0, totalTargetSeconds - secondsElapsed);

  useEffect(() => {
    let animFrame: number;
    const tick = () => {
      if (isRunning && startTimeRef.current !== null) {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - startTimeRef.current) / 1000);
        const currentTotal = accumulatedSecondsRef.current + deltaSeconds;

        if (currentTotal >= totalTargetSeconds) {
          // Timer finished
          setSecondsElapsed(totalTargetSeconds);
          setIsRunning(false);
          startTimeRef.current = null;
          soundController.playCompletionChime();
          const actualMins = Math.round(totalTargetSeconds / 60);
          recordFocusSession(task || 'Bloco de Trabalho Focado', targetMinutes, actualMins);
          setIsBreakMode(true);
          return;
        } else {
          setSecondsElapsed(currentTotal);
          animFrame = requestAnimationFrame(tick);
        }
      }
    };

    if (isRunning) {
      animFrame = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isRunning, totalTargetSeconds, task, targetMinutes, recordFocusSession]);

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
      soundController.playTick(660);
    }
  };

  const handlePause = () => {
    if (isRunning && startTimeRef.current !== null) {
      const now = Date.now();
      const delta = Math.floor((now - startTimeRef.current) / 1000);
      accumulatedSecondsRef.current += delta;
      startTimeRef.current = null;
      setIsRunning(false);
      soundController.playTick(440);
    }
  };

  const handleStop = () => {
    if (secondsElapsed > 30) {
      const actualMins = Math.max(1, Math.round(secondsElapsed / 60));
      recordFocusSession(task || 'Bloco de Trabalho Parcial', targetMinutes, actualMins);
      soundController.playCompletionChime();
    }
    setIsRunning(false);
    startTimeRef.current = null;
    accumulatedSecondsRef.current = 0;
    setSecondsElapsed(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    startTimeRef.current = null;
    accumulatedSecondsRef.current = 0;
    setSecondsElapsed(0);
    setIsBreakMode(false);
  };

  const displayMinutes = Math.floor(secondsRemaining / 60);
  const displaySeconds = secondsRemaining % 60;
  const progressPercent = totalTargetSeconds > 0 ? (secondsElapsed / totalTargetSeconds) * 100 : 0;

  // Total focus minutes today
  const totalFocusMinutesLogged = focusSessions.reduce((acc, s) => acc + s.actualMinutes, 0);

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      {/* Header & Total Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9275FF]/10 border border-[#9275FF]/30 flex items-center justify-center text-[#9275FF]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F5F7FC]">Sessão de Foco Imersivo</h2>
            <p className="text-xs text-[#B4BFD2]">Blocos de trabalho profundo imunes a interrupções.</p>
          </div>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-[#B4BFD2] self-start sm:self-auto font-mono tabular-nums">
          Total acumulado: <strong className="text-[#65D6A4]">{totalFocusMinutesLogged} min</strong>
        </div>
      </div>

      {!isBreakMode ? (
        <div className="space-y-6">
          {/* Task Name */}
          <div>
            <label htmlFor="focus-task-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
              O que você vai produzir neste bloco?
            </label>
            <input
              id="focus-task-input"
              type="text"
              disabled={isRunning}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Ex: Escrever proposta técnica, revisar relatório, leitura densa..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63] disabled:opacity-60"
            />
          </div>

          {/* Preset Buttons (25 min, 50 min, Custom) */}
          {!isRunning && secondsElapsed === 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#B4BFD2] uppercase tracking-wider">
                Duração da Sessão:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetMinutes(25);
                    setIsCustom(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                    targetMinutes === 25 && !isCustom
                      ? 'bg-[#D4FF63] text-black shadow-md shadow-[#D4FF63]/20'
                      : 'bg-[#090E1A] border border-[#222F4A] text-[#E0E6F0]'
                  }`}
                >
                  25 Min (Pomodoro)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetMinutes(50);
                    setIsCustom(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                    targetMinutes === 50 && !isCustom
                      ? 'bg-[#D4FF63] text-black shadow-md shadow-[#D4FF63]/20'
                      : 'bg-[#090E1A] border border-[#222F4A] text-[#E0E6F0]'
                  }`}
                >
                  50 Min (Deep Work)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(true);
                    setTargetMinutes(Number(customMinutesInput) || 30);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                    isCustom
                      ? 'bg-[#D4FF63] text-black shadow-md shadow-[#D4FF63]/20'
                      : 'bg-[#090E1A] border border-[#222F4A] text-[#E0E6F0]'
                  }`}
                >
                  Personalizado
                </button>
              </div>

              {isCustom && (
                <div className="pt-2 flex items-center gap-2">
                  <label htmlFor="custom-minutes-input" className="text-xs text-[#B4BFD2]">Minutos desejados:</label>
                  <input
                    id="custom-minutes-input"
                    type="number"
                    min="1"
                    max="180"
                    value={customMinutesInput}
                    onChange={(e) => {
                      setCustomMinutesInput(e.target.value);
                      setTargetMinutes(Math.max(1, Math.min(180, Number(e.target.value) || 25)));
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-lg bg-[#090E1A] border border-[#222F4A] text-xs font-mono text-[#F5F7FC]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Central Timer Face */}
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="text-6xl sm:text-7xl font-mono font-bold text-[#F5F7FC] tabular-nums tracking-wider">
              {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
            </div>

            {/* Circular / Line Progress Bar */}
            <div className="w-full max-w-sm h-2.5 rounded-full bg-[#090E1A] overflow-hidden border border-[#222F4A]">
              <div
                className="h-full bg-[#D4FF63] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-[#B4BFD2]">
              {isRunning
                ? 'Em execução • Notificações silenciadas'
                : secondsElapsed > 0
                ? 'Pausado • Clique em Retomar quando pronto'
                : 'Pronto para iniciar'}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                className="px-6 py-3 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#D4FF63]/25 min-h-[48px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{secondsElapsed > 0 ? 'Retomar Sessão' : 'Iniciar Foco'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="px-6 py-3 rounded-xl bg-[#1D2940] hover:bg-[#2C3C5C] text-[#F5F7FC] font-bold text-xs flex items-center gap-2 min-h-[48px]"
              >
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </button>
            )}

            {secondsElapsed > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleStop}
                  className="px-4 py-3 rounded-xl bg-[#1D2940] hover:bg-amber-600/30 text-[#FFD080] font-medium text-xs flex items-center gap-1.5 min-h-[48px]"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Encerrar e Salvar</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-[#1D2940] text-[#B4BFD2] hover:text-[#F5F7FC] min-h-[48px] min-w-[48px] flex items-center justify-center"
                  aria-label="Reiniciar cronômetro"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Break Suggestion Mode */
        <div className="py-8 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-[#65D6A4]/20 text-[#65D6A4] flex items-center justify-center mx-auto border border-[#65D6A4]/40">
            <Coffee className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#F5F7FC]">Bloco de Foco Concluído!</h3>
            <p className="text-xs text-[#B4BFD2] max-w-sm mx-auto">
              Excelente avanço! O cérebro precisa de 5 a 10 minutos longe de estímulos de tela para consolidar o foco.
              Beba água ou alongue o corpo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#D4FF63] text-black font-bold text-xs min-h-[44px]"
            >
              Iniciar Nova Sessão de Foco
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
