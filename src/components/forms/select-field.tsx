import { Label } from "@/components/ui/label";
import { Shad } from "@/components";
import { FieldInfo } from "./field-info";

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  field,
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
          <Shad.SelectValue
            placeholder={placeholder}
            className="placeholder:text-gray-600"
          />
        </Shad.SelectTrigger>
        <Shad.SelectContent className="bg-gray-700">
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
      </Shad.Select>
      {field && <FieldInfo field={field} />}
    </div>
  );
};
export default SelectField;
