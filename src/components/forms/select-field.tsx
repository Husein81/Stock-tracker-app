import { Label } from "@/components/ui/label";
import { Shad } from "@/components";
import { FieldInfo } from "./field-info";

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  field,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Shad.Select
        value={field?.state.value}
        onValueChange={field?.handleChange}
      >
        <Shad.SelectTrigger className="select-trigger">
          <Shad.SelectValue placeholder={placeholder} />
        </Shad.SelectTrigger>
        <Shad.SelectContent>
          {options.map((option) => (
            <Shad.SelectItem
              key={option.value}
              value={option.value}
              className="focus:bg-gray-600 focus:text-white"
            >
              {option.label}
            </Shad.SelectItem>
          ))}
        </Shad.SelectContent>
        {field && <FieldInfo field={field} />}
      </Shad.Select>
    </div>
  );
};
export default SelectField;
