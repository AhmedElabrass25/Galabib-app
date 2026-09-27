const CM_PER_INCH = 2.54;

export function convertInchToCm(inches: number): number {
  return Math.round(inches * CM_PER_INCH * 100) / 100;
}

export function convertCmToInch(cm: number): number {
  return Math.round((cm / CM_PER_INCH) * 100) / 100;
}

export function getConvertedValue(
  value: number,
  unit: 'cm' | 'inch'
): { convertedValue: number; convertedUnit: 'cm' | 'inch' } {
  if (unit === 'cm') {
    return { convertedValue: convertCmToInch(value), convertedUnit: 'inch' };
  }
  return { convertedValue: convertInchToCm(value), convertedUnit: 'cm' };
}

export function formatMeasurement(value: number, unit: 'cm' | 'inch'): string {
  const unitLabel = unit === 'cm' ? 'سم' : 'إنش';
  return `${value} ${unitLabel}`;
}

export function formatWithConversion(value: number, unit: 'cm' | 'inch'): string {
  const { convertedValue, convertedUnit } = getConvertedValue(value, unit);
  const origLabel = unit === 'cm' ? 'سم' : 'إنش';
  const convLabel = convertedUnit === 'cm' ? 'سم' : 'إنش';
  return `${value} ${origLabel} (${convertedValue} ${convLabel})`;
}
