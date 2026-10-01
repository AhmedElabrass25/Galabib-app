import type { MeasurementFieldConfig } from "@/config/garment-types";
import type { MeasurementUnit } from "@/types";
import {
  convertCmToInch,
  convertInchToCm,
  getConvertedValue,
} from "@/lib/conversions";
import type { MeasurementState } from "./measurement-types";
import FlexibleMeasurementInputs from "./FlexibleMeasurementInputs";

interface MeasurementFieldCardProps {
  field: MeasurementFieldConfig;
  values: MeasurementState;
  onChange: (field: string, unit: MeasurementUnit, value: string) => void;
  error?: string;
}

export default function MeasurementFieldCard({
  field,
  values,
  onChange,
  error,
}: MeasurementFieldCardProps) {
  const item = values[field.name] ?? {
    value: "",
    unit: field.unit === "cm_or_inch" ? "cm" : field.unit,
  };
  const flexible = field.unit === "cm_or_inch";
  const centimeters =
    item.value === ""
      ? ""
      : item.unit === "cm"
        ? item.value
        : convertInchToCm(item.value);
  const inches =
    item.value === ""
      ? ""
      : item.unit === "inch"
        ? item.value
        : convertCmToInch(item.value);
  const converted =
    typeof item.value === "number" && !flexible
      ? getConvertedValue(item.value, item.unit)
      : undefined;
  const inputClass =
    "w-full min-h-11 rounded-lg border border-slate-300 bg-white px-2 py-2 text-center text-base font-bold text-slate-900 shadow-sm outline-none num-tabular";

  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:border-slate-300">
      <header className="flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-base font-bold text-slate-800">
          {field.label}
          {field.required && <span className="text-xs text-rose-500">*</span>}
        </h5>
        {converted && (
          <span className="text-xs font-semibold text-slate-500 num-tabular dir-ltr">
            (~ {converted.convertedValue}{" "}
            {converted.convertedUnit === "cm" ? "سم" : "إنش"})
          </span>
        )}
      </header>
      {flexible ? (
        <FlexibleMeasurementInputs
          field={field}
          centimeters={centimeters}
          inches={inches}
          onChange={onChange}
          error={error}
        />
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.25"
            min={field.min ?? 0}
            max={field.max ?? 500}
            placeholder="0.0"
            value={item.value}
            aria-label={field.label}
            aria-invalid={!!error}
            onChange={(event) =>
              onChange(field.name, item.unit, event.target.value)
            }
            className={`flex-1 ${inputClass}`}
          />
          <span className="flex min-h-13 min-w-16 items-center justify-center rounded-xl border border-slate-300 bg-slate-200 px-3.5 py-3 text-sm font-bold text-slate-700">
            {field.unit === "cm" ? "سم" : "إنش"}
          </span>
        </div>
      )}
      {error && (
        <p
          id={`measurement-error-${field.name}`}
          role="alert"
          className="text-xs font-semibold text-rose-700"
        >
          {error}
        </p>
      )}
    </article>
  );
}
