"use client";
import { useState } from "react";
import countryList from "react-select-country-list";
import { Button, Icon, Label, Shad } from "../ui";
import { cn } from "@/lib/utils";
import { FieldInfo } from "./field-info";

const CountrySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const countries = countryList().getData();
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };
  return (
    <Shad.Popover open={open} onOpenChange={setOpen}>
      <Shad.PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="country-select-trigger"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <span>{getFlagEmoji(value)}</span>
              <span>{countries.find((c) => c.value === value)?.label}</span>
            </span>
          ) : (
            "Select your country..."
          )}
          <Icon
            name="ChevronDown"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </Shad.PopoverTrigger>
      <Shad.PopoverContent
        className="w-full p-0 bg-gray-800 border-gray-600"
        align="start"
      >
        <Shad.Command className="bg-gray-800 border-gray-600">
          <Shad.CommandInput
            placeholder="Search countries..."
            className="country-select-input"
          />
          <Shad.CommandEmpty className="country-select-empty">
            No Country Found.
          </Shad.CommandEmpty>
          <Shad.CommandList>
            <Shad.CommandGroup className="bg-gray-800">
              {countries.map((country) => (
                <Shad.CommandItem
                  key={country.value}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="country-select-item"
                >
                  <Icon
                    name="Check"
                    className={cn(
                      "size-4 mr-2 text-yellow-500 opacity-0 shrink-0",
                      value === country.value && "opacity-100"
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <span>{getFlagEmoji(country.value)}</span>
                    <span>{country.label}</span>
                  </span>
                </Shad.CommandItem>
              ))}
            </Shad.CommandGroup>
          </Shad.CommandList>
        </Shad.Command>
      </Shad.PopoverContent>
    </Shad.Popover>
  );
};

const CountryField = ({ label, field }: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field?.name} className="form-label">
        {label}
      </Label>
      <CountrySelect
        value={field?.state.value}
        onChange={(val) => {
          field?.handleChange(val);
        }}
      />
      {field && <FieldInfo field={field} />}
      <p className="text-xs text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
};

export default CountryField;
