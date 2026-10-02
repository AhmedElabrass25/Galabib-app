import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "@/hooks/useOrders";
import type { GarmentType, Order } from "@/types";
import { getGarmentConfig } from "@/config/garment-types";
import type {
  MeasurementInputValue,
  OptionInputValue,
} from "@/components/measurements/measurement-types";
import { toast } from "sonner";

interface NewOrderSubmissionProps {
  customerId: string;
  garmentType: GarmentType;
  quantity: number;
  sadaryCount: number;
  deliveryDate: string;
  notes: string;
  measurements: MeasurementInputValue[];
  options: OptionInputValue[];
  customerOrders: Order[];
  loadingCustomerOrders: boolean;
}

export default function useNewOrderSubmission(draft: NewOrderSubmissionProps) {
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [similarOrders, setSimilarOrders] = useState<Order[]>([]);
  const [isDuplicateWarningOpen, setIsDuplicateWarningOpen] = useState(false);

  const createOrderFromDraft = async () => {
    try {
      const order = await createOrder.mutateAsync({
        order: {
          customer_id: draft.customerId,
          garment_type: draft.garmentType,
          quantity: draft.quantity,
          sadary_count: draft.sadaryCount,
          delivery_date: draft.deliveryDate,
          notes: draft.notes,
        },
        measurements: draft.measurements.map((item) => ({
          ...item,
          value: Number(item.value),
          notes: item.notes || "",
        })),
        options: draft.options.map((item) => ({
          option_name: item.option_name,
          option_value: item.option_value,
        })),
      });
      toast.success("تم إنشاء الطلب بنجاح وتعيين المقاسات الخاصة به");
      navigate(`/orders/${order.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل في إنشاء الطلب",
      );
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (createOrder.isPending || isDuplicateWarningOpen) return;
    const errors: Record<string, string> = {};
    if (!draft.customerId) errors.customer = "اختر العميل أولاً";
    if (draft.quantity < 1 || draft.quantity > 100)
      errors.quantity = "أدخل عددًا من 1 إلى 100";
    if (draft.sadaryCount < 0 || draft.sadaryCount > 100)
      errors.sadaryCount = "أدخل عددًا من 0 إلى 100";
    if (!draft.deliveryDate) errors.deliveryDate = "اختر تاريخ التسليم";
    if (draft.notes.length > 500)
      errors.notes = "الملاحظات يجب ألا تتجاوز 500 حرف";

    const config = getGarmentConfig(draft.garmentType);
    const activeFields = [
      ...(config?.measurements ?? []),
      ...(config?.options?.flatMap((option) => {
        const selected = draft.options.find(
          (item) => item.option_name === option.name,
        );
        return option.conditionalFields &&
          selected?.option_value === option.conditionalFields.showWhen
          ? option.conditionalFields.fields
          : [];
      }) ?? []),
    ];
    for (const field of activeFields) {
      const measurement = draft.measurements.find(
        (item) => item.field_name === field.name,
      );
      const value = Number(measurement?.value);
      const key = `measurement.${field.name}`;
      if (field.unit === "text") {
        if (field.required && (!measurement || !measurement.notes)) {
          errors[key] = "هذا المقاس مطلوب";
        }
      } else if (field.unit === "cm_and_inch_independent") {
        const inchMeasurement = draft.measurements.find(
          (item) => item.field_name === `${field.name}_inch`,
        );
        const inchValue = Number(inchMeasurement?.value);
        if (
          field.required &&
          (!Number.isFinite(value) ||
            value <= 0 ||
            !Number.isFinite(inchValue) ||
            inchValue <= 0)
        ) {
          errors[key] = "أدخل المقاس بالسنتيمتر والإنش";
        }
      } else {
        if (
          field.required &&
          (!measurement || !Number.isFinite(value) || value <= 0)
        ) {
          errors[key] = "هذا المقاس مطلوب";
        }
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    if (draft.loadingCustomerOrders) return;
    const activeStatuses: Order["status"][] = [
      "pending",
      "in_progress",
      "ready",
    ];
    const matchingOrders = draft.customerOrders.filter(
      (order) =>
        order.garment_type === draft.garmentType &&
        activeStatuses.includes(order.status),
    );
    if (matchingOrders.length) {
      setSimilarOrders(matchingOrders);
      setIsDuplicateWarningOpen(true);
      return;
    }

    await createOrderFromDraft();
  };

  const confirmSimilarOrder = async () => {
    setIsDuplicateWarningOpen(false);
    await createOrderFromDraft();
  };
  const clearError = (field: string) =>
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  const clearMeasurementErrors = () =>
    setFieldErrors((current) =>
      Object.fromEntries(
        Object.entries(current).filter(
          ([key]) => !key.startsWith("measurement."),
        ),
      ),
    );
  return {
    submit,
    createOrder,
    fieldErrors,
    clearError,
    clearMeasurementErrors,
    similarOrders,
    isDuplicateWarningOpen,
    closeDuplicateWarning: () => setIsDuplicateWarningOpen(false),
    confirmSimilarOrder,
  };
}
