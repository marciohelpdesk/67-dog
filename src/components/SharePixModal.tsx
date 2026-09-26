import React, { useState } from 'react';
import { ESTABLISHMENT_INFO } from '../data/menuData';

interface SharePixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePixModal: React.FC<SharePixModalProps> = ({ isOpen, onClose }) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(ESTABLISHMENT_INFO.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2200);
  };

  const handleShareLink = async () => {
    const shareData = {
      title: 'Six Seven Dog | Cardápio e Pedidos',
      text: 'Confira o melhor Hot Dog e Pastel crocante no Six Seven Dog!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyLinkFallback();
      }
    } else {
      copyLinkFallback();
    }
  };

  const copyLinkFallback = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

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
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <i className="fa-brands fa-pix text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pagamento &amp; Compartilhar</h3>
              <p className="text-xs text-neutral-400">Facilidade para seu pedido</p>
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

        {/* PIX Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wide flex items-center gap-1.5">
              <i className="fa-brands fa-pix"></i>
              Chave Pix Oficial
            </span>
            <span className="text-[10px] text-neutral-400">Tipo: {ESTABLISHMENT_INFO.pixType}</span>
          </div>

          <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between gap-2">
            <code className="text-xs font-mono text-amber-300 truncate">
              {ESTABLISHMENT_INFO.pixKey}
            </code>
            <button
              onClick={handleCopyPix}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                copiedPix
                  ? 'bg-emerald-500 text-white'
                  : 'bg-teal-500 hover:bg-teal-400 text-neutral-950'
              }`}
            >
              {copiedPix ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          <p className="text-[10px] text-neutral-400 mt-2">
            Favorecido: <span className="text-neutral-200">{ESTABLISHMENT_INFO.pixBeneficiary}</span>
          </p>
        </div>

        {/* Share Bio Link */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-neutral-300">
            Recomende para um amigo faminto:
          </p>
          <button
            onClick={handleShareLink}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-orange-950/40'
            }`}
          >
            <i className={copiedLink ? "fa-solid fa-check" : "fa-solid fa-share-nodes"}></i>
            <span>{copiedLink ? 'Link do Cartão Copiado!' : 'Compartilhar Cartão Digital'}</span>
          </button>
        </div>

        {/* Accepted payment methods */}
        <div className="pt-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-neutral-400 mb-2">Formas de pagamento aceitas:</p>
          <div className="flex items-center justify-center gap-3 text-neutral-300 text-xs">
            <span className="flex items-center gap-1"><i className="fa-brands fa-pix text-teal-400"></i> Pix</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-credit-card text-amber-400"></i> Cartões</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-money-bill-1-wave text-green-400"></i> Dinheiro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
