import type { Order } from "@/types";
import MeasurementView from "@/components/measurements/MeasurementView";

export default function OrderMeasurements({ order }: { order: Order }) {
  return (
    <div className="space-y-4 pt-2">
      <h3 className="border-b border-gray-200 pb-2 text-lg font-extrabold text-text-primary">
        جدول المقاسات الخاصة بالطلب
      </h3>
      <MeasurementView
        garmentType={order.garment_type}
        measurements={order.measurements}
        options={order.order_options}
      />
    </div>
  );
}
