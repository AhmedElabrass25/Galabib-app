import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { localStore } from "@/lib/store";
import type { Customer } from "@/types";
import type { CustomerFormData } from "@/lib/validations";

export function useCreateCustomer() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (formData: CustomerFormData) => {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        notes: formData.notes ?? "",
      };
      try {
        const { data, error } = await supabase
          .from("customers")
          .insert([payload])
          .select()
          .single();
        return error || !data
          ? localStore.createCustomer(payload)
          : (data as Customer);
      } catch {
        return localStore.createCustomer(payload);
      }
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CustomerFormData>;
    }) => {
      const payload = {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.notes !== undefined && { notes: data.notes }),
      };
      try {
        const { data: result, error } = await supabase
          .from("customers")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        return error || !result
          ? localStore.updateCustomer(id, payload)
          : (result as Customer);
      } catch {
        return localStore.updateCustomer(id, payload);
      }
    },
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ["customers"] });
      client.invalidateQueries({ queryKey: ["customer", variables.id] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
