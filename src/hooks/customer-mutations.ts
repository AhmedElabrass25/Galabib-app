import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Customer } from "@/types";
import type { CustomerFormData } from "@/lib/validations";

export function useCreateCustomer() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (formData: CustomerFormData) => {
      const { data, error } = await supabase
        .from("customers")
        .insert([{ name: formData.name, phone: formData.phone, notes: formData.notes ?? "" }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Customer;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["customers"] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCustomer() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerFormData> }) => {
      const payload = {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.notes !== undefined && { notes: data.notes }),
        updated_at: new Date().toISOString(),
      };
      const { data: result, error } = await supabase
        .from("customers")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result as Customer;
    },
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ["customers"] });
      client.invalidateQueries({ queryKey: ["customer", variables.id] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
