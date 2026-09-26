import React from 'react';
import { ESTABLISHMENT_INFO } from '../data/menuData';

interface HoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HoursModal: React.FC<HoursModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 Monday, etc.
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTimeVal = hours + minutes / 60;

  // Schedule logic:
  // Mon (1): Closed
  // Tue (2) - Thu (4): 18:00 - 23:30 (18 to 23.5)
  // Fri (5) - Sat (6): 18:00 - 01:00 (18 to 25 / 1am)
  // Sun (0): 18:00 - 23:30 (18 to 23.5)
  let isOpenNow = false;
  if (dayOfWeek === 1) {
    isOpenNow = false;
  } else if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    isOpenNow = currentTimeVal >= 18 && currentTimeVal <= 23.5;
  } else if (dayOfWeek === 5 || dayOfWeek === 6) {
    isOpenNow = currentTimeVal >= 18 || currentTimeVal <= 1.0;
  } else if (dayOfWeek === 0) {
    isOpenNow = currentTimeVal >= 18 && currentTimeVal <= 23.5;
  }

  const daysMap = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  const todayName = daysMap[dayOfWeek];

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
              <i className="fa-solid fa-clock text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Horários de Atendimento</h3>
              <p className="text-xs text-neutral-400">Delivery &amp; Presencial</p>
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

        {/* Live Status Banner */}
        <div className={`p-3.5 rounded-2xl mb-4 border flex items-center justify-between ${
          isOpenNow 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOpenNow ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isOpenNow ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="text-xs font-semibold">
              {isOpenNow ? 'Aberto Agora! Aceitando Pedidos' : 'Fechado no Momento'}
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80">
            Hoje ({todayName.split('-')[0]})
          </span>
        </div>

        {/* Schedule List */}
        <div className="space-y-2 mb-6">
          {ESTABLISHMENT_INFO.hours.map((item, idx) => {
            const isToday = item.day === todayName;
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                  isToday 
                    ? 'bg-amber-500/15 border border-amber-500/40 font-semibold text-white' 
                    : 'bg-white/5 border border-white/5 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isToday && <i className="fa-solid fa-chevron-right text-[10px] text-amber-400"></i>}
                  <span>{item.day}</span>
                </div>
                <span className={item.open ? 'text-amber-300/90' : 'text-neutral-500 italic'}>
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <a
          href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20se%20j%C3%A1%20est%C3%A3o%20aceitando%20pedidos!`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-transform active:scale-[0.98]"
        >
          <i className="fa-brands fa-whatsapp text-lg"></i>
          <span>Falar no WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
