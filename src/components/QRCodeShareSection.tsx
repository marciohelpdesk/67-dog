import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeShareSectionProps {
  className?: string;
}

export const QRCodeShareSection: React.FC<QRCodeShareSectionProps> = ({ className = '' }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Determine card URL safely
    const url = typeof window !== 'undefined' ? window.location.href : 'https://67dog.com.br';
    setCurrentUrl(url);

    // Generate QR Code with warm theme palette and high scan contrast
    QRCode.toDataURL(url, {
      width: 260,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1c0a02', // Deep warm espresso matching the 67 Dog dark palette
        light: '#fffdf5', // Warm artisanal cream for crisp optical contrast
      },
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate QR Code', err);
        setIsGenerating(false);
      });
  }, []);

  const handleCopyLink = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleNativeShare = async () => {
    if (!currentUrl) return;

    const shareData = {
      title: '67 Dog | Cardápio & Bio Link',
      text: 'Confira o cardápio de Hot Dogs Artesanais e Pastéis Crocantes do 67 Dog!',
      url: currentUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User dismissed or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode-67-dog-cardapio.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section 
      aria-label="Compartilhar Cardápio Digital via QR Code"
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/40 backdrop-blur-md border border-amber-500/25 shadow-xl shadow-black/50 ${className}`}
    >
      {/* Ambient warm cheese/caramel gradient glow in background */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-orange-600/10 blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
          <i className="fa-solid fa-qrcode text-sm"></i>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
            <span>Compartilhar Cardápio</span>
            <span className="text-[10px] text-amber-400 font-semibold lowercase">· qr code</span>
          </h3>
          <p className="text-[11px] text-neutral-300 leading-snug">
            Aponte a câmera para abrir ou envie aos amigos
          </p>
        </div>
      </div>

      {/* QR Code Presentation Box */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        <div className="relative group p-2.5 bg-gradient-to-b from-amber-100 via-[#fffdf5] to-amber-200 rounded-2xl shadow-lg shadow-black/60 border border-amber-300/40 shrink-0">
          {isGenerating ? (
            <div className="w-36 h-36 flex items-center justify-center">
              <i className="fa-solid fa-spinner fa-spin text-amber-700 text-xl"></i>
            </div>
          ) : qrDataUrl ? (
            <div className="relative">
              <img 
                src={qrDataUrl} 
                alt="QR Code para acesso direto ao Cardápio 67 Dog"
                className="w-36 h-36 rounded-xl object-contain block transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {/* Center hotdog emblem badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-[#1c0a02] border-2 border-amber-400 shadow-md flex items-center justify-center text-amber-300 text-xs">
                  <i className="fa-solid fa-hotdog"></i>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-36 h-36 flex items-center justify-center text-xs text-amber-900">
              Não foi possível gerar
            </div>
          )}
        </div>

        {/* Action Controls & URL snippet */}
        <div className="flex-1 w-full flex flex-col justify-center gap-2">
          {/* URL bar with quick click-to-copy */}
          <div 
            onClick={handleCopyLink}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCopyLink()}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group"
            title="Clique para copiar o link"
          >
            <div className="flex items-center gap-2 min-w-0">
              <i className="fa-solid fa-link text-[11px] text-amber-400 shrink-0"></i>
              <span className="text-[11px] font-mono text-neutral-300 truncate">
                {currentUrl || 'carregando link...'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider shrink-0 transition-transform group-hover:scale-105">
              {copied ? 'Copiado! ✓' : 'Copiar'}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {/* Primary Share / WhatsApp */}
            <button
              onClick={handleNativeShare}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/60 border border-amber-200/40 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-share-nodes text-xs"></i>
              <span>Compartilhar</span>
            </button>

            {/* Download QR PNG */}
            <button
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 hover:border-amber-400/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <i className="fa-solid fa-download text-xs text-amber-400"></i>
              <span>Baixar QR</span>
            </button>
          </div>
          
          <p className="text-[10px] text-neutral-400 text-center sm:text-left mt-0.5">
            Ideal para imprimir em mesas ou enviar por mensagem.
          </p>
        </div>
      </div>
    </section>
  );
};
