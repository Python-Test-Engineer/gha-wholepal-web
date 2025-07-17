// import clsx from "clsx/lite";
import {
  RadioGroup as RootRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
// import { cn } from "@/lib/utils";

const RadioGroup = <T extends FieldValues>({
  control,
  name,
  value,
  options,
  onChange,
}: {
  name: Path<T>;
  control: Control<T>;
  value?: PathValue<T, Path<T>>;
  options: App.SelectItem[];
  onChange?: (value: string) => void;
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: value,
  });

  const handleChange = (value: string) => {
    field.onChange(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <RootRadioGroup value={field.value} onValueChange={handleChange}>
      {map(options, (option, index) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem id={`r${index + 1}`} value={option.value} />
          <label
            htmlFor={`r${index + 1}`}
            className="block text-muted-foreground cursor-pointer"
          >
            {option.label}
          </label>
        </div>
      ))}
    </RootRadioGroup>
  );
};

export default RadioGroup;
