import { useCreateCustomer } from "@/hooks/useCustomers";
import type { Order } from "@/types";
import type { CustomerFormData } from "@/lib/validations";
import type {
  MeasurementInputValue,
  OptionInputValue,
} from "@/components/measurements/measurement-types";
import { toast } from "sonner";

interface NewOrderActionsProps {
  orders: Order[];
  setCustomerId: (id: string) => void;
  setMeasurements: (values: MeasurementInputValue[]) => void;
  setOptions: (values: OptionInputValue[]) => void;
}

export default function useNewOrderActions({
  orders,
  setCustomerId,
  setMeasurements,
  setOptions,
}: NewOrderActionsProps) {
  const createCustomer = useCreateCustomer();
  const addCustomer = async (data: CustomerFormData) => {
    try {
      const customer = await createCustomer.mutateAsync(data);
      setCustomerId(customer.id);
      toast.success("تم إضافة العميل بنجاح وتم اختياره تلقائيًا");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل في إضافة العميل",
      );
    }
  };
  const copyMeasurements = (orderId: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    if (order.measurements?.length)
      setMeasurements(
        order.measurements.map((item) => ({
          field_name: item.field_name,
          value: Number(item.value),
          unit: item.unit,
          notes: item.notes || "",
        })),
      );
    if (order.order_options?.length)
      setOptions(
        order.order_options.map((item) => ({
          option_name: item.option_name,
          option_value: item.option_value,
        })),
      );
    toast.success("تم نسخ المقاسات بنجاح من الطلب السابق");
  };
  return { addCustomer, copyMeasurements, createCustomer };
}
