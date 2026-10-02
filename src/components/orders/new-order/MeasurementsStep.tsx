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
      </header>
      {customerId && matchingOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-2xs border border-primary/10">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                تم استرجاع مقاسات العميل تلقائياً
              </h4>
              <p className="text-xs font-semibold text-slate-600 mt-1 max-w-md leading-relaxed">
                تم جلب مقاسات آخر طلب تفصيل للعميل ({GARMENT_TYPE_LABELS[garmentType]}). يمكنك التعديل عليها مباشرةً، أو استدعاء مقاسات من طلب أقدم.
              </p>
            </div>
          </div>
          
          <div className="w-full sm:w-auto min-w-[240px] shrink-0">
            <Select onValueChange={onCopy}>
              <SelectTrigger className="w-full h-11 bg-white border-slate-300 gap-2 font-bold text-slate-700 shadow-xs hover:border-primary/50 transition-colors">
                <Copy className="size-4 text-primary shrink-0" />
                <SelectValue placeholder="نسخ مقاسات من طلب أقدم..." />
              </SelectTrigger>
              <SelectContent>
                {matchingOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id} className="font-semibold text-sm">
                    طلب بتاريخ {formatDate(order.created_at)} ({order.quantity} قطعة)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
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
