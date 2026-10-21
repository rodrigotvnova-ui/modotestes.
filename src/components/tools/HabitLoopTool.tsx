import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Repeat, Plus, Trash2 } from 'lucide-react';

export const HabitLoopTool: React.FC = () => {
  const { habitLoops, addHabitLoop, deleteHabitLoop } = useApp();

  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [perceivedReward, setPerceivedReward] = useState('');
  const [alternativeBehavior, setAlternativeBehavior] = useState('');
  const [effective, setEffective] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !trigger.trim() || !alternativeBehavior.trim()) return;

    addHabitLoop({
      title: title.trim(),
      trigger: trigger.trim(),
      currentBehavior: currentBehavior.trim(),
      perceivedReward: perceivedReward.trim(),
      alternativeBehavior: alternativeBehavior.trim(),
      effective,
      notes: '',
    });

    setTitle('');
    setTrigger('');
    setCurrentBehavior('');
    setPerceivedReward('');
    setAlternativeBehavior('');
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#9275FF]/10 border border-[#9275FF]/30 flex items-center justify-center text-[#9275FF]">
          <Repeat className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#F5F7FC]">Ciclo do Hábito (Anatomia Comportamental)</h2>
          <p className="text-xs text-[#B4BFD2]">
            Mantenha o gatilho e a recompensa, substitua a rotina intermediária por uma ação deliberada.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Mapear Novo Ciclo de Substituição
        </h3>

        <div>
          <label htmlFor="habit-loop-title" className="block text-xs text-[#B4BFD2] mb-1">
            Nome do Ciclo / Hábito a Transformar *
          </label>
          <input
            id="habit-loop-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Checar Instagram no meio do trabalho..."
            className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="habit-loop-trigger" className="block text-xs text-[#B4BFD2] mb-1">
              1. Gatilho / Deixa * (O que dispara?)
            </label>
            <input
              id="habit-loop-trigger"
              type="text"
              required
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="Ex: Tédio entre tarefas, cansaço às 15h..."
              className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="habit-loop-current-behavior" className="block text-xs text-[#B4BFD2] mb-1">
              2. Comportamento Atual (Rotina indesejada)
            </label>
            <input
              id="habit-loop-current-behavior"
              type="text"
              value={currentBehavior}
              onChange={(e) => setCurrentBehavior(e.target.value)}
              placeholder="Ex: Abrir feeds e passar 20 minutos rolando..."
              className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="habit-loop-perceived-reward" className="block text-xs text-[#B4BFD2] mb-1">
              3. Recompensa Percebida (O que você busca?)
            </label>
            <input
              id="habit-loop-perceived-reward"
              type="text"
              value={perceivedReward}
              onChange={(e) => setPerceivedReward(e.target.value)}
              placeholder="Ex: Alívio de estresse imediato, pausa mental..."
              className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="habit-loop-alt-behavior" className="block text-xs text-[#D4FF63] font-semibold mb-1">
              4. Comportamento Alternativo Construtivo *
            </label>
            <input
              id="habit-loop-alt-behavior"
              type="text"
              required
              value={alternativeBehavior}
              onChange={(e) => setAlternativeBehavior(e.target.value)}
              placeholder="Ex: Beber 1 copo de água gelada e respirar 1 min..."
              className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#D4FF63]/40 text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !trigger.trim() || !alternativeBehavior.trim()}
          className="w-full py-2.5 rounded-xl bg-[#9275FF] hover:bg-[#7E5EFF] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Ciclo de Substituição</span>
        </button>
      </form>

      {/* List of Registered Loops */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Ciclos Cadastrados ({habitLoops.length})
        </h3>

        {habitLoops.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#090E1A] border border-dashed border-[#222F4A] text-center text-xs text-[#B4BFD2]">
            Nenhum ciclo cadastrado ainda. Use o formulário acima para desconstruir um gatilho frequente.
          </div>
        ) : (
          habitLoops.map((loop) => (
            <article
              key={loop.id}
              className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#F5F7FC]">{loop.title}</h4>
                <button
                  type="button"
                  onClick={() => deleteHabitLoop(loop.id)}
                  className="text-[#B4BFD2] hover:text-red-400 p-1"
                  aria-label="Excluir ciclo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                  <span className="text-[10px] text-[#D4FF63] uppercase font-bold block">Gatilho:</span>
                  <span className="text-[#E0E6F0]">{loop.trigger}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#222F4A]">
                  <span className="text-[10px] text-red-400 uppercase font-bold block">Antes:</span>
                  <span className="text-[#E0E6F0] line-through">{loop.currentBehavior}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141D30] border border-[#D4FF63]/40">
                  <span className="text-[10px] text-[#D4FF63] uppercase font-bold block">Substituto:</span>
                  <span className="text-[#F5F7FC] font-semibold">{loop.alternativeBehavior}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
