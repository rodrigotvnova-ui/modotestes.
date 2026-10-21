import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundController } from '../../utils/audioFeedback';
import { Play, Pause, RotateCcw, CheckCircle2, ArrowRight, Zap, AlertCircle } from 'lucide-react';

interface TwoMinuteToolProps {
  onOpenFocusWithTask?: (task: string) => void;
}

export const TwoMinuteTool: React.FC<TwoMinuteToolProps> = ({ onOpenFocusWithTask }) => {
  const { recordTwoMinuteSession } = useApp();

  const [task, setTask] = useState('');
  const [microAction, setMicroAction] = useState('');
  const [enableCountdown, setEnableCountdown] = useState(true);
  const [stage, setStage] = useState<'setup' | 'countdown' | 'running' | 'completed' | 'difficulty'>('setup');

  const [countdownNum, setCountdownNum] = useState(5);
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [difficultyText, setDifficultyText] = useState('');

  // 5-second countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'countdown') {
      if (countdownNum > 0) {
        soundController.playTick(400 + countdownNum * 50);
        timer = setTimeout(() => setCountdownNum((c) => c - 1), 1000);
      } else {
        soundController.playTick(880);
        setStage('running');
        setIsRunning(true);
      }
    }
    return () => clearTimeout(timer);
  }, [stage, countdownNum]);

  // 2-minute timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'running' && isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setStage('completed');
            soundController.playCompletionChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, isRunning]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || !microAction.trim()) return;

    if (enableCountdown) {
      setCountdownNum(5);
      setStage('countdown');
    } else {
      setSecondsRemaining(120);
      setStage('running');
      setIsRunning(true);
    }
  };

  const handleFinishEarly = (continueWorking: boolean) => {
    recordTwoMinuteSession({
      task,
      microAction,
      completed: true,
      continuedWork: continueWorking,
    });
    soundController.playCompletionChime();

    if (continueWorking && onOpenFocusWithTask) {
      onOpenFocusWithTask(task);
    } else {
      setStage('completed');
    }
  };

  const handleSaveDifficulty = () => {
    recordTwoMinuteSession({
      task,
      microAction,
      completed: false,
      continuedWork: false,
      difficultyLogged: difficultyText.trim(),
    });
    setStage('setup');
    setTask('');
    setMicroAction('');
    setDifficultyText('');
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(120);
    setStage('setup');
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((120 - secondsRemaining) / 120) * 100;

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D4FF63]/10 border border-[#D4FF63]/30 flex items-center justify-center text-[#D4FF63]">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#F5F7FC]">Começar por 2 Minutos</h2>
          <p className="text-xs text-[#B4BFD2]">
            Quebre o atrito inicial da procrastinação com uma micro-ação inegociável.
          </p>
        </div>
      </div>

      {stage === 'setup' && (
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label htmlFor="task-name-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
              Qual tarefa importante você está adiando? *
            </label>
            <input
              id="task-name-input"
              type="text"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Ex: Escrever proposta técnica, revisar documento, estudar..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="micro-action-input" className="block text-xs font-medium text-[#B4BFD2] mb-1">
              Qual a menor micro-ação possível para iniciar agora em 2 minutos? *
            </label>
            <input
              id="micro-action-input"
              type="text"
              required
              value={microAction}
              onChange={(e) => setMicroAction(e.target.value)}
              placeholder="Ex: Abrir o arquivo e redigir o primeiro parágrafo..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090E1A] border border-[#222F4A]">
            <div>
              <p className="text-xs font-medium text-[#F5F7FC]">Regra dos 5 Segundos</p>
              <p className="text-[11px] text-[#B4BFD2]">Contagem 5-4-3-2-1 antes de dar o primeiro passo.</p>
            </div>
            <button
              type="button"
              onClick={() => setEnableCountdown(!enableCountdown)}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                enableCountdown ? 'bg-[#D4FF63]' : 'bg-[#222F4A]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  enableCountdown ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={!task.trim() || !microAction.trim()}
            className="w-full py-3 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#D4FF63]/20 disabled:opacity-40 min-h-[48px]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Desafio dos 2 Minutos</span>
          </button>
        </form>
      )}

      {stage === 'countdown' && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-xs uppercase tracking-widest text-[#D4FF63] font-semibold">
            Prepare-se para agir
          </p>
          <div className="w-24 h-24 rounded-full bg-[#090E1A] border-2 border-[#D4FF63] flex items-center justify-center text-4xl font-bold font-mono text-[#F5F7FC] animate-pulse">
            {countdownNum}
          </div>
          <p className="text-xs text-[#B4BFD2] max-w-xs">
            “5... 4... 3... 2... 1... Mova-se antes que seu cérebro crie uma desculpa.”
          </p>
        </div>
      )}

      {stage === 'running' && (
        <div className="py-6 space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[11px] text-[#D4FF63] uppercase tracking-wider font-semibold">
              Foco exclusivo na micro-ação:
            </span>
            <h3 className="text-base font-bold text-[#F5F7FC]">{microAction}</h3>
            <p className="text-xs text-[#B4BFD2]">Tarefa maior: {task}</p>
          </div>

          {/* Big Digital Timer Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-mono font-bold text-[#F5F7FC] tabular-nums tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="w-full max-w-xs h-2 rounded-full bg-[#090E1A] overflow-hidden mt-4 border border-[#222F4A]">
              <div
                className="h-full bg-[#D4FF63] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-2.5 rounded-xl bg-[#1D2940] hover:bg-[#2C3C5C] text-xs font-semibold text-[#F5F7FC] flex items-center gap-1.5 min-h-[44px]"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pausar' : 'Retomar'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleFinishEarly(false)}
              className="px-4 py-2.5 rounded-xl bg-[#65D6A4] hover:bg-[#52c191] text-black text-xs font-bold flex items-center gap-1.5 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Micro-Ação</span>
            </button>

            <button
              type="button"
              onClick={() => handleFinishEarly(true)}
              className="px-4 py-2.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black text-xs font-bold flex items-center gap-1.5 min-h-[44px]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Embalou? Ir para Foco</span>
            </button>

            <button
              type="button"
              onClick={() => setStage('difficulty')}
              className="px-3 py-2 text-xs text-[#B4BFD2] hover:text-[#FFD080] min-h-[44px] flex items-center justify-center"
            >
              Travei / Tive dificuldade
            </button>
          </div>
        </div>
      )}

      {stage === 'completed' && (
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#65D6A4]/20 text-[#65D6A4] flex items-center justify-center mx-auto border border-[#65D6A4]/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#F5F7FC]">Atrito Rompido com Sucesso!</h3>
            <p className="text-xs text-[#B4BFD2] max-w-sm mx-auto">
              Você superou o momento mais difícil de qualquer projeto: o início. Deseja continuar trabalhando nessa
              tarefa em um bloco de foco imersivo?
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-[#1D2940] text-xs font-medium text-[#F5F7FC] min-h-[44px]"
            >
              Finalizar por Agora
            </button>
            {onOpenFocusWithTask && (
              <button
                type="button"
                onClick={() => onOpenFocusWithTask(task)}
                className="px-5 py-2.5 rounded-xl bg-[#D4FF63] text-black text-xs font-bold flex items-center gap-1.5 min-h-[44px]"
              >
                <span>Iniciar Bloco de 25 min</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {stage === 'difficulty' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#FFD080]">
            <AlertCircle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Registrar Dificuldade de Início</h3>
          </div>
          <p className="text-xs text-[#B4BFD2]">
            Sem culpa nem julgamentos. O que especificamente gerou bloqueio? A tarefa estava muito vaga ou o cansaço
            está alto?
          </p>
          <textarea
            rows={3}
            value={difficultyText}
            onChange={(e) => setDifficultyText(e.target.value)}
            placeholder="Ex: A tarefa ainda parece confusa, preciso pesquisar primeiro..."
            className="w-full p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setStage('running')}
              className="px-4 py-2 text-xs font-medium text-[#B4BFD2]"
            >
              Voltar ao Timer
            </button>
            <button
              type="button"
              onClick={handleSaveDifficulty}
              className="px-4 py-2 rounded-xl bg-[#1D2940] hover:bg-[#2C3C5C] text-xs font-semibold text-[#F5F7FC]"
            >
              Salvar Registro e Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
