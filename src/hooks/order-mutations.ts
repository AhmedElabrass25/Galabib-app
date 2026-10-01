import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
      // 1. Create the order
      const { data, error } = await supabase
        .from("orders")
        .insert([{ ...payload.order, status: "pending" }])
        .select()
        .single();
      if (error) throw new Error(error.message);

      // 2. Insert measurements
      if (payload.measurements.length) {
        const { error: mErr } = await supabase
          .from("measurements")
          .insert(payload.measurements.map((m) => ({ ...m, order_id: data.id })));
        if (mErr) throw new Error(mErr.message);
      }

      // 3. Insert options
      if (payload.options.length) {
        const { error: oErr } = await supabase
          .from("order_options")
          .insert(payload.options.map((o) => ({ ...o, order_id: data.id })));
        if (oErr) throw new Error(oErr.message);
      }

      return data as Order;
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
      const { data, error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Order;
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
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: ["customer-orders"] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
