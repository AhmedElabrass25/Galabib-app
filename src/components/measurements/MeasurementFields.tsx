import type { MeasurementFieldConfig } from "@/config/garment-types";
import type { MeasurementState } from "./measurement-types";
import type { MeasurementUnit } from "@/types";
import MeasurementFieldCard from "./MeasurementFieldCard";

interface MeasurementFieldsProps {
  title: string;
  fields: MeasurementFieldConfig[];
  values: MeasurementState;
  errors?: Record<string, string>;
  onChange: (field: string, unit: MeasurementUnit, value: string) => void;
}

export default function MeasurementFields({
  title,
  fields,
  values,
  errors,
  onChange,
}: MeasurementFieldsProps) {
  return (
    <section>
      <h4 className="mb-3 flex items-center justify-between text-lg font-bold text-slate-900">
        <span>{title}</span>
        <span className="text-xs font-semibold text-slate-500">
          (بالسنتيمتر سم أو البوصة إنش)
        </span>
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <MeasurementFieldCard
            key={field.name}
            field={field}
            values={values}
            error={errors?.[field.name]}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}
