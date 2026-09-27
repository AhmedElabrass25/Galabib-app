import type { GarmentOptionConfig } from "@/config/garment-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeasurementOptionsPanelProps {
  garmentLabel: string;
  fields?: GarmentOptionConfig[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export default function MeasurementOptionsPanel({
  garmentLabel,
  fields,
  values,
  onChange,
}: MeasurementOptionsPanelProps) {
  if (!fields?.length) return null;
  return (
    <section className="space-y-4 rounded-xl border border-sky-200 bg-sky-50/70 p-5">
      <h4 className="text-base font-bold text-slate-900">
        خيارات الـ {garmentLabel}
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className="space-y-1.5 text-sm font-bold text-slate-700"
          >
            {field.label}
            <Select
              value={values[field.name] || ""}
              onValueChange={(value) => onChange(field.name, value)}
            >
              <SelectTrigger className="min-h-13 w-full px-4 py-3 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        ))}
      </div>
    </section>
  );
}
