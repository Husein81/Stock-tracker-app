"use client";
import React from "react";
import { Label, Input, Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FieldInfo } from "./field-info";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  field,
  disabled,
}: FormInputProps) => {
  const [show, setShow] = React.useState(false);
  const isPass = type === "password";
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <div className="relative">
        <Input
          type={isPass && show ? "text" : type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          value={field?.state.value}
          onChange={(e) => field?.handleChange(e.target.value)}
          className={cn("form-input", {
            "opacity-50 cursor-not-allowed": disabled,
          })}
        />
        {isPass && (
          <Icon
            name={show ? "Eye" : "EyeOff"}
            onClick={() => setShow(!show)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
      {field && <FieldInfo field={field} />}
    </div>
  );
};
export default InputField;
