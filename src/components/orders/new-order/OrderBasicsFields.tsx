import { Calendar, FileText } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface OrderBasicsFieldsProps {
  quantity: number;
  sadaryCount: number;
  deliveryDate: string;
  notes: string;
  errors?: Record<string, string>;
  onQuantityChange: (value: number) => void;
  onSadaryChange: (value: number) => void;
  onDeliveryDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export default function OrderBasicsFields({
  quantity,
  sadaryCount,
  deliveryDate,
  notes,
  errors = {},
  onQuantityChange,
  onSadaryChange,
  onDeliveryDateChange,
  onNotesChange,
}: OrderBasicsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
        <label className="space-y-1.5 text-xs font-bold text-text-primary">
          عدد الجلاليب <span className="text-red-500">*</span>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(event) =>
              onQuantityChange(Math.max(1, parseInt(event.target.value) || 1))
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-center text-base font-bold outline-hidden focus:border-primary"
          />
          {errors.quantity && (
            <p role="alert" className="text-xs font-semibold text-rose-700">
              {errors.quantity}
            </p>
          )}
        </label>
        <label className="space-y-1.5 text-xs font-bold text-text-primary">
          عدد السداري
          <input
            type="number"
            min="0"
            max="100"
            value={sadaryCount}
            onChange={(event) =>
              onSadaryChange(Math.max(0, parseInt(event.target.value) || 0))
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-center text-base font-bold outline-hidden focus:border-primary"
          />
          {errors.sadaryCount && (
            <p role="alert" className="text-xs font-semibold text-rose-700">
              {errors.sadaryCount}
            </p>
          )}
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs font-bold text-text-primary">
            <Calendar className="size-3.5 text-primary" /> تاريخ التسليم{" "}
            <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={deliveryDate}
            onChange={onDeliveryDateChange}
            placeholder="اختر تاريخ التسليم"
            error={errors.deliveryDate}
          />
          {errors.deliveryDate && (
            <p role="alert" className="text-xs font-semibold text-rose-700">
              {errors.deliveryDate}
            </p>
          )}
        </div>
      </div>
      <label className="block space-y-1.5 text-xs font-bold text-text-primary">
        <span className="flex items-center gap-1">
          <FileText className="size-3.5 text-text-secondary" />
          ملاحظات الطلب
        </span>
        <input
          type="text"
          placeholder="أي تفاصيل خاصة بالقماش أو التطريز..."
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium outline-hidden focus:border-primary"
        />
        {errors.notes && (
          <p role="alert" className="text-xs font-semibold text-rose-700">
            {errors.notes}
          </p>
        )}
      </label>
    </>
  );
}
