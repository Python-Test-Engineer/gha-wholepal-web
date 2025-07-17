"use client";

import * as React from "react";
import clsx from "clsx/lite";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEM_VARIANTS, KEY_CODE } from "@/config/constants";
import { InputTypeEnum } from "@/enums/app";
import MessageError from "@/components/form-ui/message-error";
import { inputStyles, iconStyles } from "./styles";

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
  inputRef?: Ref<HTMLInputElement>;
  containerClassName?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value?: string) => void;
  onKeyDown?: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
}

const Input = <T extends FieldValues>({
  name,
  control,
  value,
  rules,
  type = InputTypeEnum.TEXT,
  placeholder,
  label,
  size = "medium",
  disabled = false,
  readOnly = false,
  bordered = false,
  prefixIcon,
  suffixIcon,
  inputRef,
  containerClassName,
  onBlur = () => null,
  onFocus = () => null,
  onChange = () => null,
  onKeyDown = () => null,
}: InputProps<T>) => {
  const { field, formState } = useController({
    name,
    rules,
    control,
    defaultValue: value,
  });
  const [inputType, setInputType] = useState(type);
  const isPasswordField = type === InputTypeEnum.PASSWORD;
  const showPassword = inputType === InputTypeEnum.PASSWORD;
  const errors = get(formState, "errors", {});
  const isError = Boolean(get(errors, name));

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    field.onChange(event);
    onChange(event.target.value);
  };

  const handleBlur = (): void => {
    field.onBlur();
    onBlur();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    onKeyDown(event);
    if (isPasswordField && event.code === KEY_CODE.SPACE) {
      event.preventDefault();
    }
  };

  const toggleShowPassword = (
    event: ReactMouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    setInputType((prev) =>
      prev === InputTypeEnum.PASSWORD
        ? InputTypeEnum.TEXT
        : InputTypeEnum.PASSWORD
    );
  };

  const renderInput = (): React.JSX.Element => (
    <input
      type={inputType}
      className={cn(
        inputStyles({
          size,
          disabled,
          readOnly,
          hasPrefixIcon: Boolean(prefixIcon),
          hasSuffixIcon: isPasswordField,
          isError,
          bordered,
          isFile: type === InputTypeEnum.FILE,
        })
      )}
      ref={inputRef}
      value={field.value || ""}
      name={name}
      id={name}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete="off"
      onFocus={onFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );

  const renderSuffixIcon = (): ReactNode => {
    if (isPasswordField) {
      const PasswordIcon = showPassword ? Eye : EyeOff;
      return (
        <PasswordIcon
          className={cn(iconStyles({ size, position: "right", cursor: true }))}
          onClick={toggleShowPassword}
        />
      );
    }

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
    const hasIcon =
      Boolean(prefixIcon) || isPasswordField || Boolean(suffixIcon);
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
    <motion.div
      variants={ITEM_VARIANTS}
      className={cn("flex flex-col", containerClassName)}
    >
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

Input.displayName = "Input";

export default Input;
