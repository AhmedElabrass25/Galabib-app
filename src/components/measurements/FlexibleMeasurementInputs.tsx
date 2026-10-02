import type { MeasurementFieldConfig } from "@/config/garment-types";
import type { MeasurementUnit } from "@/types";

interface FlexibleMeasurementInputsProps {
  field: MeasurementFieldConfig;
  centimeters: number | string | "";
  inches: number | string | "";
  onChange: (field: string, unit: MeasurementUnit, value: string, isText?: boolean) => void;
  error?: string;
}

export default function FlexibleMeasurementInputs({
  field,
  centimeters,
  inches,
  onChange,
  error,
}: FlexibleMeasurementInputsProps) {
  const input = (unit: MeasurementUnit, value: number | string | "", label: string) => (
    <label className="min-w-0 space-y-1">
      <span className="block text-center text-xs font-bold text-slate-500">
        {label}
      </span>
      <input
        type="number"
        step="0.25"
        placeholder="0.0"
        value={value}
        aria-label={`${field.label} ${unit === "cm" ? "بالسنتيمتر" : "بالإنش"}`}
        aria-invalid={!!error}
        aria-describedby={error ? `measurement-error-${field.name}` : undefined}
        onChange={(event) => onChange(field.name, unit, event.target.value)}
        className="w-full min-h-11 rounded-lg border border-slate-300 bg-white px-2 py-2 text-center text-base font-bold text-slate-900 shadow-sm outline-none num-tabular"
      />
    </label>
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      {input("cm", centimeters, "سم")}
      {input("inch", inches, "إنش")}
    </div>
  );
}
