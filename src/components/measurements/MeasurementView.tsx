import type { Measurement, OrderOption, GarmentType } from "@/types";
import {
  getGarmentConfig,
  FIELD_LABEL_TRANSLATIONS,
} from "@/config/garment-types";
import { formatWithConversion } from "@/lib/conversions";
import MeasurementOptionBadges from "./MeasurementOptionBadges";

interface MeasurementViewProps {
  garmentType: GarmentType;
  measurements?: Measurement[];
  options?: OrderOption[];
}

export default function MeasurementView({
  garmentType,
  measurements = [],
  options = [],
}: MeasurementViewProps) {
  const config = getGarmentConfig(garmentType);
  if (!config) return null;

  // Build a lookup map for label translations from config
  const labelMap: Record<string, string> = {};
  for (const m of config.measurements) {
    labelMap[m.name] = m.label;
  }
  if (config.options) {
    for (const opt of config.options) {
      if (opt.conditionalFields) {
        for (const field of opt.conditionalFields.fields) {
          labelMap[field.name] = field.label;
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      <MeasurementOptionBadges garmentType={garmentType} options={options} />

      {/* Redesigned Measurement Cards Grid */}
      {measurements.length === 0 ? (
        <p className="text-slate-500 text-sm font-medium py-2">
          لا توجد مقاسات مسجلة لهذا الطلب
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {measurements.map((m) => {
            // Guarantee 100% Arabic label with no English leak
            const arabicLabel =
              labelMap[m.field_name] ||
              FIELD_LABEL_TRANSLATIONS[m.field_name] ||
              m.field_name;

            const formattedValue = formatWithConversion(
              Number(m.value),
              m.unit,
            );
            // Split primary value and converted value in parentheses
            const parts = formattedValue.split("(");
            const primaryValue = parts[0]?.trim() || "";
            const convertedValue = parts[1] ? `(${parts[1]}` : "";

            return (
              <div
                key={m.id || m.field_name}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full min-h-[96px] hover:border-slate-300 hover:shadow-xs transition-all"
              >
                {/* Arabic Label */}
                <span className="text-sm font-bold text-slate-600 block mb-1">
                  {arabicLabel}
                </span>

                {/* Numeric Value with tabular alignment */}
                <div className="flex items-baseline justify-between gap-2 mt-auto pt-1 border-t border-slate-100">
                  <span className="text-xl font-extrabold text-slate-900 num-tabular tracking-tight">
                    {primaryValue}
                  </span>

                  {convertedValue && (
                    <span className="text-xs font-semibold text-slate-400 num-tabular dir-ltr">
                      {convertedValue}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
