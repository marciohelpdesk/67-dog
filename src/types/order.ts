export type OrderStatus =
  | 'awaiting_confirmation'
  | 'received'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  extras?: string[];
  removals?: string[];
  notes?: string;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  customerPhone?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  notes?: string;
  pixConfirmed: boolean;
  pixPayerName?: string;
  estimatedMinutes?: number; // e.g. 5, 10
  prepStartedAt?: string;
  paymentConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    stepIndex: number;
    color: string;
    bgColor: string;
    borderColor: string;
    emoji: string;
    badgeText: string;
  }
> = {
  awaiting_confirmation: {
    label: 'Aguardando Comprovante',
    description: 'Aguardando verificação do comprovante Pix pela equipe do balcão',
    stepIndex: 0,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/30',
    emoji: '⏳',
    badgeText: 'Aguardando Comprovante',
  },
  received: {
    label: 'Pagamento Recebido',
    description: 'Comprovante verificado com sucesso! Pedido confirmado pela equipe',
    stepIndex: 1,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-blue-500/30',
    emoji: '✅',
    badgeText: 'Pagamento Recebido',
  },
  preparing: {
    label: 'Iniciando Preparo',
    description: 'Seu lanche está na chapa! Ficará pronto em torno de 5 a 10 minutos',
    stepIndex: 2,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/30',
    emoji: '👨‍🍳',
    badgeText: 'Iniciando Preparo',
  },
  ready: {
    label: 'Pronto para Retirada!',
    description: 'Tudo pronto e quentinho! Pode retirar no balcão agora',
    stepIndex: 3,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    emoji: '🔔',
    badgeText: 'Pronto para Retirada',
  },
  delivered: {
    label: 'Entregue / Concluído',
    description: 'Pedido retirado no balcão. Bom apetite!',
    stepIndex: 4,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/30',
    emoji: '🎉',
    badgeText: 'Entregue',
  },
  cancelled: {
    label: 'Cancelado',
    description: 'Este pedido foi cancelado',
    stepIndex: -1,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/15',
    borderColor: 'border-rose-500/30',
    emoji: '❌',
    badgeText: 'Cancelado',
  },
};
