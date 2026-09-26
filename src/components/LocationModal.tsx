import React, { useState } from 'react';
import { ESTABLISHMENT_INFO } from '../data/menuData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ESTABLISHMENT_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
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
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-map-location-dot text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Como Chegar</h3>
              <p className="text-xs text-neutral-400">Ponto Fixo &amp; Food Park</p>
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

        {/* Map Preview Graphic */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-white/15 bg-neutral-900 flex items-center justify-center">
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(255,159,28,0.25) 0, rgba(0,0,0,0.85) 100%), linear-gradient(135deg, #1f2937 0%, #111827 100%)`
            }}
          />
          {/* Grid lines simulating map */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Animated Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-amber-400/40"></span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/50 border-2 border-white">
                <i className="fa-solid fa-hotdog text-white text-base"></i>
              </div>
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-amber-500/40 text-[10px] font-semibold text-amber-300">
              Six Seven Dog Truck
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <p className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
            Endereço Completo:
          </p>
          <p className="text-xs text-neutral-200 leading-relaxed font-medium">
            {ESTABLISHMENT_INFO.address}
          </p>
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span>✨ Estacionamento no local</span>
            <span>🐕 Pet Friendly</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <a
            href={ESTABLISHMENT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <i className="fa-brands fa-google text-blue-400"></i>
            <span>Google Maps</span>
          </a>
          <a
            href={ESTABLISHMENT_INFO.wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <i className="fa-brands fa-waze text-cyan-400"></i>
            <span>Abrir no Waze</span>
          </a>
        </div>

        {/* Copy Address Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            copied
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
          }`}
        >
          <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
          <span>{copied ? 'Endereço Copiado!' : 'Copiar Endereço'}</span>
        </button>
      </div>
    </div>
  );
};
