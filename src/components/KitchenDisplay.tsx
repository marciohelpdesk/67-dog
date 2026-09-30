import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, ORDER_STATUS_CONFIG } from '../types/order';
import { orderService } from '../services/orderService';
import { audioAlert } from '../utils/audioAlert';
import { ESTABLISHMENT_INFO } from '../data/menuData';
import {
  Clock3,
  Volume2,
  VolumeX,
  X,
  Check,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Flame,
  ChefHat,
  Trash2,
  CheckCircle2,
  Timer,
} from 'lucide-react';

interface KitchenDisplayProps {
  onClose: () => void;
}

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getElapsedMinutes(isoString: string): number {
  const diffMs = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

export function KitchenDisplay({ onClose }: KitchenDisplayProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<
    'all' | 'awaiting_confirmation' | 'received' | 'preparing' | 'ready' | 'delivered'
  >('all');
  const [isMuted, setIsMuted] = useState(audioAlert.getMuted());
  const [currentTime, setCurrentTime] = useState(new Date());
  // Store custom prep times chosen for specific orders before starting prep
  const [prepTimeChoice, setPrepTimeChoice] = useState<Record<string, number>>({});

  // Clock tick every 15s to update elapsed minutes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initial fetch
    orderService
      .fetchAllOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error('Failed to load orders:', err));

    // Live WebSocket connection
    const unsubscribe = orderService.subscribe((event) => {
      if (event.type === 'init' && event.orders) {
        setOrders(event.orders);
      } else if (event.type === 'order:created' && event.order) {
        setOrders((prev) => [event.order!, ...prev.filter((o) => o.id !== event.order!.id)]);
      } else if (event.type === 'order:status_updated' && event.order) {
        setOrders((prev) => prev.map((o) => (o.id === event.order!.id ? event.order! : o)));
      } else if (event.type === 'order:deleted' && event.id) {
        setOrders((prev) => prev.filter((o) => o.id !== event.id));
      }
    });

    return () => unsubscribe();
  }, []);

  function toggleMute() {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioAlert.setMuted(newMuted);
  }

  function handleTestSound() {
    audioAlert.playNewOrderChime();
  }

  async function handleUpdateStatus(orderId: string, status: OrderStatus, estimatedMinutes?: number) {
    try {
      await orderService.updateStatus(orderId, status, estimatedMinutes);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  async function handleDelete(orderId: string) {
    if (confirm('Deseja cancelar e remover este pedido da tela?')) {
      try {
        await orderService.cancelOrder(orderId);
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return o.status !== 'delivered' && o.status !== 'cancelled';
    return o.status === activeTab;
  });

  const countAwaiting = orders.filter((o) => o.status === 'awaiting_confirmation').length;
  const countReceived = orders.filter((o) => o.status === 'received').length;
  const countPreparing = orders.filter((o) => o.status === 'preparing').length;
  const countReady = orders.filter((o) => o.status === 'ready').length;
  const countActive = countAwaiting + countReceived + countPreparing + countReady;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white overflow-hidden animate-fade-in">
      {/* KDS TOPBAR */}
      <header className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame text-flame-foreground shadow-lg font-black text-xl">
            👨‍🍳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-black tracking-wide text-white">
                PAINEL DA COZINHA (KDS)
              </h2>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 animate-pulse">
                ● Conectado em Tempo Real
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              67 DOG • {countActive} {countActive === 1 ? 'pedido ativo' : 'pedidos ativos'}
            </p>
          </div>
        </div>

        {/* Audio controls & time */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleTestSound}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-bold text-neutral-300 hover:bg-neutral-700 transition-all cursor-pointer"
            title="Testar sinal sonoro de novos pedidos"
          >
            <span>🔔 Testar Som</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
              isMuted
                ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isMuted ? 'Mudo' : 'Som Ativo'}</span>
          </button>

          <div className="hidden md:block rounded-xl bg-neutral-800 px-3 py-1.5 font-mono text-xs font-bold text-amber-400 border border-neutral-700">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-all cursor-pointer"
            title="Sair do Painel da Cozinha"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-2.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-flame text-flame-foreground shadow-md'
              : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
          }`}
        >
          <span>🔥 Todos Ativos</span>
          <span className="rounded-full bg-black/30 px-1.5 py-0.2 text-[10px] font-black">
            {countActive}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('awaiting_confirmation')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'awaiting_confirmation'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
          }`}
        >
          <span>⏳ Aguardando Pix</span>
          {countAwaiting > 0 && (
            <span className="rounded-full bg-amber-400 text-black px-1.5 py-0.2 text-[10px] font-black animate-pulse">
              {countAwaiting}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
          }`}
        >
          <span>✅ Pagamento Recebido</span>
          <span className="rounded-full bg-black/30 px-1.5 py-0.2 text-[10px] font-black">
            {countReceived}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preparing')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'preparing'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
          }`}
        >
          <span>🍳 Iniciando Preparo</span>
          <span className="rounded-full bg-black/30 px-1.5 py-0.2 text-[10px] font-black">
            {countPreparing}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ready')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'ready'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
          }`}
        >
          <span>🔔 Prontos no Balcão</span>
          <span className="rounded-full bg-black/30 px-1.5 py-0.2 text-[10px] font-black">
            {countReady}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delivered')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'delivered'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
          }`}
        >
          <span>🎉 Já Entregues</span>
        </button>
      </div>

      {/* ORDERS GRID */}
      <main className="flex-1 overflow-y-auto p-4">
        {filteredOrders.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <span className="text-5xl mb-3">👨‍🍳</span>
            <h3 className="font-display text-lg font-bold text-white">Nenhum pedido nesta coluna</h3>
            <p className="mt-1 text-xs text-neutral-400 max-w-sm">
              Quando os clientes fecharem pedidos pelo cardápio, eles aparecerão aqui com alerta sonoro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.map((ord) => {
              const minutes = getElapsedMinutes(ord.createdAt);
              const isUrgent = minutes >= 15 && ord.status !== 'delivered';
              const statusCfg = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG.received;
              const chosenPrepMinutes = prepTimeChoice[ord.id] || ord.estimatedMinutes || 10;

              return (
                <article
                  key={ord.id}
                  className={`flex flex-col justify-between rounded-3xl border ${
                    isUrgent
                      ? 'border-rose-500 bg-rose-950/30 ring-2 ring-rose-500/50'
                      : ord.status === 'awaiting_confirmation'
                      ? 'border-amber-500/60 bg-amber-950/25 ring-1 ring-amber-500/30'
                      : ord.status === 'received'
                      ? 'border-blue-500/50 bg-blue-950/20'
                      : ord.status === 'preparing'
                      ? 'border-orange-500/50 bg-neutral-900/90'
                      : ord.status === 'ready'
                      ? 'border-emerald-500/50 bg-emerald-950/20'
                      : 'border-neutral-800 bg-neutral-900/60'
                  } p-4 shadow-xl backdrop-blur-xl transition-all`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display text-2xl font-black tracking-tight text-white">
                            {ord.code}
                          </span>
                          {ord.status === 'awaiting_confirmation' && (
                            <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-black text-amber-300 border border-amber-500/40">
                              ⏳ Aguardando Comprovante
                            </span>
                          )}
                          {ord.status === 'received' && (
                            <span className="rounded-full bg-blue-500/25 px-2 py-0.5 text-[10px] font-black text-blue-300 border border-blue-500/40">
                              ✓ Pagamento Recebido
                            </span>
                          )}
                          {ord.status === 'preparing' && (
                            <>
                              <span className="rounded-full bg-orange-500/25 px-2 py-0.5 text-[10px] font-black text-orange-300 border border-orange-500/40">
                                👨‍🍳 Iniciando Preparo
                              </span>
                              <span className="rounded-full bg-amber-400/25 px-2 py-0.5 text-[10px] font-black text-amber-200 border border-amber-400/50 animate-pulse">
                                ⏱️ Pronto em 5-10 min
                              </span>
                            </>
                          )}
                          {ord.status === 'ready' && (
                            <span className="rounded-full bg-emerald-500/25 px-2 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/50">
                              🔔 Pronto para Retirada
                            </span>
                          )}
                          {ord.status === 'delivered' && (
                            <span className="rounded-full bg-purple-500/25 px-2 py-0.5 text-[10px] font-black text-purple-300 border border-purple-500/40">
                              🎉 Entregue
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-display text-sm font-extrabold text-amber-300">
                          {ord.customerName}
                        </p>
                        {ord.customerPhone && (
                          <p className="text-[11px] text-neutral-400 font-mono">
                            📱 {ord.customerPhone}
                          </p>
                        )}
                      </div>

                      {/* Elapsed Timer */}
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black ${
                            isUrgent
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <Clock3 className="h-3 w-3" />
                          <span>{minutes} min</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                          {new Date(ord.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="mt-3 space-y-2.5">
                      {ord.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-neutral-800/80 p-2.5 border border-neutral-700/60"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-display text-xs font-black text-white leading-tight">
                              <span className="text-amber-400 font-black text-sm mr-1">
                                {it.qty}x
                              </span>
                              {it.name}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                              {formatCurrency(it.unitPrice * it.qty)}
                            </span>
                          </div>

                          {/* Extras Badges */}
                          {it.extras && it.extras.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {it.extras.map((ex, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold"
                                >
                                  + {ex}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Removals Badges */}
                          {it.removals && it.removals.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {it.removals.map((rm, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold line-through"
                                >
                                  - {rm}
                                </span>
                              ))}
                            </div>
                          )}

                          {it.notes && (
                            <p className="mt-1 text-[10px] text-amber-300/90 italic">
                              Obs: {it.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Customer Notes */}
                    {ord.notes && (
                      <div className="mt-2.5 rounded-xl border border-amber-500/30 bg-amber-950/30 p-2 text-xs text-amber-200">
                        <strong className="text-amber-400">Observação Geral:</strong> {ord.notes}
                      </div>
                    )}

                    {/* PIX / Payment confirmation badge */}
                    <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-400">
                      <span>Total: <strong className="text-white">{formatCurrency(ord.totalPrice)}</strong></span>
                      {ord.status === 'awaiting_confirmation' ? (
                        <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold">
                          ⏳ Conferir Pix
                        </span>
                      ) : ord.pixConfirmed ? (
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Pix Confirmado</span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold">Pagar no Balcão</span>
                      )}
                    </div>

                    {/* Estimated prep indicator if preparing */}
                    {ord.status === 'preparing' && (
                      <div className="mt-2 rounded-xl bg-orange-500/15 border border-orange-500/30 p-2 text-center text-xs">
                        <span className="text-orange-300 font-bold flex items-center justify-center gap-1.5">
                          <Timer className="h-4 w-4 animate-spin" />
                          <span>Previsão informada ao cliente: ~{ord.estimatedMinutes || 10} min</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2">
                    {/* 1. AGUARDANDO CONFIRMAÇÃO DO PIX ➔ CONFIRMAR PAGAMENTO */}
                    {ord.status === 'awaiting_confirmation' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ord.id, 'received')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-black uppercase text-white shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Confirmar Pagamento e Pedido ✅</span>
                      </button>
                    )}

                    {/* 2. CONFIRMADO ➔ INICIAR PREPARO (COM ESCOLHA DE TEMPO: 5-10, 10-15, 15-20 min) */}
                    {ord.status === 'received' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>Tempo previsto:</span>
                          <div className="flex gap-1">
                            {[
                              { label: '5-10m', val: 10 },
                              { label: '10-15m', val: 15 },
                              { label: '15-20m', val: 20 },
                            ].map((btn) => (
                              <button
                                key={btn.val}
                                type="button"
                                onClick={() =>
                                  setPrepTimeChoice((prev) => ({ ...prev, [ord.id]: btn.val }))
                                }
                                className={`rounded-lg px-2 py-0.5 text-[10px] font-bold border transition-all cursor-pointer ${
                                  chosenPrepMinutes === btn.val
                                    ? 'bg-amber-400 text-black border-amber-400 font-black'
                                    : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                                }`}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(ord.id, 'preparing', chosenPrepMinutes)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs font-black uppercase text-white shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <Flame className="h-4 w-4" />
                          <span>Iniciar Preparo ({chosenPrepMinutes <= 10 ? '5 a 10 min' : `${chosenPrepMinutes} min`}) ➔</span>
                        </button>
                      </div>
                    )}

                    {/* 3. EM PREPARO ➔ MARCAR COMO PRONTO */}
                    {ord.status === 'preparing' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ord.id, 'ready')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-xs font-black uppercase text-white shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer animate-pulse hover:animate-none"
                      >
                        <Check className="h-4 w-4" />
                        <span>Marcar como Pronto! 🔔</span>
                      </button>
                    )}

                    {/* 4. PRONTO NO BALCÃO ➔ CONCLUIR RETIRADA */}
                    {ord.status === 'ready' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-3 text-xs font-black uppercase text-white shadow-lg active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Concluir Retirada (Entregue) 🎉</span>
                      </button>
                    )}

                    {/* 5. ENTREGUE ➔ REVERTER SE NECESSÁRIO */}
                    {ord.status === 'delivered' && (
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>Pedido entregue com sucesso</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(ord.id, 'ready')}
                          className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                        >
                          Reverter
                        </button>
                      </div>
                    )}

                    {/* Secondary row: WhatsApp notify + delete */}
                    <div className="flex gap-2">
                      <a
                        href={
                          ord.customerPhone
                            ? `https://wa.me/55${ord.customerPhone}?text=${encodeURIComponent(
                                `Olá ${ord.customerName}! Seu pedido ${ord.code} no 67 DOG já está pronto e quentinho para retirada no balcão! 🌭\n\n📍 Endereço: ${ESTABLISHMENT_INFO.address}`
                              )}`
                            : `https://wa.me/?text=${encodeURIComponent(
                                `Olá ${ord.customerName}! Seu pedido ${ord.code} no 67 DOG já está pronto e quentinho para retirada no balcão! 🌭\n\n📍 Endereço: ${ESTABLISHMENT_INFO.address}`
                              )}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-700 py-2 text-[11px] font-bold text-neutral-300 transition-all"
                        title={ord.customerPhone ? `Avisar no WhatsApp (${ord.customerPhone})` : 'Avisar no WhatsApp'}
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Avisar no WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(ord.id)}
                        className="rounded-xl border border-neutral-800 hover:border-rose-500/40 bg-neutral-800/50 hover:bg-rose-500/20 p-2 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
                        title="Cancelar comanda"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
