import { CheckCircle2 } from "lucide-react";
import type { GarmentType } from "@/types";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";

interface GarmentTypePickerProps {
  value: GarmentType;
  onChange: (value: GarmentType) => void;
}

export default function GarmentTypePicker({
  value,
  onChange,
}: GarmentTypePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {(["balady", "afrangy", "saudi"] as GarmentType[]).map((type) => {
        const selected = value === type;
        const description =
          type === "balady"
            ? "الجلابية البلدي المعتادة"
            : type === "afrangy"
              ? "إمكانية اختيار اللياقة والأساور"
              : "مقاسات وتفصيل سعودي";
        return (
          <button
            type="button"
            key={type}
            onClick={() => onChange(type)}
            aria-pressed={selected}
            className={`flex flex-col justify-between rounded-2xl border-2 p-4 text-right transition-all ${selected ? "border-primary bg-accent/30 shadow-sm" : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"}`}
          >
            <span className="mb-2 flex items-center justify-between font-extrabold text-text-primary">
              {GARMENT_TYPE_LABELS[type]}
              {selected && <CheckCircle2 className="size-5 text-primary" />}
            </span>
            <span className="text-xs font-medium text-text-secondary">
              {description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
