"use client";

import * as React from "react";
import clsx from "clsx/lite";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEM_VARIANTS } from "@/config/constants";
import { InputTypeEnum } from "@/enums/app";
import MessageError from "@/components/form-ui/message-error";
import { inputStyles, iconStyles } from "./styles";

interface InputNumberProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  value?: PathValue<T, Path<T>>;
  rules?: RegisterOptions<T>;
  placeholder?: string;
  label?: ReactNode;
  size?: "medium" | "large";
  disabled?: boolean;
  readOnly?: boolean;
  bordered?: boolean;
  prefixIcon?: ReactElement<SVGElement>;
  suffixIcon?: ReactElement<SVGElement>;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value?: number) => void;
  onKeyDown?: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
}

const InputNumber = <T extends FieldValues>({
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
  prefixIcon,
  suffixIcon,
  inputRef,
  onBlur = () => null,
  onFocus = () => null,
  onChange = () => null,
}: InputNumberProps<T>) => {
  const { field, formState } = useController({
    name,
    rules,
    control,
    defaultValue: value,
  });
  const errors = get(formState, "errors", {});
  const isError = Boolean(get(errors, name));

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      const newValue = value === "" ? undefined : parseInt(value, 10);
      field.onChange(event);
      onChange(newValue);
    }
  };

  const handleBlur = (): void => {
    field.onBlur();
    onBlur();
  };

  const renderInput = (): React.JSX.Element => (
    <input
      type={InputTypeEnum.TEXT}
      className={cn(
        inputStyles({
          size,
          disabled,
          readOnly,
          hasPrefixIcon: Boolean(prefixIcon),
          hasSuffixIcon: Boolean(suffixIcon),
          isError,
          bordered,
        })
      )}
      ref={inputRef}
      value={field.value || ""}
      name={name}
      id={name}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      onFocus={onFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );

  const renderSuffixIcon = (): ReactNode => {
    if (suffixIcon) {
      return React.cloneElement(suffixIcon, {
        className: cn(
          iconStyles({ size, position: "right" }),
          suffixIcon.props.className
        ),
      });
    }

    if (field.value && !isError) {
      return (
        <Check
          className={cn(iconStyles({ size, position: "right", isCheck: true }))}
        />
      );
    }

    return null;
  };

  const renderContent = (): React.JSX.Element => {
    const hasIcon = Boolean(prefixIcon) || Boolean(suffixIcon);
    if (hasIcon) {
      return (
        <div className="relative">
          {prefixIcon &&
            React.cloneElement(prefixIcon, {
              className: cn(
                iconStyles({ size, position: "left" }),
                prefixIcon.props.className
              ),
            })}
          {renderInput()}
          {renderSuffixIcon()}
        </div>
      );
    }
    return renderInput();
  };

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
      {renderContent()}
      {isError && <MessageError errors={errors} name={name} />}
    </motion.div>
  );
};

InputNumber.displayName = "InputNumber";

export default InputNumber;
