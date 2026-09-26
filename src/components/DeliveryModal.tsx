import React from 'react';
import { ESTABLISHMENT_INFO } from '../data/menuData';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMenu: () => void;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isOpen,
  onClose,
  onOpenMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm glass-card rounded-3xl p-6 text-white border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <i className="fa-solid fa-motorcycle text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Como Deseja Pedir?</h3>
              <p className="text-xs text-neutral-400">Entrega rápida ou Retirada</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {/* Option 1: WhatsApp Direct (Recommended) */}
          <a
            href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=Ol%C3%A1!%20Vim%20pelo%20Bio%20Link%20e%20quero%20fazer%20um%20pedido%20no%20Six%20Seven%20Dog!`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600/90 to-green-600/90 hover:from-emerald-500 hover:to-green-500 border border-emerald-400/40 block transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-950/40 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">WhatsApp Direto</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">Recomendado</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90">Sem taxas de app · Atendimento humanizado</p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-white/70 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </a>

          {/* Option 2: Full Menu Cart inside the App */}
          <button
            onClick={() => {
              onClose();
              onOpenMenu();
            }}
            className="w-full text-left p-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <div>
                  <span className="font-bold text-sm text-white">Montar Pedido no Cardápio</span>
                  <p className="text-[11px] text-neutral-300">Escolha os itens e envie a comanda pronta</p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-amber-400 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </button>

          {/* Option 3: iFood */}
          <a
            href={ESTABLISHMENT_INFO.ifoodUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 block transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-lg font-black">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <div>
                  <span className="font-bold text-sm text-white">iFood Delivery</span>
                  <p className="text-[11px] text-neutral-300">Cupom de entrega e rastreamento em mapa</p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-red-400 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </a>
        </div>

        {/* Security badge */}
        <div className="text-center pt-2 border-t border-white/5 text-[11px] text-neutral-400 flex items-center justify-center gap-2">
          <i className="fa-solid fa-shield-halved text-amber-400"></i>
          <span>Entrega rápida em embalagem térmica lacrada</span>
        </div>
      </div>
    </div>
  );
};
