import type { GarmentOptionConfig } from "../garment-types";

export const AFRANGY_OPTIONS: GarmentOptionConfig[] = [
  {
    name: "collar_type",
    label: "نوع اللياقة",
    type: "select",
    options: [
      { value: "full_collar", label: "لياقة" },
      { value: "half_collar", label: "نصف لياقة" },
    ],
  },
  {
    name: "sleeve_type",
    label: "نوع الكم",
    type: "select",
    options: [
      { value: "normal", label: "عادي" },
      { value: "cuffs", label: "أساور" },
    ],
    conditionalFields: {
      showWhen: "cuffs",
      fields: [
        {
          name: "cuff_size",
          label: "مقاس الأساور",
          unit: "inch",
          required: true,
        },
      ],
    },
  },
];
