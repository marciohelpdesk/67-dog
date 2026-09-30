import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

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
  estimatedMinutes?: number;
  prepStartedAt?: string;
  paymentConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const ORDERS_FILE = path.join(process.cwd(), 'data_orders.json');

// Helper to load persisted orders or start with realistic initial orders
function loadOrders(): Order[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading data_orders.json:', err);
  }

  const now = new Date();
  const initialOrders: Order[] = [
    {
      id: 'ord-101',
      code: '#101',
      customerName: 'Marcio Silva',
      status: 'preparing',
      totalPrice: 47.8,
      pixConfirmed: true,
      pixPayerName: 'Marcio Silva',
      items: [
        {
          id: 'dog-six-seven',
          name: '08. SIX SEVEN',
          qty: 1,
          unitPrice: 23.9,
          extras: ['Catupiry® Original Cremoso'],
          removals: ['Sem Cebola'],
          notes: 'Caprichar na batata palha por favor',
        },
        {
          id: 'burger-classic-67',
          name: '01. CLASSIC 67 BURGER',
          qty: 1,
          unitPrice: 23.9,
          extras: [],
          removals: [],
        },
      ],
      createdAt: new Date(now.getTime() - 12 * 60000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 60000).toISOString(),
    },
    {
      id: 'ord-102',
      code: '#102',
      customerName: 'Ana Clara',
      status: 'received',
      totalPrice: 32.8,
      pixConfirmed: true,
      pixPayerName: 'Ana Clara Santos',
      items: [
        {
          id: 'pastel-costela-queijo',
          name: '04. PASTEL COSTELA COM QUEIJO',
          qty: 2,
          unitPrice: 16.9,
          extras: [],
          removals: [],
          notes: 'Pastel bem crocante',
        },
      ],
      createdAt: new Date(now.getTime() - 3 * 60000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 60000).toISOString(),
    },
    {
      id: 'ord-100',
      code: '#100',
      customerName: 'Roberto Lima',
      status: 'ready',
      totalPrice: 21.9,
      pixConfirmed: true,
      pixPayerName: 'Roberto Lima',
      items: [
        {
          id: 'dog-costelaco',
          name: '07. COSTELAÇO',
          qty: 1,
          unitPrice: 21.9,
          extras: [],
          removals: [],
        },
      ],
      createdAt: new Date(now.getTime() - 25 * 60000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60000).toISOString(),
    },
  ];

  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2));
  } catch (e) {
    console.error('Error writing initial orders:', e);
  }

  return initialOrders;
}

function saveOrders(orders: Order[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error saving data_orders.json:', err);
  }
}

async function startServer() {
  let orders = loadOrders();

  const app = express();
  app.use(express.json());

  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  function broadcast(data: object) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  wss.on('connection', (ws) => {
    // Send full current state on connect
    ws.send(JSON.stringify({ type: 'init', orders }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (err) {
        console.error('WS message error:', err);
      }
    });
  });

  // REST API Routes
  app.get('/api/orders', (_req, res) => {
    res.json({ orders });
  });

  app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const order = orders.find((o) => o.id === id || o.code === id || o.code === `#${id}`);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, items, totalPrice, notes, pixConfirmed, pixPayerName } = req.body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    // Determine next sequential code
    const existingNumbers = orders
      .map((o) => parseInt(o.code.replace('#', ''), 10))
      .filter((n) => !isNaN(n));
    const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 101;
    const code = `#${nextNum}`;
    const id = `ord-${nextNum}-${Date.now().toString().slice(-4)}`;

    const newOrder: Order = {
      id,
      code,
      customerName: customerName.trim(),
      customerPhone: customerPhone ? customerPhone.trim().replace(/\D/g, '') : undefined,
      status: 'awaiting_confirmation',
      items,
      totalPrice: Number(totalPrice) || 0,
      notes: notes ? notes.trim() : undefined,
      pixConfirmed: Boolean(pixConfirmed),
      pixPayerName: pixPayerName ? pixPayerName.trim() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveOrders(orders);

    broadcast({ type: 'order:created', order: newOrder });

    res.status(201).json({ order: newOrder });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, estimatedMinutes } = req.body;

    const validStatuses: OrderStatus[] = [
      'awaiting_confirmation',
      'received',
      'preparing',
      'ready',
      'delivered',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const orderIndex = orders.findIndex((o) => o.id === id || o.code === id || o.code === `#${id}`);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentOrder = orders[orderIndex];
    const nowIso = new Date().toISOString();

    orders[orderIndex] = {
      ...currentOrder,
      status,
      updatedAt: nowIso,
      paymentConfirmedAt:
        status === 'received' ? nowIso : currentOrder.paymentConfirmedAt,
      prepStartedAt:
        status === 'preparing' ? nowIso : currentOrder.prepStartedAt,
      estimatedMinutes:
        estimatedMinutes !== undefined
          ? Number(estimatedMinutes)
          : status === 'preparing' && !currentOrder.estimatedMinutes
          ? 10
          : currentOrder.estimatedMinutes,
    };

    saveOrders(orders);

    const updatedOrder = orders[orderIndex];
    broadcast({ type: 'order:status_updated', order: updatedOrder });

    res.json({ order: updatedOrder });
  });

  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const initialLen = orders.length;
    orders = orders.filter((o) => o.id !== id && o.code !== id && o.code !== `#${id}`);

    if (orders.length === initialLen) {
      return res.status(404).json({ error: 'Order not found' });
    }

    saveOrders(orders);
    broadcast({ type: 'order:deleted', id });
    res.json({ success: true });
  });

  // Mount Vite in Dev, or serve static dist in Production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 67 DOG Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
