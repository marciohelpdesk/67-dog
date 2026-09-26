import React, { useState } from 'react';
import { STANDALONE_HTML_CODE } from '../data/standaloneHtmlCode';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(STANDALONE_HTML_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cartao_digital_six_seven_dog.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] glass-card rounded-3xl p-5 text-white border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-code text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Código HTML Único (Single File)</h3>
              <p className="text-xs text-neutral-400">HTML5 + CSS3 + JS Básico prontos para hospedagem</p>
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

        {/* Action bar */}
        <div className="py-3 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-neutral-300">
            Arquivo 100% autônomo, sem dependências de build.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-black'
              }`}
            >
              <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
              <span>{copied ? 'Código Copiado!' : 'Copiar Código'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-colors"
            >
              <i className="fa-solid fa-download"></i>
              <span>Baixar .HTML</span>
            </button>
          </div>
        </div>

        {/* Code preview block */}
        <div className="flex-1 overflow-auto bg-neutral-950/80 rounded-2xl p-4 border border-white/10 font-mono text-[11px] leading-relaxed text-neutral-300 select-all">
          <pre>{STANDALONE_HTML_CODE}</pre>
        </div>
      </div>
    </div>
  );
};
