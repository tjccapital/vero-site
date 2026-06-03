"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// shadcn-style wrapper around react-day-picker (v10). All layout/colour is
// driven by Tailwind classNames here so we don't depend on the library's
// default stylesheet, and everything uses the app's CSS variables.
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "relative flex h-7 items-center justify-center",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
        button_previous:
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-transparent p-0 opacity-60 transition-opacity hover:bg-[var(--muted)] hover:opacity-100 disabled:opacity-30",
        button_next:
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-transparent p-0 opacity-60 transition-opacity hover:bg-[var(--muted)] hover:opacity-100 disabled:opacity-30",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-[0.8rem] font-normal text-[var(--muted-foreground)]",
        week: "mt-1 flex w-full",
        day: "relative p-0 text-center text-sm",
        day_button:
          "inline-flex h-9 w-9 items-center justify-center rounded-md p-0 font-normal transition-colors hover:bg-[var(--muted)]",
        today: "[&>button]:font-semibold",
        selected: "[&>button]:bg-[var(--primary)] [&>button]:text-white [&>button:hover]:bg-[var(--primary)]",
        range_start:
          "rounded-l-md bg-[var(--primary)]/10",
        range_end: "rounded-r-md bg-[var(--primary)]/10",
        range_middle:
          "bg-[var(--primary)]/10 [&>button]:!bg-transparent [&>button]:!text-[var(--foreground)] [&>button:hover]:!bg-[var(--primary)]/20",
        outside: "[&>button]:text-[var(--muted-foreground)] [&>button]:opacity-50",
        disabled: "[&>button]:opacity-30 [&>button]:pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevClassName }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", chevClassName)} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", chevClassName)} />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
