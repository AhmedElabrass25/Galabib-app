import { Copy } from "lucide-react";
import type { Order, GarmentType } from "@/types";
import type {
  MeasurementInputValue,
  OptionInputValue,
} from "@/components/measurements/measurement-types";
import MeasurementForm from "@/components/measurements/MeasurementFormV2";
import { formatDate } from "@/lib/date-utils";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeasurementsStepProps {
  customerId: string;
  orders: Order[];
  garmentType: GarmentType;
  measurements: MeasurementInputValue[];
  options: OptionInputValue[];
  errors?: Record<string, string>;
  onCopy: (orderId: string) => void;
  onChange: (
    measurements: MeasurementInputValue[],
    options: OptionInputValue[],
  ) => void;
}

export default function MeasurementsStep({
  customerId,
  orders,
  garmentType,
  measurements,
  options,
  errors,
  onCopy,
  onChange,
}: MeasurementsStepProps) {
  const matchingOrders = orders.filter(
    (order) => order.garment_type === garmentType,
  );
  return (
    <section className="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
      <header className="flex flex-col justify-between gap-4 border-b border-gray-200/80 pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            3. أدخل مقاسات الطلب
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            سيتم حفظ هذه المقاسات مستقلة تمامًا لهذا الطلب
          </p>
        </div>
        {customerId && matchingOrders.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-2">
            <Copy className="size-4 shrink-0 text-primary" />
            <Select onValueChange={onCopy}>
              <SelectTrigger className="min-h-9 w-full border-0 bg-transparent px-1 py-1 text-xs text-primary shadow-none hover:border-transparent">
                <SelectValue
                  placeholder={`نسخ المقاسات من طلب سابق (${GARMENT_TYPE_LABELS[garmentType]})`}
                />
              </SelectTrigger>
              <SelectContent>
                {matchingOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    طلب بتاريخ {formatDate(order.created_at)} ({order.quantity}{" "}
                    قطعة)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </header>
      <MeasurementForm
        garmentType={garmentType}
        initialMeasurements={measurements}
        initialOptions={options}
        errors={errors}
        onChange={onChange}
      />
    </section>
  );
}
