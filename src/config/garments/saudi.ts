import type { GarmentTypeConfig } from "../garment-types";
import { AFRANGY_OPTIONS } from "./afrangy-options";

export const SAUDI_CONFIG: GarmentTypeConfig = {
  id: "saudi",
  label: "الجلابية السعودي",
  measurements: [
    {
      name: "length",
      label: "الطول",
      unit: "inch",
      required: true,
    },
    {
      name: "width",
      label: "الوسع",
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
      unit: "cm",
      required: true,
    },
    {
      name: "shoulder",
      label: "الكتف",
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
      name: "bottom_width",
      label: "الأتك",
      unit: "inch",
      required: true,
    },
    {
      name: "pocket",
      label: "الخزنة",
      unit: "inch",
      required: false,
    },
    {
      name: "cuff",
      label: "الأشتيك",
      unit: "inch",
      required: false,
    },
    {
      name: "pocket_drop",
      label: "آخر سقوط الجيب",
      unit: "inch",
      required: false,
    },
  ],
  options: AFRANGY_OPTIONS,
};
