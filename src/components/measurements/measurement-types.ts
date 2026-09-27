import type { MeasurementUnit, GarmentType } from "@/types";

export interface MeasurementInputValue {
  field_name: string;
  value: number | "";
  unit: MeasurementUnit;
  notes?: string;
}

export interface OptionInputValue {
  option_name: string;
  option_value: string;
}

export type MeasurementState = Record<
  string,
  { value: number | ""; unit: MeasurementUnit }
>;

export interface MeasurementFormProps {
  garmentType: GarmentType;
  initialMeasurements?: MeasurementInputValue[];
  initialOptions?: OptionInputValue[];
  errors?: Record<string, string>;
  onChange: (
    measurements: MeasurementInputValue[],
    options: OptionInputValue[],
  ) => void;
}
