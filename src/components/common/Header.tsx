import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../utils/pwaInstall';
import { PWAInstallButton } from './PWAInstallButton';
import { ShieldCheck, Smartphone, Monitor, CheckCircle2, WifiOff } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSimulatorMode, onToggleSimulator }) => {
  const { profile } = useApp();
  const { isOnline, isOfflineReady } = usePWA();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#090E1A]/95 backdrop-blur-md border-b border-[#222F4A] px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
      {/* Zone 1: Brand wordmark & emblem */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-[#141D30] border border-[#D4FF63]/40 flex items-center justify-center p-1 shrink-0">
          <img
            src="/icon.svg"
            alt="Emblema Modo Avanço"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold tracking-wider text-[#F5F7FC] uppercase truncate">
            MODO AVANÇO
          </span>
          <span className="text-[10px] text-[#B4BFD2] truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
            {profile.name ? `Operador: ${profile.name}` : 'Seu próximo nível começa hoje'}
          </span>
        </div>
      </div>

      {/* Zone 2: Offline status tag */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-[#B4BFD2]">
        {!isOnline ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[#FFD080]">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Sem internet • Modo Local Ativo</span>
          </div>
        ) : isOfflineReady ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#65D6A4]/10 border border-[#65D6A4]/30 text-[#65D6A4]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pronto para usar sem internet</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141D30] text-[#B4BFD2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4FF63]" />
            <span>Sincronizando cache offline...</span>
          </div>
        )}
      </div>

      {/* Zone 3: PWA Install Button & Device Frame Mode Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <PWAInstallButton />

        <button
          type="button"
          onClick={onToggleSimulator}
          title={isSimulatorMode ? 'Mudar para visualização expandida' : 'Mudar para simulador de celular Android'}
          className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#141D30] border border-[#222F4A] hover:border-[#2C3C5C] text-xs text-[#F5F7FC] flex items-center gap-1.5 transition-colors min-h-[36px] sm:min-h-[38px]"
        >
          {isSimulatorMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#D4FF63]" />
              <span className="hidden lg:inline">Modo Expandido</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#D4FF63]" />
              <span className="hidden lg:inline">Simulador Android</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
