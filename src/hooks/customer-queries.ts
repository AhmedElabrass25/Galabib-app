import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Customer } from "@/types";

export function useCustomers(search?: string) {
  return useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (search?.trim())
        query = query.or(
          `name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`,
        );
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Customer[];
    },
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: ["customer", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw new Error(error.message);
      return data as Customer;
    },
  });
}
