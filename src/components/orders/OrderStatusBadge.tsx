import type { OrderStatus } from "@/types";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_STYLE_MAP: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-300",
  in_progress: "bg-sky-100 text-sky-900 border-sky-300",
  ready: "bg-emerald-100 text-emerald-900 border-emerald-300",
  delivered: "bg-slate-100 text-slate-700 border-slate-300",
  cancelled: "bg-rose-100 text-rose-900 border-rose-300",
};

export default function OrderStatusBadge({
  status,
  className = "",
}: OrderStatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status] || status;
  const style = STATUS_STYLE_MAP[status] || STATUS_STYLE_MAP.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border shadow-2xs ${style} ${className}`}
    >
      {label}
    </span>
  );
}
