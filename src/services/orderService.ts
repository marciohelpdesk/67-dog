import { Order, OrderStatus } from '../types/order';
import { audioAlert } from '../utils/audioAlert';

export type OrderEventCallback = (event: {
  type: 'init' | 'order:created' | 'order:status_updated' | 'order:deleted';
  orders?: Order[];
  order?: Order;
  id?: string;
}) => void;

class OrderService {
  private ws: WebSocket | null = null;
  private listeners: Set<OrderEventCallback> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connectWebSocket();
      // Start fallback poll every 5s to guarantee fresh state
      this.startPolling();
    }
  }

  private getWsUrl(): string {
    const loc = window.location;
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${loc.host}`;
  }

  public connectWebSocket() {
    if (typeof window === 'undefined' || this.isConnecting) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.isConnecting = true;
      const url = this.getWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnecting = false;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'order:created') {
            audioAlert.playNewOrderChime();
          } else if (data.type === 'order:status_updated') {
            audioAlert.playStatusChange();
          }
          this.notifyListeners(data);
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.ws = null;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        this.ws?.close();
      };
    } catch (err) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connectWebSocket();
    }, 3000);
  }

  private startPolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    // Continuous fail-safe poll every 3 seconds so mobile 4G/5G devices ALWAYS sync
    this.pollTimer = setInterval(async () => {
      try {
        const orders = await this.fetchAllOrders();
        this.notifyListeners({ type: 'init', orders });
      } catch {
        // silent error
      }
    }, 3000);
  }

  public async forceRefresh(): Promise<Order[]> {
    const orders = await this.fetchAllOrders();
    this.notifyListeners({ type: 'init', orders });
    return orders;
  }

  public subscribe(callback: OrderEventCallback): () => void {
    this.listeners.add(callback);
    // Send immediate initial fetch
    this.fetchAllOrders()
      .then((orders) => callback({ type: 'init', orders }))
      .catch(() => {});

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(data: Parameters<OrderEventCallback>[0]) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Error in order listener:', err);
      }
    });
  }

  public async fetchAllOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.orders || [];
  }

  public async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Order not found');
    const data = await res.json();
    return data.order;
  }

  public async createOrder(orderData: {
    customerName: string;
    customerPhone?: string;
    items: Order['items'];
    totalPrice: number;
    notes?: string;
    pixConfirmed?: boolean;
    pixPayerName?: string;
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create order');
    }

    const data = await res.json();
    return data.order;
  }

  public async updateStatus(
    orderId: string,
    status: OrderStatus,
    estimatedMinutes?: number
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, estimatedMinutes }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update order status');
    }

    const data = await res.json();
    return data.order;
  }

  public async cancelOrder(orderId: string): Promise<void> {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to cancel order');
    }
  }
}

export const orderService = new OrderService();
