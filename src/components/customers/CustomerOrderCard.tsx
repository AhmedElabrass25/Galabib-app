import { useState } from "react";
import type { Order } from "@/types";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/date-utils";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import MeasurementView from "@/components/measurements/MeasurementView";
import { Calendar, ChevronDown, ChevronUp, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerOrderCard({
  order,
  sequence,
}: {
  order: Order;
  sequence: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const garmentLabel =
    GARMENT_TYPE_LABELS[order.garment_type] || order.garment_type;
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all hover:border-secondary/50">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 bg-gray-50/80 p-5 text-right transition-colors hover:bg-gray-100/70"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
            #{sequence}
          </span>
          <span>
            <span className="flex items-center gap-2 text-base font-extrabold text-text-primary">
              <Scissors className="size-4 text-primary" />
              {garmentLabel}
              <OrderStatusBadge status={order.status} />
            </span>
            <span className="mt-0.5 block text-lg text-text-muted">
              تاريخ الطلب : {formatDate(order.created_at)}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-4 text-xs font-semibold text-text-secondary">
          <span className="text-xl">
            العدد:{" "}
            <strong className="text-text-primary">{order.quantity}</strong>
          </span>
          {order.sadary_count > 0 && (
            <span className="text-xl">
              السداري:{" "}
              <strong className="text-text-primary">
                {order.sadary_count}
              </strong>
            </span>
          )}
          <span className="flex items-center gap-1 text-text-primary text-xl font-bold">
            <Calendar className="size-3.5 text-primary" />
            التسليم: {formatDate(order.delivery_date)}
          </span>
          {expanded ? (
            <ChevronUp className="size-5 text-text-muted" />
          ) : (
            <ChevronDown className="size-5 text-text-muted" />
          )}
        </span>
      </button>
      {expanded && (
        <div className="animate-fade-in space-y-4 p-5">
          {order.notes && (
            <p className="whitespace-pre-wrap break-words rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xl font-semibold text-text-primary">
              <strong className="text-text-secondary text-2xl">
                ملاحظات الطلب :{" "}
              </strong>
              {order.notes}
            </p>
          )}
          <h5 className="text-xs font-bold uppercase text-text-secondary">
            المقاسات المسجلة لهذا الطلب
          </h5>
          <MeasurementView
            garmentType={order.garment_type}
            measurements={order.measurements}
            options={order.order_options}
          />
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
            <Link
              to={`/orders/${order.id}`}
              className="font-bold text-primary hover:underline"
            >
              عرض تفاصيل الطلب الكاملة وطباعته ←
            </Link>
            <span className="text-text-muted">
              (المقاسات محفوظة ومستقلة خاصة بهذا الطلب فقط)
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
