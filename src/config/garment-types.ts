import { AFRANGY_CONFIG } from "./garments/afrangy";
import { BALADY_CONFIG } from "./garments/balady";
import { SAUDI_CONFIG } from "./garments/saudi";

export type MeasurementFieldConfig = {
  name: string;
  label: string;
  unit: "cm" | "inch" | "cm_or_inch" | "cm_and_inch_independent" | "text";
  required: boolean;
};

export type GarmentOptionConfig = {
  name: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  conditionalFields?: {
    showWhen: string;
    fields: MeasurementFieldConfig[];
  };
};

export type GarmentTypeConfig = {
  id: "balady" | "afrangy" | "saudi";
  label: string;
  measurements: MeasurementFieldConfig[];
  options?: GarmentOptionConfig[];
};

// Global fallback dictionary for field names to guarantee 100% Arabic UI
export const FIELD_LABEL_TRANSLATIONS: Record<string, string> = {
  length: "الطول الكلي",
  shoulder: "عرض الكتف",
  sleeve: "طول الكم",
  width: "الوسع (سم)",
  width_inch: "الوسع (إنش)",
  chest: "محيط الصدر",
  bottom_width: "وسع الديل (الأتك)",
  sleeve_width: "وسع الكم",
  pocket: "الخزنة / الجيب",
  body: "البدن",
  back: "الخلف",
  neck: "محيط الرقبة",
  zero: "الصفرة",
  cuff_size: "مقاس الأساور",
  cuff: "الأشتيك",
  pocket_drop: "سقوط الجيب",
  armhole: "وسعة الإبط (الجيروه)",
};

export const GARMENT_CONFIGS: Record<string, GarmentTypeConfig> = {
  balady: BALADY_CONFIG,
  afrangy: AFRANGY_CONFIG,
  saudi: SAUDI_CONFIG,
};

export function getGarmentConfig(type: string): GarmentTypeConfig | undefined {
  return GARMENT_CONFIGS[type];
}
