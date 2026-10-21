import React from 'react';
import { CalendarCheck2, Compass, CheckSquare2, Wrench, User } from 'lucide-react';

export type NavTab = 'today' | 'journey' | 'habits' | 'tools' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: 'Hoje', icon: CalendarCheck2 },
    { id: 'journey', label: 'Jornada', icon: Compass },
    { id: 'habits', label: 'Hábitos', icon: CheckSquare2 },
    { id: 'tools', label: 'Ferramentas', icon: Wrench },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#141D30]/95 backdrop-blur-md border-t border-[#222F4A] pb-safe"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] w-full transition-all relative ${
                isActive ? 'text-[#D4FF63]' : 'text-[#B4BFD2] hover:text-[#F5F7FC]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#D4FF63] rounded-b-full shadow-sm shadow-[#D4FF63]/50" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
