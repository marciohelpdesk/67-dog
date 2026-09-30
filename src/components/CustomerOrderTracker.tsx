import React, { useState, useEffect } from 'react';
import { Order, ORDER_STATUS_CONFIG } from '../types/order';
import { orderService } from '../services/orderService';
import { audioAlert } from '../utils/audioAlert';
import { ESTABLISHMENT_INFO } from '../data/menuData';
import {
  Clock3,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  MessageCircle,
  Flame,
  Timer,
  Check,
  Sparkles,
} from 'lucide-react';

interface CustomerOrderTrackerProps {
  orderId: string;
  onClose?: () => void;
}

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function CustomerOrderTracker({ orderId, onClose }: CustomerOrderTrackerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    orderService
      .getOrderById(orderId)
      .then((ord) => {
        setOrder(ord);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load order:', err);
        setLoading(false);
      });

    // Subscribe to live WebSocket events
    const unsubscribe = orderService.subscribe((event) => {
      if (event.type === 'order:status_updated' && event.order?.id === orderId) {
        if (event.order.status === 'ready') {
          audioAlert.playNewOrderChime();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([300, 150, 300, 150, 400]);
            } catch {}
          }
        }
        setOrder(event.order);
      } else if (event.type === 'init' && event.orders) {
        const found = event.orders.find((o) => o.id === orderId);
        if (found) setOrder(found);
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  if (loading && !order) {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-white/20 bg-neutral-950/95 p-4 text-center text-white shadow-2xl backdrop-blur-xl animate-fade-in">
        <p className="text-xs text-muted-foreground animate-pulse">Carregando status do seu pedido...</p>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.received;

  const steps = [
    { key: 'awaiting_confirmation', label: 'Pix Enviado', icon: '⏳' },
    { key: 'received', label: 'Pagamento Recebido', icon: '✅' },
    { key: 'preparing', label: 'Iniciando Preparo', icon: '👨‍🍳' },
    { key: 'ready', label: 'Pronto!', icon: '🔔' },
    { key: 'delivered', label: 'Entregue', icon: '🎉' },
  ];

  const currentStepIndex = statusConfig.stepIndex;

  // Minimized floating pill
  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-neutral-950/95 p-3.5 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-[1.02] cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-lg border border-amber-500/30">
            {statusConfig.emoji}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-display text-xs font-black text-amber-300">
                Pedido {order.code}
              </p>
              {order.status === 'received' && (
                <span className="rounded bg-blue-500/25 px-1.5 py-0.2 text-[9px] font-black text-blue-300 border border-blue-500/40">
                  Pagamento Recebido
                </span>
              )}
              {order.status === 'preparing' && (
                <>
                  <span className="rounded bg-orange-500/25 px-1.5 py-0.2 text-[9px] font-black text-orange-300 border border-orange-500/40">
                    Iniciando Preparo
                  </span>
                  <span className="rounded bg-amber-400/25 px-1.5 py-0.2 text-[9px] font-black text-amber-200 border border-amber-400/50">
                    Pronto em 5-10 min
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{statusConfig.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-amber-400">
          <span>Ver</span>
          <ChevronUp className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-neutral-950/95 p-5 text-foreground shadow-2xl backdrop-blur-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-flame to-amber-500 text-white shadow-md">
              <span className="font-display text-base font-black">{order.code}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-black text-white">Status do Pedido</h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 animate-pulse">
                  ● Ao Vivo
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cliente: <strong className="text-white">{order.customerName}</strong>
              </p>

              {/* Granular badges in header */}
              <div className="mt-1 flex flex-wrap gap-1.5">
                {order.status === 'awaiting_confirmation' && (
                  <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-black text-amber-300 border border-amber-500/40">
                    ⏳ Aguardando Comprovante
                  </span>
                )}
                {order.status === 'received' && (
                  <>
                    <span className="rounded-full bg-blue-500/25 px-2 py-0.5 text-[10px] font-black text-blue-300 border border-blue-500/40">
                      ✓ Pagamento Recebido
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-neutral-300 border border-white/15">
                      Na Fila de Produção
                    </span>
                  </>
                )}
                {order.status === 'preparing' && (
                  <>
                    <span className="rounded-full bg-orange-500/25 px-2 py-0.5 text-[10px] font-black text-orange-300 border border-orange-500/40">
                      👨‍🍳 Iniciando Preparo
                    </span>
                    <span className="rounded-full bg-amber-400/25 px-2 py-0.5 text-[10px] font-black text-amber-200 border border-amber-400/50 animate-pulse">
                      ⏱️ Pronto em 5-10 min
                    </span>
                  </>
                )}
                {order.status === 'ready' && (
                  <span className="rounded-full bg-emerald-500/25 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/50 animate-bounce">
                    🔔 Pronto no Balcão!
                  </span>
                )}
                {order.status === 'delivered' && (
                  <span className="rounded-full bg-purple-500/25 px-2 py-0.5 text-[10px] font-black text-purple-300 border border-purple-500/40">
                    🎉 Entregue
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              title="Minimizar"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content scrollable */}
        <div className="mt-4 overflow-y-auto space-y-4 pr-1">
          {/* Main Status Hero Card */}
          <div
            className={`rounded-2xl border ${statusConfig.borderColor} ${statusConfig.bgColor} p-4 text-center backdrop-blur-xl`}
          >
            {/* Granular prominent status badge pill */}
            {order.status === 'received' && (
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-300 border border-blue-500/40 shadow-sm">
                <Check className="h-3.5 w-3.5 text-blue-400" />
                <span>Pagamento Recebido</span>
              </div>
            )}

            {order.status === 'preparing' && (
              <div className="mb-2.5 flex flex-wrap items-center justify-center gap-1.5">
                <span className="rounded-full bg-orange-500/25 px-3 py-1 text-xs font-black text-orange-300 border border-orange-500/40 shadow-sm">
                  👨‍🍳 Iniciando Preparo
                </span>
                <span className="rounded-full bg-amber-400/25 px-3 py-1 text-xs font-black text-amber-200 border border-amber-400/50 animate-pulse shadow-sm">
                  ⏱️ Pronto em 5-10 min
                </span>
              </div>
            )}

            <span className="text-4xl block mb-2">{statusConfig.emoji}</span>
            <h4 className={`font-display text-lg font-black ${statusConfig.color}`}>
              {statusConfig.label}
            </h4>
            <p className="mt-1 text-xs text-neutral-300 max-w-xs mx-auto">
              {statusConfig.description}
            </p>

            {/* PREVISÃO DE 5 A 10 MINUTOS (QUANDO ESTÁ PREPARANDO) */}
            {order.status === 'preparing' && (
              <div className="mt-3.5 rounded-2xl bg-orange-500/20 border border-orange-500/40 p-3.5 text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="h-5 w-5 text-orange-400 animate-bounce" />
                  <span className="font-display text-sm font-black text-white">
                    LANCHE NA CHAPA QUENTE!
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 text-xs font-black text-amber-300 animate-pulse">
                    ⏱️ Pronto em 5-10 min
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-neutral-300">
                  A equipe do 67 DOG já está prensando e preparando seu pedido.
                </p>
                <div className="mt-2.5 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse w-3/4 rounded-full" />
                </div>
              </div>
            )}

            {/* AVISO QUANDO AGUARDA CONFIRMAÇÃO DO PIX */}
            {order.status === 'awaiting_confirmation' && (
              <div className="mt-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 p-3 text-center">
                <p className="text-xs text-amber-200">
                  Enviou o comprovante no WhatsApp? A equipe do 67 DOG está conferindo e confirmará seu pedido em instantes.
                </p>
                <a
                  href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${encodeURIComponent(
                    `Olá! Segue o comprovante do pedido ${order.code} de ${order.customerName}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Enviar Comprovante</span>
                </a>
              </div>
            )}

            {/* QUANDO CONFIRMADO */}
            {order.status === 'received' && (
              <div className="mt-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 p-3 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Pagamento Recebido e Validado!</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Seu lanche já está organizado na fila e o preparo será iniciado a qualquer momento.
                </p>
              </div>
            )}

            {/* QUANDO PRONTO */}
            {order.status === 'ready' && (
              <div className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-black px-4 py-2.5 font-display text-xs font-black shadow-lg animate-bounce">
                <span>🏃 PODE RETIRAR NO BALCÃO AGORA!</span>
              </div>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Progresso do seu Pedido
            </p>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-white/10 -z-0">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, (currentStepIndex / (steps.length - 1)) * 100))}%`,
                  }}
                />
              </div>

              {/* Step dots */}
              <div className="flex justify-between relative z-10">
                {steps.map((st, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center max-w-[65px]">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-md ${
                          isDone
                            ? 'bg-emerald-500 text-black'
                            : isCurrent
                            ? 'bg-amber-400 text-black ring-4 ring-amber-400/30 animate-pulse scale-110'
                            : 'bg-neutral-800 text-neutral-400 border border-white/15'
                        }`}
                      >
                        {isDone ? '✓' : st.icon}
                      </div>
                      <span
                        className={`mt-2 text-[10px] font-bold leading-tight ${
                          isCurrent
                            ? 'text-amber-300 font-extrabold'
                            : isDone
                            ? 'text-emerald-400'
                            : 'text-neutral-500'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="text-xs font-bold text-white">Itens da Comanda:</span>
              <span className="font-display text-xs font-black text-amber-400">
                Total: {formatCurrency(order.totalPrice)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-white">
                      {item.qty}x {item.name}
                    </p>
                    {item.extras && item.extras.length > 0 && (
                      <p className="text-[10px] text-emerald-400 font-medium">
                        + {item.extras.join(', ')}
                      </p>
                    )}
                    {item.removals && item.removals.length > 0 && (
                      <p className="text-[10px] text-rose-400/90 line-through">
                        - {item.removals.join(', ')}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-[10px] text-amber-300/80 italic">Obs: {item.notes}</p>
                    )}
                  </div>
                  <span className="text-neutral-300 shrink-0 font-medium">
                    {formatCurrency(item.unitPrice * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-200">
                <strong>Observações Gerais:</strong> {order.notes}
              </div>
            )}
          </div>

          {/* Location info */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">Local de Retirada:</p>
                <p className="text-[10px] text-muted-foreground truncate">{ESTABLISHMENT_INFO.address}</p>
              </div>
            </div>
            <a
              href={ESTABLISHMENT_INFO.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-[11px] font-bold text-white transition-all"
            >
              <span>Mapa</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
          <a
            href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${encodeURIComponent(
              `Olá! Gostaria de saber sobre o pedido ${order.code} no nome de ${order.customerName}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-xs font-black uppercase text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Falar com o Balcão</span>
          </a>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            Minimizar
          </button>
        </div>
      </div>
    </div>
  );
}
