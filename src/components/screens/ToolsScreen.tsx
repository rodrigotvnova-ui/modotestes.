import React, { useState } from 'react';
import { TwoMinuteTool } from '../tools/TwoMinuteTool';
import { FocusTimerTool } from '../tools/FocusTimerTool';
import { DetoxTool } from '../tools/DetoxTool';
import { HabitLoopTool } from '../tools/HabitLoopTool';
import { FinancesTool } from '../tools/FinancesTool';
import { SmartGoalsTool } from '../tools/SmartGoalsTool';
import { DiagnosticTool } from '../tools/DiagnosticTool';
import { LibraryTool } from '../tools/LibraryTool';
import {
  Zap,
  Clock,
  Smartphone,
  Repeat,
  DollarSign,
  Target,
  Shield,
  BookOpen,
} from 'lucide-react';

export type ToolSubTab =
  | 'two_minute'
  | 'focus'
  | 'detox'
  | 'habit_loop'
  | 'finances'
  | 'goals'
  | 'diagnostic'
  | 'library';

interface ToolsScreenProps {
  initialSubTab?: ToolSubTab;
  initialFocusTask?: string;
  initialFocusMinutes?: number;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({
  initialSubTab = 'two_minute',
  initialFocusTask = '',
  initialFocusMinutes = 25,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ToolSubTab>(initialSubTab);
  const [passedTask, setPassedTask] = useState<string>(initialFocusTask);

  const toolsList: { id: ToolSubTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'two_minute', label: '2 Minutos', icon: Zap },
    { id: 'focus', label: 'Sessão Foco', icon: Clock },
    { id: 'goals', label: 'Metas SMART', icon: Target },
    { id: 'diagnostic', label: 'Diagnóstico', icon: Shield },
    { id: 'detox', label: 'Detox Digital', icon: Smartphone },
    { id: 'habit_loop', label: 'Ciclo do Hábito', icon: Repeat },
    { id: 'finances', label: 'Finanças', icon: DollarSign },
    { id: 'library', label: 'Biblioteca', icon: BookOpen },
  ];

  const handleOpenFocusWithTask = (task: string) => {
    setPassedTask(task);
    setActiveSubTab('focus');
  };

  return (
    <div className="space-y-6 pb-24 text-[#F5F7FC] animate-fade-in">
      {/* Horizontal Tool Selector Bar */}
      <div className="p-2 rounded-2xl bg-[#141D30] border border-[#222F4A] overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 min-w-max">
          {toolsList.map((t) => {
            const Icon = t.icon;
            const isActive = activeSubTab === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSubTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? 'bg-[#D4FF63] text-black shadow-md shadow-[#D4FF63]/25'
                    : 'bg-[#090E1A] text-[#B4BFD2] hover:text-[#F5F7FC] border border-[#222F4A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Tool */}
      {activeSubTab === 'two_minute' && (
        <TwoMinuteTool onOpenFocusWithTask={handleOpenFocusWithTask} />
      )}
      {activeSubTab === 'focus' && (
        <FocusTimerTool initialTask={passedTask} defaultMinutes={initialFocusMinutes} />
      )}
      {activeSubTab === 'goals' && <SmartGoalsTool />}
      {activeSubTab === 'diagnostic' && <DiagnosticTool />}
      {activeSubTab === 'detox' && <DetoxTool />}
      {activeSubTab === 'habit_loop' && <HabitLoopTool />}
      {activeSubTab === 'finances' && <FinancesTool />}
      {activeSubTab === 'library' && <LibraryTool />}
    </div>
  );
};
