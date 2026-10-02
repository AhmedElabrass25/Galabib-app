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
  const result: MeasurementState = {};
  getFields(config).forEach((field) => {
    if (field.unit === "cm_and_inch_independent") {
      const savedCm = initial.find((item) => item.field_name === field.name);
      const savedInch = initial.find((item) => item.field_name === `${field.name}_inch`);
      result[field.name] = { value: savedCm?.value ?? "", unit: "cm" };
      result[`${field.name}_inch`] = { value: savedInch?.value ?? "", unit: "inch" };
    } else if (field.unit === "text") {
      const saved = initial.find((item) => item.field_name === field.name);
      // Text fields store their value in notes; on load, read from notes
      result[field.name] = { value: saved?.notes ?? saved?.value ?? "", unit: "cm" };
    } else {
      const saved = initial.find((item) => item.field_name === field.name);
      const defaultUnit: MeasurementUnit = field.unit === "cm_or_inch" ? "cm" : field.unit;
      result[field.name] = {
        value: saved?.value ?? "",
        unit: saved?.unit ?? defaultUnit,
      };
    }
  });
  return result;
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

  const setValue = (fieldName: string, unit: MeasurementUnit, text: string, isText = false) => {
    const value = isText ? text : (text === "" ? "" : (Number.isNaN(parseFloat(text)) ? "" : parseFloat(text)));
    setMeasurements((current) => ({
      ...current,
      [fieldName]: {
        ...current[fieldName],
        unit,
        value,
      },
    }));
  };
  const setOption = (name: string, value: string) =>
    setOptions((current) => ({ ...current, [name]: value }));
  return { measurements, options, setValue, setOption };
}
