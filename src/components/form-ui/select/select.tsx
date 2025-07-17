"use client";

import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageError from "@/components/form-ui/message-error";
import { triggerStyles, itemStyles } from "./styles";

interface SelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  value?: PathValue<T, Path<T>>;
  rules?: RegisterOptions<T>;
  options: App.SelectItem[];
  size?: "medium" | "large";
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  triggerClassName?: string;
  containerClassName?: string;
  onChange?: (value?: string) => void;
}

const Select = <T extends FieldValues>({
  name,
  control,
  value,
  rules,
  options = [],
  size = "medium",
  label,
  placeholder,
  disabled = false,
  readOnly = false,
  triggerClassName,
  containerClassName,
  onChange = () => null,
}: SelectProps<T>) => {
  const { field, formState } = useController({
    name,
    control,
    rules,
    defaultValue: value,
  });
  const errors = get(formState, "errors", {});
  const isError = Boolean(get(errors, name));

  const handleChange = (value: string): void => {
    field.onChange(value);
    onChange(value);
  };

  const renderTrigger = (): ReactNode => {
    if (isNull(field.value) || isUndefined(field.value)) {
      return <span>{placeholder}</span>;
    }
    if (Boolean(field.value)) {
      return includes(map(options, "value"), field.value) ? (
        <RadixSelect.Value placeholder={placeholder} />
      ) : (
        <span>{field.value}</span>
      );
    }

    return <RadixSelect.Value placeholder={placeholder} />;
  };

  return (
    <div className={cn("flex flex-col", containerClassName)}>
      {label && (
        <label htmlFor={name} className="block text-muted-foreground mb-2">
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={field.value}
        disabled={disabled || readOnly}
        onValueChange={handleChange}
      >
        <RadixSelect.Trigger
          className={cn(
            triggerStyles({ size, disabled, isError }),
            triggerClassName
          )}
        >
          {renderTrigger()}
          <RadixSelect.Icon>
            <ChevronDown className="text-muted-foreground w-5 h-5" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          position="popper"
          sideOffset={5}
          className="z-50 bg-white overflow-hidden rounded-md shadow-md min-w-[var(--radix-select-trigger-width)]"
        >
          <RadixSelect.Viewport className="p-3">
            {map(options, (option: App.SelectItem) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(itemStyles())}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check className="h-5 w-5 text-green-500" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Root>

      {isError && <MessageError errors={errors} name={name} />}
    </div>
  );
};

Select.displayName = "Select";

export default Select;
