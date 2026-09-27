import type { Customer } from "@/types";
import { formatDate } from "@/lib/date-utils";
import { Phone } from "lucide-react";

export default function CustomerProfileSummary({
  customer,
  orderCount,
}: {
  customer: Customer;
  orderCount: number;
}) {
  return (
    <section className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs md:flex-row md:items-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary">
          {customer.name}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-text-secondary">
          <span className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5">
            <Phone className="size-4 text-secondary" />
            <strong dir="ltr" className="font-mono text-text-primary">
              {customer.phone}
            </strong>
          </span>
          <span className="text-text-muted">
            تاريخ التسجيل: {formatDate(customer.created_at)}
          </span>
        </div>
        {customer.notes && (
          <p className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50/60 p-3 text-sm text-text-secondary">
            <strong>ملاحظات العميل: </strong>
            {customer.notes}
          </p>
        )}
      </div>
      <div className="min-w-44 shrink-0 rounded-2xl border border-secondary/20 bg-accent/30 p-4 text-center">
        <p className="text-xs font-bold text-text-secondary">
          عدد الطلبات المسجلة
        </p>
        <p className="mt-1 text-3xl font-black text-primary-dark">
          {orderCount}
        </p>
      </div>
    </section>
  );
}
