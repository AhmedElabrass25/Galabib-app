import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export interface TailorDashboardStats {
  totalCustomers: number;
  todayOrdersCount: number;
  upcomingOrdersCount: number;
  recentOrders: Order[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<TailorDashboardStats> => {
      const [customersRes, ordersRes] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('*, customer:customers(*)')
          .order('created_at', { ascending: false }),
      ]);

      if (customersRes.error) throw new Error(customersRes.error.message);
      if (ordersRes.error) throw new Error(ordersRes.error.message);

      const orders = (ordersRes.data ?? []) as Order[];
      const totalCustomers = customersRes.count ?? 0;
      return calculateStats(totalCustomers, orders);
    },
  });
}

function calculateStats(totalCustomers: number, orders: Order[]): TailorDashboardStats {
  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();

  const todayOrdersCount = orders.filter((o) => {
    return new Date(o.created_at).toISOString().slice(0, 10) === todayStr;
  }).length;

  const upcomingOrdersCount = orders.filter((o) => {
    return (
      (o.status === 'pending' || o.status === 'in_progress' || o.status === 'ready') &&
      new Date(o.delivery_date) >= now
    );
  }).length;

  return {
    totalCustomers,
    todayOrdersCount,
    upcomingOrdersCount,
    recentOrders: orders.slice(0, 10),
  };
}
