import type { GarmentTypeConfig } from "../garment-types";
import { AFRANGY_OPTIONS } from "./afrangy-options";

export const AFRANGY_CONFIG: GarmentTypeConfig = {
  id: "afrangy",
  label: "الجلابية الأفرنجي العادي",
  measurements: [
    {
      name: "length",
      label: "الطول",
      unit: "inch",
      required: true,
    },
    {
      name: "sleeve",
      label: "الكم",
      unit: "inch",
      required: true,
    },
    {
      name: "sleeve_width",
      label: "وسع الكم",
      unit: "cm_or_inch",
      required: true,
    },
    {
      name: "zero",
      label: "صفرة",
      unit: "inch",
      required: true,
    },
    {
      name: "width",
      label: "الوسع",
      unit: "cm_and_inch_independent",
      required: true,
    },
    {
      name: "back",
      label: "الخلف",
      unit: "inch",
      required: true,
    },
    {
      name: "neck",
      label: "الرقبة",
      unit: "inch",
      required: true,
    },
    {
      name: "body",
      label: "البدن",
      unit: "cm",
      required: true,
    },
    {
      name: "pocket",
      label: "الخزنة",
      unit: "cm",
      required: false,
    },
    {
      name: "bottom_width",
      label: "الديل / الأتك",
      unit: "cm",
      required: true,
    },
  ],
  options: AFRANGY_OPTIONS,
};
