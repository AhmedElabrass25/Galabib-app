import type { Measurement, OrderOption, GarmentType } from "@/types";
import {
  getGarmentConfig,
  FIELD_LABEL_TRANSLATIONS,
} from "@/config/garment-types";
import { convertInchToCm, formatMeasurement } from "@/lib/conversions";
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
    labelMap[m.name] = m.label.trim();
    if (m.unit === "cm_and_inch_independent") {
      labelMap[`${m.name}_inch`] = `${m.label.trim()} (إنش)`;
    }
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

  const independentFieldNames = new Set(
    [
      ...config.measurements,
      ...(config.options?.flatMap(
        (option) => option.conditionalFields?.fields ?? [],
      ) ?? []),
    ]
      .filter((field) => field.unit === "cm_and_inch_independent")
      .map((field) => field.name),
  );
  const measurementsByName = new Map(
    measurements.map((measurement) => [measurement.field_name, measurement]),
  );
  const renderedMeasurements = new Set<string>();
  const measurementCards: {
    key: string;
    label: string;
    values: Measurement[];
  }[] = [];

  for (const measurement of measurements) {
    const isInchValue = measurement.field_name.endsWith("_inch");
    const baseFieldName = isInchValue
      ? measurement.field_name.slice(0, -"_inch".length)
      : measurement.field_name;

    if (independentFieldNames.has(baseFieldName)) {
      if (renderedMeasurements.has(baseFieldName)) continue;

      const centimeterValue = measurementsByName.get(baseFieldName);
      const inchValue = measurementsByName.get(`${baseFieldName}_inch`);
      const values = [centimeterValue, inchValue].filter(
        (value): value is Measurement => value !== undefined,
      );
      renderedMeasurements.add(baseFieldName);
      renderedMeasurements.add(`${baseFieldName}_inch`);
      measurementCards.push({
        key: baseFieldName,
        label:
          labelMap[baseFieldName] ||
          FIELD_LABEL_TRANSLATIONS[baseFieldName] ||
          baseFieldName,
        values,
      });
      continue;
    }

    measurementCards.push({
      key: measurement.id || measurement.field_name,
      label:
        labelMap[measurement.field_name] ||
        FIELD_LABEL_TRANSLATIONS[measurement.field_name] ||
        measurement.field_name,
      values: [measurement],
    });
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
          {measurementCards.map((card) => (
            <div
              key={card.key}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full min-h-[96px] hover:border-slate-300 hover:shadow-xs transition-all"
            >
              {/* Arabic Label */}
              <span className="text-sm font-bold text-slate-600 block mb-1">
                {card.label}
              </span>

              <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1 mt-auto pt-1 border-t border-slate-100">
                {card.values.map((measurement) => {
                  const isTextMeasurement =
                    measurement.notes &&
                    measurement.notes.length > 0 &&
                    Number(measurement.value) === 0;
                  const isAfrangyHem =
                    garmentType === "afrangy" &&
                    measurement.field_name === "bottom_width";
                  const isAfrangySleeveWidth =
                    garmentType === "afrangy" &&
                    measurement.field_name === "sleeve_width";
                  const displayInCentimeters =
                    isAfrangyHem || isAfrangySleeveWidth;
                  const displayValue = Number(measurement.value);
                  const displayUnit =
                    displayInCentimeters && measurement.unit === "inch"
                      ? "cm"
                      : measurement.unit;
                  const normalizedValue =
                    displayInCentimeters && measurement.unit === "inch"
                      ? convertInchToCm(displayValue)
                      : displayValue;
                  const formattedValue = isTextMeasurement
                    ? measurement.notes!
                    : formatMeasurement(normalizedValue, displayUnit);

                  return (
                    <span
                      key={measurement.id || measurement.field_name}
                      className="text-xl font-extrabold text-slate-900 num-tabular tracking-tight"
                    >
                      {formattedValue}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
