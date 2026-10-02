import type { GarmentTypeConfig } from "../garment-types";

export const BALADY_CONFIG: GarmentTypeConfig = {
  id: "balady",
  label: "الجلابية البلدي",
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
      name: "width",
      label: "الوسع",
      unit: "cm_and_inch_independent",
      required: true,
    },
    {
      name: "shoulder",
      label: "الأبه  ",
      unit: "cm_or_inch",
      required: true,
    },
    {
      name: "bottom_width",
      label: "وسع الديل / الأتك",
      unit: "cm",
      required: true,
    },
    {
      name: "sleeve_width",
      label: "وسع الكم",
      unit: "cm",
      required: true,
    },
    {
      name: "pocket",
      label: "الخزنة",
      unit: "text",
      required: false,
    },
    {
      name: "body",
      label: "البدن",
      unit: "text",
      required: false,
    },
  ],
};
