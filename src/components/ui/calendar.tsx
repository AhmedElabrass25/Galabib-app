import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ar } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ar}
      dir="rtl"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "space-y-4",
        month_caption: "flex h-9 items-center justify-center",
        caption_label: "text-sm font-bold text-slate-800",
        nav: "absolute inset-x-1 top-1 flex items-center justify-between",
        button_previous:
          "inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        button_next:
          "inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 rounded-md text-[0.8rem] font-medium text-slate-500",
        week: "mt-1 flex w-full",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button:
          "inline-flex size-9 items-center justify-center rounded-md font-normal text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        today:
          "[&>button]:bg-slate-100 [&>button]:font-bold [&>button]:text-slate-900",
        selected:
          "[&>button]:bg-primary [&>button]:font-bold [&>button]:text-white [&>button]:hover:bg-primary-dark",
        outside: "[&>button]:text-slate-400 [&>button]:opacity-50",
        disabled: "[&>button]:cursor-not-allowed [&>button]:opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}
