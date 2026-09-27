import { useEffect, useState } from "react";
import type { GarmentType, MeasurementUnit } from "@/types";
import type { GarmentTypeConfig } from "@/config/garment-types";
import type {
  MeasurementInputValue,
  MeasurementState,
  OptionInputValue,
} from "./measurement-types";

function getFields(config?: GarmentTypeConfig) {
  return [
    ...(config?.measurements ?? []),
    ...(config?.options?.flatMap(
      (option) => option.conditionalFields?.fields ?? [],
    ) ?? []),
  ];
}

function createMeasurementState(
  config: GarmentTypeConfig | undefined,
  initial: MeasurementInputValue[],
): MeasurementState {
  return Object.fromEntries(
    getFields(config).map((field) => {
      const saved = initial.find((item) => item.field_name === field.name);
      const unit = field.unit === "cm_or_inch" ? "cm" : field.unit;
      return [
        field.name,
        { value: saved?.value ?? "", unit: saved?.unit ?? unit },
      ];
    }),
  );
}

function createOptionState(
  config: GarmentTypeConfig | undefined,
  initial: OptionInputValue[],
) {
  return Object.fromEntries(
    (config?.options ?? []).map((option) => {
      const saved = initial.find((item) => item.option_name === option.name);
      return [
        option.name,
        saved?.option_value ?? option.options[0]?.value ?? "",
      ];
    }),
  );
}

export default function useMeasurementFormState(
  config: GarmentTypeConfig | undefined,
  garmentType: GarmentType,
  initialMeasurements: MeasurementInputValue[],
  initialOptions: OptionInputValue[],
) {
  const [measurements, setMeasurements] = useState(() =>
    createMeasurementState(config, initialMeasurements),
  );
  const [options, setOptions] = useState(() =>
    createOptionState(config, initialOptions),
  );
  useEffect(() => {
    setMeasurements(createMeasurementState(config, initialMeasurements));
    setOptions(createOptionState(config, initialOptions));
  }, [garmentType]);

  const setValue = (fieldName: string, unit: MeasurementUnit, text: string) => {
    const parsed = text === "" ? "" : parseFloat(text);
    setMeasurements((current) => ({
      ...current,
      [fieldName]: {
        ...current[fieldName],
        unit,
        value: Number.isNaN(parsed) ? "" : parsed,
      },
    }));
  };
  const setOption = (name: string, value: string) =>
    setOptions((current) => ({ ...current, [name]: value }));
  return { measurements, options, setValue, setOption };
}
