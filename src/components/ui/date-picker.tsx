import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "اختر التاريخ",
  error,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsedDate = value ? parseISO(value) : undefined;
  const selectedDate =
    parsedDate && isValid(parsedDate) ? parsedDate : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={placeholder}
          aria-expanded={open}
          aria-invalid={!!error}
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-slate-300 bg-gray-50 px-4 py-2.5 text-right text-sm font-bold text-text-primary shadow-sm transition-colors hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            !selectedDate && "text-slate-500",
            error && "border-rose-500 focus-visible:ring-rose-200",
          )}
        >
          <span>
            {selectedDate
              ? format(selectedDate, "dd MMMM yyyy", { locale: ar })
              : placeholder}
          </span>
          <CalendarDays className="size-4 shrink-0 text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          defaultMonth={selectedDate}
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
