import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerFormData } from "@/lib/validations";
import type { Customer } from "@/types";
import { X, User, Phone, FileText, AlertTriangle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useCustomers } from "@/hooks/useCustomers";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  customer?: Customer | null;
  isLoading?: boolean;
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isLoading = false,
}: CustomerFormModalProps) {
  const isEditing = !!customer;
  const { data: existingCustomers = [] } = useCustomers();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      notes: "",
    },
  });

  const watchedName = watch("name")?.trim() || "";
  const watchedPhone = watch("phone")?.trim() || "";

  // Separate Phone Duplicate (Strict Block) and Name Duplicate (Soft Warning)
  const duplicatePhoneMatch = useMemo(() => {
    if (!watchedPhone) return null;
    return existingCustomers.find((c) => {
      if (isEditing && c.id === customer?.id) return false;
      return c.phone.trim() === watchedPhone;
    });
  }, [watchedPhone, existingCustomers, isEditing, customer]);

  const duplicateNameMatches = useMemo(() => {
    if (!watchedName) return [];
    return existingCustomers.filter((c) => {
      if (isEditing && c.id === customer?.id) return false;
      const sameName =
        c.name.trim().toLowerCase() === watchedName.toLowerCase();
      const differentPhone = c.phone.trim() !== watchedPhone;
      return sameName && differentPhone;
    });
  }, [watchedName, watchedPhone, existingCustomers, isEditing, customer]);

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
        notes: customer.notes || "",
      });
    } else {
      reset({ name: "", phone: "", notes: "" });
    }
  }, [customer, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CustomerFormData) => {
    if (duplicatePhoneMatch) {
      return; // Block submission strictly
    }
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative text-right">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-text-muted hover:text-text-primary p-2 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-black text-text-primary mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          {isEditing ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-lg font-bold text-text-primary flex items-center gap-1.5">
              <span>اسم العميل</span>
              <span className="text-red-500 text-sm">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل اسم العميل..."
              {...register("name")}
              className={`w-full bg-gray-50 border rounded-xl px-4 text-lg font-semibold text-text-primary outline-hidden focus:bg-white transition-all min-h-[60px] ${
                errors.name ? "border-red-500 bg-red-50/20" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 font-bold">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-lg font-bold text-text-primary flex items-center gap-1.5">
              <Phone className="w-5 h-5 text-text-secondary" />
              <span>رقم الهاتف</span>
              <span className="text-red-500 text-sm">*</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              placeholder="01000000000"
              {...register("phone")}
              className={`w-full bg-gray-50 border rounded-xl px-4 text-lg font-bold font-mono text-text-primary text-right outline-hidden focus:bg-white transition-all min-h-[60px] ${
                errors.phone || duplicatePhoneMatch
                  ? "border-red-500 bg-red-50/30 ring-2 ring-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 font-bold">
                {errors.phone.message}
              </p>
            )}

            {/* Strict Phone Duplicate Error */}
            {duplicatePhoneMatch && (
              <div className="p-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs font-bold space-y-1 animate-fade-in flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-rose-800">
                    🛑 لا يمكن الحفظ: رقم الهاتف هذا مسجل سلفاً باسم العميل{" "}
                    <span className="underline font-black">
                      {duplicatePhoneMatch.name}
                    </span>
                    .
                  </p>
                  <p className="text-rose-600 font-medium mt-0.5">
                    يرجى ادخال رقم هاتف مختلف لمنع تكرار البيانات.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Soft Duplicate Name Warning */}
          {duplicateNameMatches.length > 0 && !duplicatePhoneMatch && (
            <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs space-y-1 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  تنبيه: يوجد عميل مسجل بهذا الاسم ولكن برقم هاتف مختلف!
                </span>
              </div>
              {duplicateNameMatches.map((m) => (
                <p
                  key={m.id}
                  className="text-xs text-amber-700 font-semibold mr-6"
                >
                  • {m.name} ({m.phone})
                </p>
              ))}
              <p className="text-xs text-amber-600 font-medium mr-6 pt-0.5">
                * يمكنك الحفظ بشكل طبيعي لأن رقم الهاتف مختلف.
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-lg font-bold text-text-primary flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-text-secondary" />
              <span>ملاحظات إضافية</span>
            </label>
            <textarea
              rows={3}
              placeholder="أي ملاحظات خاصة بالعميل..."
              {...register("notes")}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-4xl font-bold text-text-primary outline-hidden focus:bg-white transition-all resize-none min-h-[100px]"
            />
            {errors.notes && (
              <p className="text-sm text-red-500 font-bold">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 min-h-[56px] rounded-xl border border-gray-300 text-text-primary text-lg font-bold hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading || !!duplicatePhoneMatch}
              className="px-8 min-h-[56px] rounded-xl bg-primary hover:bg-primary-dark text-white text-lg font-black transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "جاري الحفظ..."
                : isEditing
                  ? "تعديل البيانات"
                  : "حفظ العميل"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
