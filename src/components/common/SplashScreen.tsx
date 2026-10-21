import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
  isOfflineReady: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss, isOfflineReady }) => {
  const [progress, setProgress] = useState(25);
  const [fadeState, setFadeState] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(70), 300);
    const timer2 = setTimeout(() => setProgress(100), 700);

    const timer3 = setTimeout(() => {
      setFadeState('fading');
    }, 1100);

    const timer4 = setTimeout(() => {
      setFadeState('hidden');
      onDismiss();
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onDismiss]);

  if (fadeState === 'hidden') return null;

  return (
    <div
      aria-label="Tela de Abertura Modo Avanço"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#090E1A] text-[#F5F7FC] transition-opacity duration-300 ${
        fadeState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full flex justify-end pt-safe">
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-[#B4BFD2] hover:text-[#F5F7FC] px-3 py-1.5 rounded-lg bg-[#141D30] border border-[#222F4A]"
        >
          Pular
        </button>
      </div>

      {/* Center Brand Lockup */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-xs">
        {/* Geometric Mark (SVG Icon matching mobile home screen) */}
        <div className="w-24 h-24 rounded-3xl bg-[#141D30] border-2 border-[#D4FF63]/50 shadow-2xl shadow-[#D4FF63]/20 flex items-center justify-center p-3 animate-pulse">
          <img
            src="/icon.svg"
            alt="Emblema Modo Avanço"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-widest text-[#F5F7FC] uppercase">
            MODO AVANÇO
          </h1>
          <p className="text-xs text-[#B4BFD2] font-medium tracking-wide">
            Seu próximo nível começa hoje.
          </p>
        </div>

        {/* Progress Bar & Storage Check */}
        <div className="w-48 space-y-2 pt-4">
          <div className="w-full h-1.5 rounded-full bg-[#141D30] overflow-hidden border border-[#222F4A]">
            <div
              className="h-full bg-gradient-to-r from-[#9275FF] to-[#D4FF63] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C98AF]">
            {isOfflineReady ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-[#65D6A4]" />
                <span className="text-[#65D6A4]">Armazenamento offline pronto</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-[#D4FF63]" />
                <span>Carregando recursos locais...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pb-safe text-center space-y-1">
        <p className="text-[10px] text-[#6E7B94] tracking-wider uppercase">
          100% Offline • Sem Anúncios • Privacidade Total
        </p>
      </div>
    </div>
  );
};
