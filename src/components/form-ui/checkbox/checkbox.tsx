"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ITEM_VARIANTS } from "@/config/constants";
import { Checkbox as RadixCheckbox } from "@/components/ui/checkbox";
import MessageError from "@/components/form-ui/message-error";
import { CheckedState } from "@radix-ui/react-checkbox";

interface CheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  value?: PathValue<T, Path<T>>;
  rules?: RegisterOptions<T>;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
  onChange?: (value?: CheckedState) => void;
}

const Checkbox = <T extends FieldValues>({
  name,
  control,
  value,
  rules,
  label,
  disabled = false,
  className,
  onChange = () => null,
}: CheckboxProps<T>) => {
  const { field, formState } = useController({
    name,
    rules,
    control,
    defaultValue: value,
  });
  const errors = get(formState, "errors", {});
  const isError = Boolean(get(errors, name));

  const handleChange = (checked: CheckedState): void => {
    field.onChange(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <motion.div
      variants={ITEM_VARIANTS}
      className={cn("flex flex-col", className)}
    >
      <div className="flex items-center gap-3">
        <RadixCheckbox
          id={name}
          name={name}
          checked={field.value}
          onCheckedChange={handleChange}
          disabled={disabled}
        />
        {label && (
          <label
            htmlFor={name}
            className="block text-muted-foreground cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
      {isError && <MessageError errors={errors} name={name} />}
    </motion.div>
  );
};

Checkbox.displayName = "Checkbox";

export default Checkbox;
