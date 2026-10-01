import type { Customer, Order, Measurement, OrderOption } from '@/types';

const STORAGE_KEYS = {
  CUSTOMERS: 'jalabib_customers_v3',
  ORDERS: 'jalabib_orders_v3',
};

// Remove any old mock data from previous versions
const OLD_KEYS = [
  'jalabib_customers_v1', 'jalabib_orders_v1',
  'jalabib_customers_v2', 'jalabib_orders_v2',
];
OLD_KEYS.forEach((k) => localStorage.removeItem(k));

// Initialize fresh empty store
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

initializeStorage();

export const localStore = {
  getCustomers: (search?: string): Customer[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    let list: Customer[] = raw ? JSON.parse(raw) : [];
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.notes?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getCustomerById: (id?: string): Customer | null => {
    if (!id) return null;
    const customers = localStore.getCustomers();
    return customers.find((c) => c.id === id) || null;
  },

  createCustomer: (data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Customer => {
    const customers = localStore.getCustomers();
    const newCust: Customer = {
      ...data,
      id: 'c-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    customers.unshift(newCust);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    return newCust;
  },

  updateCustomer: (id: string, data: Partial<Customer>): Customer => {
    const customers = localStore.getCustomers();
    const idx = customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('العميل غير موجود');

    const updated = {
      ...customers[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    customers[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    return updated;
  },

  deleteCustomer: (id: string): void => {
    let customers = localStore.getCustomers();
    customers = customers.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));

    let orders = localStore.getRawOrders();
    orders = orders.filter((o) => o.customer_id !== id);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getRawOrders: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? (JSON.parse(raw) as (Order & { measurements: Measurement[]; order_options: OrderOption[] })[]) : [];
  },

  getOrders: (filters?: { search?: string; status?: string; garment_type?: string; customer_id?: string }): Order[] => {
    const customers = localStore.getCustomers();
    let orders = localStore.getRawOrders();

    orders = orders.map((o) => ({
      ...o,
      customer: customers.find((c) => c.id === o.customer_id),
    }));

    if (filters?.customer_id) {
      orders = orders.filter((o) => o.customer_id === filters.customer_id);
    }

    if (filters?.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }

    if (filters?.garment_type) {
      orders = orders.filter((o) => o.garment_type === filters.garment_type);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.customer?.name.toLowerCase().includes(q) ||
          o.customer?.phone.includes(q) ||
          o.notes?.toLowerCase().includes(q)
      );
    }

    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getOrderById: (id?: string) => {
    if (!id) return null;
    const orders = localStore.getOrders();
    return orders.find((o) => o.id === id) || null;
  },

  createOrder: (payload: {
    order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'status'>;
    measurements: Omit<Measurement, 'id' | 'order_id' | 'created_at'>[];
    options: Omit<OrderOption, 'id' | 'order_id' | 'created_at'>[];
  }) => {
    const orders = localStore.getRawOrders();
    const orderId = 'o-' + Date.now();
    const now = new Date().toISOString();

    const createdMeasurements: Measurement[] = payload.measurements.map((m, idx) => ({
      ...m,
      id: `m-${Date.now()}-${idx}`,
      order_id: orderId,
      created_at: now,
    }));

    const createdOptions: OrderOption[] = payload.options.map((o, idx) => ({
      ...o,
      id: `opt-${Date.now()}-${idx}`,
      order_id: orderId,
      created_at: now,
    }));

    const newOrder = {
      ...payload.order,
      id: orderId,
      status: 'pending' as const,
      created_at: now,
      updated_at: now,
      measurements: createdMeasurements,
      order_options: createdOptions,
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    return localStore.getOrderById(orderId)!;
  },

  updateOrderStatus: (id: string, status: Order['status']) => {
    const orders = localStore.getRawOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('الطلب غير موجود');

    orders[idx].status = status;
    orders[idx].updated_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return localStore.getOrderById(id)!;
  },

  deleteOrder: (id: string) => {
    let orders = localStore.getRawOrders();
    orders = orders.filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  clearAll: () => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  },

  restoreAll: (data: { customers: Customer[]; orders: Order[]; measurements: Measurement[]; order_options: OrderOption[] }) => {
    const ordersWithDetails = data.orders.map((o) => {
      const orderMs = data.measurements.filter((m) => m.order_id === o.id);
      const orderOpts = data.order_options.filter((opt) => opt.order_id === o.id);
      return {
        ...o,
        measurements: orderMs,
        order_options: orderOpts,
      };
    });

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(data.customers));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersWithDetails));
  },
};
