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
