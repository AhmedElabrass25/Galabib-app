import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { localStore } from "@/lib/store";
import type { Order, OrderStatus, Measurement, OrderOption } from "@/types";

export interface CreateOrderPayload {
  order: Omit<Order, "id" | "created_at" | "updated_at" | "status">;
  measurements: Omit<Measurement, "id" | "order_id" | "created_at">[];
  options: Omit<OrderOption, "id" | "order_id" | "created_at">[];
}

export function useCreateOrder() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .insert([{ ...payload.order, status: "pending" }])
          .select()
          .single();
        if (error || !data) return localStore.createOrder(payload);
        if (payload.measurements.length)
          await supabase
            .from("measurements")
            .insert(
              payload.measurements.map((item) => ({
                ...item,
                order_id: data.id,
              })),
            );
        if (payload.options.length)
          await supabase
            .from("order_options")
            .insert(
              payload.options.map((item) => ({ ...item, order_id: data.id })),
            );
        return data as Order;
      } catch {
        return localStore.createOrder(payload);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: ["customer-orders"] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        return error || !data
          ? localStore.updateOrderStatus(id, status)
          : (data as Order);
      } catch {
        return localStore.updateOrderStatus(id, status);
      }
    },
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: ["order", variables.id] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteOrder() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) localStore.deleteOrder(id);
      } catch {
        localStore.deleteOrder(id);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: ["customer-orders"] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
