"use client";

import * as React from "react";
import clsx from "clsx/lite";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ITEM_VARIANTS } from "@/config/constants";
import { InputTypeEnum } from "@/enums/app";
import MessageError from "@/components/form-ui/message-error";
import { inputStyles } from "./styles";

interface InputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  value?: PathValue<T, Path<T>>;
  rules?: RegisterOptions<T>;
  type?: InputTypeEnum;
  placeholder?: string;
  label?: ReactNode;
  size?: "medium" | "large";
  disabled?: boolean;
  readOnly?: boolean;
  bordered?: boolean;
  prefixIcon?: ReactElement<SVGElement>;
  suffixIcon?: ReactElement<SVGElement>;
  textareaRef?: Ref<HTMLTextAreaElement>;
  rows?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value?: string) => void;
}

const Textarea = <T extends FieldValues>({
  name,
  control,
  value,
  rules,
  placeholder,
  label,
  size = "medium",
  disabled = false,
  readOnly = false,
  bordered = false,
  textareaRef,
  rows = 5,
  onBlur = () => null,
  onFocus = () => null,
  onChange = () => null,
}: InputProps<T>) => {
  const { field, formState } = useController({
    name,
    rules,
    control,
    defaultValue: value,
  });
  const errors = get(formState, "errors", {});
  const isError = Boolean(get(errors, name));

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    field.onChange(event);
    onChange(event.target.value);
  };

  const handleBlur = (): void => {
    field.onBlur();
    onBlur();
  };

  const renderInput = (): React.JSX.Element => (
    <textarea
      className={cn(
        inputStyles({
          size,
          disabled,
          readOnly,
          isError,
          bordered,
        })
      )}
      ref={textareaRef}
      value={field.value}
      name={name}
      id={name}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      onFocus={onFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );

  return (
    <motion.div variants={ITEM_VARIANTS} className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            "block text-muted-foreground mb-2 capitalize",
            readOnly && "pointer-events-none"
          )}
        >
          {label}
        </label>
      )}
      {renderInput()}
      {isError && <MessageError errors={errors} name={name} />}
    </motion.div>
  );
};

Textarea.displayName = "Textarea";

export default Textarea;
