import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { localStore } from "@/lib/store";
import type { Customer } from "@/types";

export function useCustomers(search?: string) {
  return useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      try {
        let query = supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });
        if (search?.trim())
          query = query.or(
            `name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`,
          );
        const { data, error } = await query;
        return error || !data
          ? localStore.getCustomers(search)
          : (data as Customer[]);
      } catch {
        return localStore.getCustomers(search);
      }
    },
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: ["customer", id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", id!)
          .single();
        return error || !data
          ? localStore.getCustomerById(id)
          : (data as Customer);
      } catch {
        return localStore.getCustomerById(id);
      }
    },
  });
}
