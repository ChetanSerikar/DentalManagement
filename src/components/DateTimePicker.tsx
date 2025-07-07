"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  label?: string;
  value?: string; // ISO string
  onChange: (iso: string) => void;
}

export function DateTimePicker({
  label = "Appointment",
  value,
  onChange,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState("10:30:00");
  const prevISO = React.useRef<string | null>(null);

  // Set initial value only if it changes
  React.useEffect(() => {
    if (!value || value === prevISO.current) return;

    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      prevISO.current = value;
      setDate(parsed);
      setTime(parsed.toTimeString().slice(0, 8)); // HH:mm:ss
    }
  }, [value]);

  // Emit combined ISO string when user picks date/time
  React.useEffect(() => {
    if (!date || !time) return;

    const datePart = date.toISOString().split("T")[0];
    const combined = new Date(`${datePart}T${time}`).toISOString();

    if (combined !== prevISO.current) {
      prevISO.current = combined;
      onChange(combined);
    }
  }, [date, time]);

  return (
    <div className="flex gap-4">
      {/* Date Picker */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-picker" className="text-sm font-medium">
          {label} Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-36 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => {
                if (d) setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="time-picker" className="text-sm font-medium">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-28 bg-background appearance-none"
        />
      </div>
    </div>
  );
}
