import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getLocalDateString } from '../../utils/habitCalculations';
import { DollarSign, Plus, Trash2, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

export const FinancesTool: React.FC = () => {
  const { finances, financialPlan, addFinancialItem, deleteFinancialItem, updateFinancialPlan } = useApp();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Moradia e Contas');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [reserveGoalInput, setReserveGoalInput] = useState(String(financialPlan.emergencyReserveGoal));
  const [currentReserveInput, setCurrentReserveInput] = useState(String(financialPlan.currentReserve));

  const currentMonthStr = getLocalDateString().slice(0, 7); // YYYY-MM

  const currentMonthItems = useMemo(() => {
    return finances.filter((f) => f.date.startsWith(currentMonthStr));
  }, [finances, currentMonthStr]);

  const totalIncome = useMemo(() => {
    return currentMonthItems
      .filter((i) => i.type === 'income')
      .reduce((sum, i) => sum + i.amount, 0);
  }, [currentMonthItems]);

  const totalExpense = useMemo(() => {
    return currentMonthItems
      .filter((i) => i.type === 'expense')
      .reduce((sum, i) => sum + i.amount, 0);
  }, [currentMonthItems]);

  const netBalance = totalIncome - totalExpense;

  const reservePercent =
    financialPlan.emergencyReserveGoal > 0
      ? Math.min(100, Math.round((financialPlan.currentReserve / financialPlan.emergencyReserveGoal) * 100))
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addFinancialItem({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date: getLocalDateString(),
    });

    setDescription('');
    setAmount('');
  };

  const handleSaveReserve = () => {
    updateFinancialPlan({
      emergencyReserveGoal: Number(reserveGoalInput) || 0,
      currentReserve: Number(currentReserveInput) || 0,
    });
    setIsEditingGoal(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#65D6A4]/10 border border-[#65D6A4]/30 flex items-center justify-center text-[#65D6A4]">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#F5F7FC]">Organização Financeira Básica</h2>
          <p className="text-xs text-[#B4BFD2]">
            Clareza de entradas, despesas e reserva de emergência sem ruído mental.
          </p>
        </div>
      </div>

      {/* Educational & Non-financial Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#222F4A] text-xs text-[#B4BFD2] leading-relaxed">
        <strong className="text-[#F5F7FC]">Caráter Educativo e Offline:</strong> O aplicativo opera 100% offline, não realiza
        integração bancária, não acessa contas e não recomenda compra de ativos de investimento.
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A]">
          <div className="flex items-center justify-between text-xs text-[#B4BFD2]">
            <span>Receitas do Mês</span>
            <ArrowUpRight className="w-4 h-4 text-[#65D6A4]" />
          </div>
          <p className="text-xl font-bold font-mono text-[#65D6A4] tabular-nums mt-1">
            R$ {totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A]">
          <div className="flex items-center justify-between text-xs text-[#B4BFD2]">
            <span>Despesas do Mês</span>
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xl font-bold font-mono text-red-400 tabular-nums mt-1">
            R$ {totalExpense.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A]">
          <div className="flex items-center justify-between text-xs text-[#B4BFD2]">
            <span>Saldo Líquido</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                netBalance >= 0 ? 'bg-[#65D6A4]/20 text-[#65D6A4]' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {netBalance >= 0 ? 'Positivo' : 'Déficit'}
            </span>
          </div>
          <p
            className={`text-xl font-bold font-mono tabular-nums mt-1 ${
              netBalance >= 0 ? 'text-[#F5F7FC]' : 'text-red-400'
            }`}
          >
            R$ {netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Emergency Reserve Progress Card */}
      <div className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D4FF63]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
              Meta de Reserva de Segurança
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="text-xs text-[#D4FF63] hover:underline"
          >
            {isEditingGoal ? 'Fechar Edição' : 'Ajustar Meta'}
          </button>
        </div>

        {isEditingGoal ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1D2940]">
            <div>
              <label htmlFor="reserve-current-input" className="block text-xs text-[#B4BFD2] mb-1">Valor Atual Guardado (R$):</label>
              <input
                id="reserve-current-input"
                type="number"
                value={currentReserveInput}
                onChange={(e) => setCurrentReserveInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs font-mono text-[#F5F7FC]"
              />
            </div>
            <div>
              <label htmlFor="reserve-goal-input" className="block text-xs text-[#B4BFD2] mb-1">Meta Desejada (R$):</label>
              <input
                id="reserve-goal-input"
                type="number"
                value={reserveGoalInput}
                onChange={(e) => setReserveGoalInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs font-mono text-[#F5F7FC]"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveReserve}
                className="px-4 py-2 rounded-xl bg-[#D4FF63] text-black text-xs font-bold hover:bg-[#BFEC4E]"
              >
                Salvar Meta de Reserva
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono tabular-nums">
              <span className="text-[#B4BFD2]">
                Atual: R$ {financialPlan.currentReserve.toFixed(2)}
              </span>
              <span className="text-[#F5F7FC] font-semibold">
                Objetivo: R$ {financialPlan.emergencyReserveGoal.toFixed(2)} ({reservePercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#141D30] overflow-hidden border border-[#222F4A]">
              <div
                className="h-full bg-[#65D6A4] transition-all duration-500"
                style={{ width: `${reservePercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add New Entry Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Registrar Entrada ou Saída
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <div className="sm:col-span-2">
            <label htmlFor="fin-description-input" className="sr-only">Descrição</label>
            <input
              id="fin-description-input"
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (ex: Salário, Aluguel, Supermercado...)"
              className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div>
            <label htmlFor="fin-amount-input" className="sr-only">Valor em Reais</label>
            <input
              id="fin-amount-input"
              type="text"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor R$ (ex: 150.00)"
              className="w-full px-3 py-2 rounded-xl bg-[#141D30] border border-[#222F4A] text-xs font-mono text-[#F5F7FC] focus:outline-none focus:border-[#D4FF63]"
            />
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                type === 'expense'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-[#141D30] text-[#B4BFD2]'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                type === 'income'
                  ? 'bg-[#65D6A4]/20 text-[#65D6A4] border border-[#65D6A4]/40'
                  : 'bg-[#141D30] text-[#B4BFD2]'
              }`}
            >
              Receita
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <label htmlFor="fin-category-select" className="text-xs text-[#B4BFD2]">Categoria:</label>
            <select
              id="fin-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#141D30] border border-[#222F4A] text-xs text-[#F5F7FC]"
            >
              <option value="Moradia e Contas">Moradia e Contas</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Educação e Livros">Educação e Livros</option>
              <option value="Saúde">Saúde</option>
              <option value="Lazer e Outros">Lazer e Outros</option>
              <option value="Renda Principal">Renda Principal</option>
              <option value="Renda Extra">Renda Extra</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!description.trim() || !amount}
            className="px-4 py-2 rounded-xl bg-[#D4FF63] text-black text-xs font-bold hover:bg-[#BFEC4E] transition-colors disabled:opacity-40"
          >
            Adicionar Registro
          </button>
        </div>
      </form>

      {/* Transaction List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
          Lançamentos do Mês ({currentMonthItems.length})
        </h3>

        {currentMonthItems.length === 0 ? (
          <p className="text-xs text-[#B4BFD2] text-center py-4">Nenhum lançamento no mês atual.</p>
        ) : (
          currentMonthItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <p className="font-semibold text-[#F5F7FC]">{item.description}</p>
                <p className="text-[10px] text-[#8C98AF]">
                  {item.category} • {item.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-mono font-bold tabular-nums ${
                    item.type === 'income' ? 'text-[#65D6A4]' : 'text-red-400'
                  }`}
                >
                  {item.type === 'income' ? '+ ' : '- '}R$ {item.amount.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteFinancialItem(item.id)}
                  className="text-[#B4BFD2] hover:text-red-400 p-1"
                  aria-label="Excluir lançamento"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
