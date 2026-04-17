"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  label: string;
  placeholder: string;
  selected: Date | undefined;
  onSelect: Dispatch<SetStateAction<Date | undefined>>;
};

const DateInput = ({ label, placeholder, selected, onSelect }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Field className="mx-auto w-full">
      <FieldLabel htmlFor="date-picker">{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-full justify-between font-normal"
          >
            <span className="flex items-center">
              <CalendarIcon className="mr-2" />
              {selected ? selected.toLocaleDateString() : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(e) => {
              onSelect(e);
              setOpen(false);
            }}
            defaultMonth={selected}
            captionLayout="dropdown"
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DateInput;
