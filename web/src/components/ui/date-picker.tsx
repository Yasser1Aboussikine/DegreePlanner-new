import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  fromYear?: number;
  toYear?: number;
}

export const DatePicker = ({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  error = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal h-10 px-3",
            "bg-background border-input hover:bg-accent hover:text-accent-foreground",
            !date && "text-muted-foreground",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
        >
          {date ? (
            <span className="truncate">{format(date, "MMMM d, yyyy")}</span>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
          <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(selectedDate) => {
            onDateChange(selectedDate);
            setOpen(false);
          }}
          disabled={disabled}
          fromYear={fromYear}
          toYear={toYear}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
};

import * as React from "react";
