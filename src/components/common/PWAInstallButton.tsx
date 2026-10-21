import React, { useState } from 'react';
import { usePWA } from '../../utils/pwaInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWA();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and opened in standalone mode, suppress button completely
  if (isInstalled) {
    return null;
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      } else {
        // If dismissed or failed, show guidance modal
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] active:scale-95 text-black font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1.5 shadow-md shadow-[#D4FF63]/20 min-h-[36px] sm:min-h-[38px] shrink-0 whitespace-nowrap ${className}`}
        title="Instalar Modo Avanço no seu celular"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
        <span>Instalar App</span>
      </button>

      {installSuccess && (
        <div className="fixed top-16 right-4 z-50 p-3 rounded-xl bg-[#141D30] border border-[#65D6A4] text-[#65D6A4] text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Aplicativo instalado com sucesso!</span>
        </div>
      )}

      {/* Instructional Modal when auto-prompt isn't directly triggered or on iOS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141D30] border border-[#222F4A] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#222F4A] bg-[#0E1524] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#090E1A] border border-[#D4FF63]/40 flex items-center justify-center p-1.5 shrink-0">
                  <img src="/icon.svg" alt="Modo Avanço" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FC]">Instalar Modo Avanço</h3>
                  <p className="text-[11px] text-[#D4FF63] font-medium">Instalação Direta no Celular (PWA)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[#B4BFD2] hover:text-[#F5F7FC] hover:bg-[#1D2940] transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs text-[#E0E6F0] leading-relaxed">
              {isInstallable ? (
                <div className="space-y-3">
                  <p>
                    Seu navegador oferece suporte à instalação direta de aplicativos (PWA).
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await install();
                      if (ok) {
                        setShowModal(false);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#D4FF63] hover:bg-[#BFEC4E] text-black font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirmar Instalação Agora</span>
                  </button>
                </div>
              ) : isIOS ? (
                /* iOS Safari instructions */
                <div className="space-y-3 bg-[#090E1A] p-4 rounded-xl border border-[#222F4A]">
                  <div className="flex items-center gap-2 text-[#F5F7FC] font-bold">
                    <Smartphone className="w-4 h-4 text-[#D4FF63]" />
                    <span>Como instalar no iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="space-y-2.5 list-decimal pl-4 text-[#B4BFD2]">
                    <li>
                      Toque no botão <strong className="text-[#F5F7FC]">Compartilhar</strong> (ícone com quadrado e seta para cima) na barra inferior do Safari.
                    </li>
                    <li>
                      Role a lista de opções para baixo e toque em <strong className="text-[#D4FF63]">Adicionar à Tela de Início</strong> (ícone de mais).
                    </li>
                    <li>
                      Confirme no canto superior direito tocando em <strong className="text-[#F5F7FC]">Adicionar</strong>.
                    </li>
                  </ol>
                  <p className="text-[11px] text-[#8C98AF] pt-1">
                    O ícone oficial do Modo Avanço aparecerá diretamente na tela inicial do seu iPhone.
                  </p>
                </div>
              ) : (
                /* Android Chrome / Edge / Desktop */
                <div className="space-y-3 bg-[#090E1A] p-4 rounded-xl border border-[#222F4A]">
                  <div className="flex items-center gap-2 text-[#F5F7FC] font-bold">
                    <Smartphone className="w-4 h-4 text-[#D4FF63]" />
                    <span>Como instalar no Android (Chrome / Navegadores)</span>
                  </div>
                  <ol className="space-y-2.5 list-decimal pl-4 text-[#B4BFD2]">
                    <li>
                      Abra o menu do navegador (toque nos <strong className="text-[#F5F7FC]">três pontos verticais ⋮</strong> no canto superior direito).
                    </li>
                    <li>
                      Selecione <strong className="text-[#D4FF63]">Instalar aplicativo</strong> ou <strong className="text-[#D4FF63]">Adicionar à tela inicial</strong>.
                    </li>
                    <li>
                      Confirme a instalação. O aplicativo será instalado sem necessidade de download externo.
                    </li>
                  </ol>
                </div>
              )}

              {/* Status Note on Google Play */}
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#B4BFD2]">
                  <Info className="w-3.5 h-3.5 text-[#9275FF]" />
                  <strong className="text-[#F5F7FC]">Esclarecimento Técnico:</strong>
                </div>
                <p className="text-[#8C98AF]">
                  A instalação como PWA (Progressive Web App) instala o aplicativo nativamente na tela do seu celular com funcionamento 100% offline, mas <em>não substitui</em> a futura submissão formal de release nativa (AAB) na Google Play Console.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0E1524] border-t border-[#222F4A] flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1D2940] hover:bg-[#2C3C5C] text-[#F5F7FC] text-xs font-semibold"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
