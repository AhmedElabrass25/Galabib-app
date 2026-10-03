import type { Customer } from "@/types";
import { Plus, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerSelectionStepProps {
  customers: Customer[];
  customer?: Customer;
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  error?: string;
}

export default function CustomerSelectionStep({
  customers,
  customer,
  selectedId,
  onSelect,
  onAdd,
  error,
}: CustomerSelectionStepProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
      <header className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
          <User className="size-5 text-primary" />
          1. اختيار العميل
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 p-2 text-xs font-bold text-primary hover:bg-gray-50"
        >
          <Plus className="size-4" /> عميل جديد
        </button>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-text-secondary">
            اختر العميل من القائمة <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedId || "no-customer"}
            onValueChange={(value) =>
              onSelect(value === "no-customer" ? "" : value)
            }
          >
            <SelectTrigger className="min-h-12 w-full bg-gray-50 px-4 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-customer">-- اختر عميل --</SelectItem>
              {customers.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} ({item.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-rose-700"
            >
              {error}
            </p>
          )}
        </div>
        {customer && (
          <div className="space-y-1 rounded-xl border border-secondary/30 bg-accent/20 p-4 text-sm">
            <p className="font-bold text-text-primary">{customer.name}</p>
            <p
              dir="ltr"
              className="text-right font-mono text-xs font-bold text-text-secondary"
            >
              {customer.phone}
            </p>
            {customer.notes && (
              <p className="whitespace-pre-wrap break-words text-xs font-semibold text-text-primary">
                ملاحظات: {customer.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
