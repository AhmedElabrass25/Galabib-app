import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMMM yyyy', { locale: ar });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ar });
}

export function isOverdue(date: string | Date): boolean {
  return isBefore(new Date(date), new Date());
}

export function isDueSoon(date: string | Date, days: number = 3): boolean {
  const target = new Date(date);
  const now = new Date();
  const threshold = addDays(now, days);
  return isAfter(target, now) && isBefore(target, threshold);
}

export function toInputDateValue(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd');
}
