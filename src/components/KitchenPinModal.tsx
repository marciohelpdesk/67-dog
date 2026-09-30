import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, AlertTriangle, Delete, Check } from 'lucide-react';

interface KitchenPinModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const DEFAULT_PIN = '6767';

export function KitchenPinModal({ onSuccess, onClose }: KitchenPinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyPress(digit: string) {
    setError(false);
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  }

  function handleDelete() {
    setError(false);
    setPin((prev) => prev.slice(0, -1));
  }

  function verifyPin(inputPin: string) {
    if (inputPin === DEFAULT_PIN) {
      try {
        localStorage.setItem('kds_authorized', 'true');
      } catch {}
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
        inputRef.current?.focus();
      }, 700);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setError(false);
    setPin(val);
    if (val.length === 4) {
      verifyPin(val);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-neutral-950 p-6 text-center text-white shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Lock className="h-7 w-7" />
        </div>

        <h3 className="font-display text-lg font-black text-white">Acesso da Equipe (KDS)</h3>
        <p className="mt-1 text-xs text-muted-foreground px-2">
          Uso restrito da cozinha do <strong>67 DOG</strong>. Digite o PIN de 4 dígitos da equipe:
        </p>

        {/* Hidden or real input for native mobile keyboard */}
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={handleInputChange}
          className="sr-only"
          autoComplete="off"
        />

        {/* PIN Dots (Clicking focuses input) */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="my-5 flex justify-center gap-3 cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-colors"
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  error
                    ? 'border-rose-500 bg-rose-500 animate-shake'
                    : isFilled
                    ? 'border-amber-400 bg-amber-400 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                    : 'border-white/25 bg-white/5'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs font-bold text-rose-400 mb-3 animate-fade-in flex items-center justify-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>PIN incorreto! Acesso negado.</span>
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-bold text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setPin('');
              setError(false);
              inputRef.current?.focus();
            }}
            className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-neutral-400 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            Limpar
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-bold text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-200">
          🔑 <strong>PIN Padrão da Equipe:</strong> <span className="font-mono font-black text-amber-400">6767</span>
        </div>
      </div>
    </div>
  );
}
