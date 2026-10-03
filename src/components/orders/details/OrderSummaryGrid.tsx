import type { Order } from "@/types";
import { formatDate } from "@/lib/date-utils";
import { Calendar } from "lucide-react";

export default function OrderSummaryGrid({ order }: { order: Order }) {
  const items = [
    { label: "عدد الجلاليب", value: order.quantity },
    { label: "عدد السداري", value: order.sadary_count },
    {
      label: "تاريخ التسليم",
      value: formatDate(order.delivery_date),
      calendar: true,
    },
    { label: "تاريخ الطلب", value: formatDate(order.created_at) },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <span className="block text-lg font-bold text-text-secondary">
            {item.label}
          </span>
          <span
            className={`mt-1 flex items-center gap-1 text-lg font-extrabold ${item.calendar ? "text-primary" : "text-text-primary"}`}
          >
            {item.calendar && <Calendar className="size-4 print:hidden" />}
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
