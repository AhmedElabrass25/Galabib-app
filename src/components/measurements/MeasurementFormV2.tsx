import { useEffect } from "react";
import { getGarmentConfig } from "@/config/garment-types";
import type {
  MeasurementFormProps,
  MeasurementInputValue,
} from "./measurement-types";
import useMeasurementFormState from "./useMeasurementFormState";
import MeasurementOptionsPanel from "./MeasurementOptionsPanel";
import MeasurementFields from "./MeasurementFields";

export type {
  MeasurementInputValue,
  OptionInputValue,
} from "./measurement-types";

export default function MeasurementFormV2({
  garmentType,
  initialMeasurements = [],
  initialOptions = [],
  errors = {},
  onChange,
}: MeasurementFormProps) {
  const config = getGarmentConfig(garmentType);
  const state = useMeasurementFormState(
    config,
    garmentType,
    initialMeasurements,
    initialOptions,
  );

  useEffect(() => {
    if (!config) return;
    const conditional = (config.options ?? []).flatMap((option) =>
      option.conditionalFields &&
      state.options[option.name] === option.conditionalFields.showWhen
        ? [option.conditionalFields.fields]
        : [],
    );
    const fields = config.measurements.concat(...conditional);
    const measurements: MeasurementInputValue[] = fields
      .flatMap((field) => {
        if (field.unit === "cm_and_inch_independent") {
          return [
            {
              field_name: field.name,
              value: state.measurements[field.name]?.value ?? "",
              unit: "cm" as const,
            },
            {
              field_name: `${field.name}_inch`,
              value: state.measurements[`${field.name}_inch`]?.value ?? "",
              unit: "inch" as const,
            },
          ];
        }
        if (field.unit === "text") {
          const textVal = state.measurements[field.name]?.value ?? "";
          if (textVal === "") return [];
          return [
            {
              field_name: field.name,
              value: 0,
              unit: "cm" as const,
              notes: String(textVal),
            },
          ];
        }
        return [
          {
            field_name: field.name,
            value: state.measurements[field.name]?.value ?? "",
            unit:
              state.measurements[field.name]?.unit ??
              (field.unit === "cm_or_inch" ? "cm" : field.unit as "cm" | "inch"),
          },
        ];
      })
      .filter((item) => item.value !== "");
    const options = Object.entries(state.options).map(
      ([option_name, option_value]) => ({ option_name, option_value }),
    );
    onChange(measurements, options);
  }, [state.measurements, state.options, garmentType]);

  if (!config) return null;
  const measurementErrors = Object.fromEntries(
    Object.entries(errors)
      .filter(([key]) => key.startsWith("measurement."))
      .map(([key, message]) => [key.slice("measurement.".length), message]),
  );
  const conditional = (config.options ?? []).flatMap((option) =>
    option.conditionalFields &&
    state.options[option.name] === option.conditionalFields.showWhen
      ? [
          {
            title: `مقاسات إضافية (${option.label})`,
            fields: option.conditionalFields.fields,
          },
        ]
      : [],
  );

  return (
    <div className="space-y-6">
      <MeasurementOptionsPanel
        garmentLabel={config.label}
        fields={config.options}
        values={state.options}
        onChange={state.setOption}
      />
      <MeasurementFields
        title={`مقاسات ${config.label}`}
        fields={config.measurements}
        values={state.measurements}
        errors={measurementErrors}
        onChange={state.setValue}
      />
      {conditional.map((group) => (
        <MeasurementFields
          key={group.title}
          title={group.title}
          fields={group.fields}
          values={state.measurements}
          errors={measurementErrors}
          onChange={state.setValue}
        />
      ))}
    </div>
  );
}
