import { useState } from "react";
import { Edit2, X, Save, Loader2 } from "lucide-react";
import type { Order } from "@/types";
import type {
  MeasurementInputValue,
  OptionInputValue,
} from "@/components/measurements/measurement-types";
import MeasurementView from "@/components/measurements/MeasurementView";
import MeasurementFormV2 from "@/components/measurements/MeasurementFormV2";
import { getGarmentConfig } from "@/config/garment-types";
import { useUpdateOrderMeasurements } from "@/hooks/useOrders";
import { toast } from "sonner";

export default function OrderMeasurements({ order }: { order: Order }) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(order.quantity);
  const [sadaryCount, setSadaryCount] = useState(order.sadary_count);
  const [deliveryDate, setDeliveryDate] = useState(
    order.delivery_date.slice(0, 10),
  );
  const [notes, setNotes] = useState(order.notes ?? "");
  const [draftMeasurements, setDraftMeasurements] = useState<
    MeasurementInputValue[]
  >([]);
  const [draftOptions, setDraftOptions] = useState<OptionInputValue[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const updateMeasurements = useUpdateOrderMeasurements();

  const handleEditOpen = () => {
    setQuantity(order.quantity);
    setSadaryCount(order.sadary_count);
    setDeliveryDate(order.delivery_date.slice(0, 10));
    setNotes(order.notes ?? "");
    setDraftMeasurements(
      (order.measurements || []).map((m) => ({
        field_name: m.field_name,
        value: Number(m.value),
        unit: m.unit,
        notes: m.notes,
      })),
    );
    setDraftOptions(
      (order.order_options || []).map((o) => ({
        option_name: o.option_name,
        option_value: o.option_value,
      })),
    );
    setIsEditing(true);
  };

  const handleSave = async () => {
    const config = getGarmentConfig(order.garment_type);
    const activeFields = [
      ...(config?.measurements ?? []),
      ...(config?.options?.flatMap((option) => {
        const selected = draftOptions.find(
          (item) => item.option_name === option.name,
        );
        return option.conditionalFields &&
          selected?.option_value === option.conditionalFields.showWhen
          ? option.conditionalFields.fields
          : [];
      }) ?? []),
    ];
    const nextFieldErrors: Record<string, string> = {};
    for (const field of activeFields) {
      if (!field.required) continue;
      const measurement = draftMeasurements.find(
        (item) => item.field_name === field.name,
      );
      const value = Number(measurement?.value);
      if (field.unit === "text") {
        if (!measurement?.notes) {
          nextFieldErrors[`measurement.${field.name}`] = "هذا المقاس مطلوب";
        }
      } else if (field.unit === "cm_and_inch_independent") {
        const inchMeasurement = draftMeasurements.find(
          (item) => item.field_name === `${field.name}_inch`,
        );
        const inchValue = Number(inchMeasurement?.value);
        if (
          !Number.isFinite(value) ||
          value <= 0 ||
          !Number.isFinite(inchValue) ||
          inchValue <= 0
        ) {
          nextFieldErrors[`measurement.${field.name}`] =
            "أدخل المقاس بالسنتيمتر والإنش";
        }
      } else if (!Number.isFinite(value) || value <= 0) {
        nextFieldErrors[`measurement.${field.name}`] = "هذا المقاس مطلوب";
      }
    }
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length) return;

    if (quantity < 1 || quantity > 100) {
      toast.error("أدخل عدد جلاليب من 1 إلى 100");
      return;
    }
    if (sadaryCount < 0 || sadaryCount > 100) {
      toast.error("أدخل عدد سداري من 0 إلى 100");
      return;
    }
    if (!deliveryDate) {
      toast.error("اختر موعد التسليم");
      return;
    }
    if (notes.length > 500) {
      toast.error("ملاحظات الطلب يجب ألا تتجاوز 500 حرف");
      return;
    }

    try {
      await updateMeasurements.mutateAsync({
        orderId: order.id,
        order: {
          quantity,
          sadary_count: sadaryCount,
          delivery_date: deliveryDate,
          notes,
        },
        measurements: draftMeasurements.map((m) => ({
          ...m,
          value: Number(m.value),
        })),
        options: draftOptions,
      });
      toast.success("تم تحديث بيانات الطلب والمقاسات بنجاح");
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء الحفظ",
      );
    }
  };

  return (
    <div className="space-y-4 pt-2 relative">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-lg font-extrabold text-text-primary">
          جدول المقاسات الخاصة بالطلب
        </h3>
        <button
          onClick={handleEditOpen}
          className="print:hidden inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
        >
          <Edit2 className="size-4" />
          تعديل الطلب والمقاسات
        </button>
      </div>
      <MeasurementView
        garmentType={order.garment_type}
        measurements={order.measurements}
        options={order.order_options}
      />

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <header className="flex items-center justify-between border-b border-slate-100 p-4 sm:px-6">
              <h2 className="text-xl font-bold text-slate-800">
                تعديل بيانات الطلب والمقاسات
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
              <section className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
                <label className="space-y-1.5 text-sm font-bold text-slate-700">
                  عدد الجلاليب
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Number(event.target.value))
                    }
                    className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900"
                  />
                </label>
                <label className="space-y-1.5 text-sm font-bold text-slate-700">
                  عدد السداري
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={sadaryCount}
                    onChange={(event) =>
                      setSadaryCount(Number(event.target.value))
                    }
                    className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900"
                  />
                </label>
                <label className="space-y-1.5 text-sm font-bold text-slate-700">
                  موعد التسليم
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900"
                  />
                </label>
                <label className="space-y-1.5 text-sm font-bold text-slate-700 sm:col-span-3">
                  ملاحظات الطلب
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900"
                  />
                </label>
              </section>
              <MeasurementFormV2
                garmentType={order.garment_type}
                initialMeasurements={draftMeasurements}
                initialOptions={draftOptions}
                errors={fieldErrors}
                onChange={(m, o) => {
                  setDraftMeasurements(m);
                  setDraftOptions(o);
                  setFieldErrors({});
                }}
              />
            </div>

            <footer className="border-t border-slate-100 p-4 sm:px-6 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={updateMeasurements.isPending}
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={updateMeasurements.isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {updateMeasurements.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                حفظ التعديلات
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
