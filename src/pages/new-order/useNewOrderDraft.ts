import { useEffect, useState } from "react";
import type { GarmentType } from "@/types";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomerOrders } from "@/hooks/useOrders";
import type {
  MeasurementInputValue,
  OptionInputValue,
} from "@/components/measurements/measurement-types";
import { toInputDateValue } from "@/lib/date-utils";

export default function useNewOrderDraft(preselectedCustomerId: string | null) {
  const [customerId, setCustomerId] = useState(preselectedCustomerId || "");
  const [garmentType, setGarmentType] = useState<GarmentType>("balady");
  const [quantity, setQuantity] = useState(1);
  const [sadaryCount, setSadaryCount] = useState(0);
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const [deliveryDate, setDeliveryDate] = useState(
    toInputDateValue(defaultDate),
  );
  const [notes, setNotes] = useState("");
  const [measurements, setMeasurements] = useState<MeasurementInputValue[]>([]);
  const [options, setOptions] = useState<OptionInputValue[]>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: customerOrders = [] } = useCustomerOrders(customerId);

  useEffect(() => {
    if (preselectedCustomerId) setCustomerId(preselectedCustomerId);
  }, [preselectedCustomerId]);

  // Auto-fill measurements from latest matching order when customer or garment type changes
  useEffect(() => {
    if (!customerId || !customerOrders.length) return;
    const latestOrder = customerOrders.find((o) => o.garment_type === garmentType);
    if (!latestOrder) return;

    if (latestOrder.measurements?.length) {
      setMeasurements(
        latestOrder.measurements.map((item) => ({
          field_name: item.field_name,
          value: Number(item.value),
          unit: item.unit,
        }))
      );
    }

    if (latestOrder.order_options?.length) {
      setOptions(
        latestOrder.order_options.map((item) => ({
          option_name: item.option_name,
          option_value: item.option_value,
        }))
      );
    }
  }, [customerId, garmentType, customerOrders]);

  return {
    customerId,
    setCustomerId,
    garmentType,
    setGarmentType,
    quantity,
    setQuantity,
    sadaryCount,
    setSadaryCount,
    deliveryDate,
    setDeliveryDate,
    notes,
    setNotes,
    measurements,
    setMeasurements,
    options,
    setOptions,
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    customers,
    loadingCustomers,
    customerOrders,
  };
}
