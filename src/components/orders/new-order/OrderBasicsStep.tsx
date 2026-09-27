import type { ComponentProps } from "react";
import { Scissors } from "lucide-react";
import type { GarmentType } from "@/types";
import GarmentTypePicker from "./GarmentTypePicker";
import OrderBasicsFields from "./OrderBasicsFields";

interface OrderBasicsStepProps extends ComponentProps<
  typeof OrderBasicsFields
> {
  garmentType: GarmentType;
  onGarmentTypeChange: (value: GarmentType) => void;
}

export default function OrderBasicsStep({
  garmentType,
  onGarmentTypeChange,
  ...fields
}: OrderBasicsStepProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
      <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
        <Scissors className="size-5 text-primary" />
        2. نوع الجلابية والكمية
      </h3>
      <GarmentTypePicker value={garmentType} onChange={onGarmentTypeChange} />
      <OrderBasicsFields {...fields} />
    </section>
  );
}
