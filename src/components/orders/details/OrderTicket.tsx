import type { Order, OrderStatus } from "@/types";
import OrderTicketHeader from "./OrderTicketHeader";
import OrderSummaryGrid from "./OrderSummaryGrid";
import OrderMeasurements from "./OrderMeasurements";

export default function OrderTicket({
  order,
  garmentLabel,
  onStatusChange,
}: {
  order: Order;
  garmentLabel: string;
  onStatusChange: (status: OrderStatus) => void;
}) {
  return (
    <article className="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs print:border-2 print:border-black print:shadow-none">
      <OrderTicketHeader
        order={order}
        garmentLabel={garmentLabel}
        onStatusChange={onStatusChange}
      />
      <OrderSummaryGrid order={order} />
      {order.notes && (
        <div className="space-y-1 rounded-xl border border-yellow-200 bg-yellow-50/70 p-4 text-sm">
          <span className="block font-bold text-amber-900">ملاحظات الطلب:</span>
          <p className="whitespace-pre-wrap break-words font-bold text-amber-950">
            {order.notes}
          </p>
        </div>
      )}
      <OrderMeasurements order={order} />
    </article>
  );
}
