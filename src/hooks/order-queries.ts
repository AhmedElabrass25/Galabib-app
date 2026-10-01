import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus, GarmentType, Measurement, OrderOption } from "@/types";

interface OrderFilters {
  search?: string;
  status?: OrderStatus | "";
  garment_type?: GarmentType | "";
  customer_id?: string;
}

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*, customer:customers(*)")
        .order("created_at", { ascending: false });
      if (filters?.customer_id) query = query.eq("customer_id", filters.customer_id);
      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.garment_type) query = query.eq("garment_type", filters.garment_type);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const search = filters?.search?.trim().toLowerCase();
      return search
        ? (data as Order[]).filter(
            (order) =>
              order.customer?.name.toLowerCase().includes(search) ||
              order.customer?.phone.includes(search) ||
              order.notes?.toLowerCase().includes(search),
          )
        : (data as Order[]);
    },
  });
}

export function useCustomerOrders(customerId?: string) {
  return useQuery({
    queryKey: ["customer-orders", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customer:customers(*), measurements(*), order_options(*)")
        .eq("customer_id", customerId!)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data as (Order & { measurements: Measurement[]; order_options: OrderOption[] })[];
    },
  });
}

export function useOrder(id?: string) {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customer:customers(*), measurements(*), order_options(*)")
        .eq("id", id!)
        .single();
      if (error) throw new Error(error.message);
      return data as Order & { measurements: Measurement[]; order_options: OrderOption[] };
    },
  });
}
