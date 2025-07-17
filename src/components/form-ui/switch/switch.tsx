import clsx from "clsx/lite";
import { Switch as RadixSwitch } from "@/components/ui/switch";
import { switchStyles } from "./styled";
import { cn } from "@/lib/utils";

const Switch = <T extends FieldValues>({
  control,
  name,
  value,
  label,
  disabled,
  readOnly,
  showLabel,
  onChange,
}: {
  name: Path<T>;
  control: Control<T>;
  value?: PathValue<T, Path<T>>;
  label?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  showLabel?: boolean;
  onChange?: (value: boolean) => void;
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: value,
  });

  const handleChange = (value: boolean) => {
    field.onChange(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <RadixSwitch
        id={name}
        name={name}
        checked={field.value}
        disabled={disabled}
        className={cn(switchStyles({ readOnly }))}
        onCheckedChange={handleChange}
      />
      {showLabel && (
        <label
          htmlFor={name}
          className={clsx(
            "block text-muted-foreground capitalize",
            readOnly && "pointer-events-none"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;
