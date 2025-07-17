import { toast } from "react-hot-toast";
import { StatusCodeEnum } from "@/enums/app";
import { getMessageErrors } from "@/utils/helpers";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/config/constants";

const useFormValidator = <FieldValues>() => {
  const t = useTranslations();

  const validateEmptyValue = (value: string): string | boolean =>
    trim(value) !== "" || t("no_spaces_allowed");

  const getRules = (options?: {
    isEmail?: Boolean;
    isRequired?: Boolean;
    isPassword?: Boolean;
    minLength?: number;
    maxLength?: number;
  }): RegisterOptions<FieldValues> => {
    const {
      isEmail,
      isPassword,
      isRequired = true,
      minLength = 0,
      maxLength = 255,
    } = options || {};
    const rules: RegisterOptions<FieldValues> = {};
    if (isRequired) {
      rules.required = t("field_required");
      rules.validate = {
        value: (value) => validateEmptyValue(value as string),
      };
    }
    if (maxLength) {
      rules.maxLength = {
        value: maxLength,
        message: t("invalid_max_length", { max: maxLength }),
      };
    }
    if (minLength) {
      rules.maxLength = {
        value: minLength,
        message: t("invalid_min_length", { min: minLength }),
      };
    }
    if (isEmail) {
      rules.pattern = {
        value: EMAIL_REGEX,
        message: t("invalid_email_format"),
      };
    } else if (isPassword) {
      rules.pattern = { value: PASSWORD_REGEX, message: t("password_rules") };
    }
    return rules;
  };

  const handleResponseError = <FieldValues>(
    error: App.ResponseError,
    setError: UseFormSetError<FieldValues>
  ) => {
    if (error.status === StatusCodeEnum.ValidationFailed) {
      const errors = getMessageErrors(error.errors);
      forEach(errors, ({ field, message }) =>
        setError(field as Path<FieldValues>, { message })
      );
    } else {
      toast.error(error.message);
    }
  };

  return { handleResponseError, getRules };
};

export default useFormValidator;
