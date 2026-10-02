import { useState } from "react";
import { Edit2, X, Save, Loader2 } from "lucide-react";
import type { Order } from "@/types";
import type { MeasurementInputValue, OptionInputValue } from "@/components/measurements/measurement-types";
import MeasurementView from "@/components/measurements/MeasurementView";
import MeasurementFormV2 from "@/components/measurements/MeasurementFormV2";
import { useUpdateOrderMeasurements } from "@/hooks/useOrders";
import { toast } from "sonner";

export default function OrderMeasurements({ order }: { order: Order }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftMeasurements, setDraftMeasurements] = useState<MeasurementInputValue[]>([]);
  const [draftOptions, setDraftOptions] = useState<OptionInputValue[]>([]);
  const updateMeasurements = useUpdateOrderMeasurements();

  const handleEditOpen = () => {
    setDraftMeasurements(
      (order.measurements || []).map((m) => ({
        field_name: m.field_name,
        value: Number(m.value),
        unit: m.unit,
        notes: m.notes,
      }))
    );
    setDraftOptions(
      (order.order_options || []).map((o) => ({
        option_name: o.option_name,
        option_value: o.option_value,
      }))
    );
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateMeasurements.mutateAsync({
        orderId: order.id,
        measurements: draftMeasurements.map((m) => ({ ...m, value: Number(m.value) })),
        options: draftOptions,
      });
      toast.success("تم تحديث المقاسات بنجاح");
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء الحفظ");
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
          تعديل المقاسات
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
              <h2 className="text-xl font-bold text-slate-800">تعديل مقاسات الطلب</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
              <MeasurementFormV2
                garmentType={order.garment_type}
                initialMeasurements={draftMeasurements}
                initialOptions={draftOptions}
                onChange={(m, o) => {
                  setDraftMeasurements(m);
                  setDraftOptions(o);
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
