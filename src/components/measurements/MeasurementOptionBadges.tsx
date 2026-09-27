import type { OrderOption, GarmentType } from "@/types";
import { getGarmentConfig } from "@/config/garment-types";

interface MeasurementOptionBadgesProps {
  garmentType: GarmentType;
  options: OrderOption[];
}

export default function MeasurementOptionBadges({
  garmentType,
  options,
}: MeasurementOptionBadgesProps) {
  const optionConfigs = getGarmentConfig(garmentType)?.options;
  const badges = optionConfigs?.flatMap((config) => {
    const selected = options.find((option) => option.option_name === config.name);
    const value = config.options.find((item) => item.value === selected?.option_value);
    return selected && value ? [{ label: config.label, value: value.label }] : [];
  }) ?? [];

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      {badges.map((badge) => (
        <div key={badge.label} className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-base shadow-2xs">
          <span className="font-bold text-slate-600">{badge.label}: </span>
          <span className="font-extrabold text-slate-900">{badge.value}</span>
        </div>
      ))}
    </div>
  );
}