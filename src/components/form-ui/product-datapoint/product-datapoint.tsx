"use client";

import clsx from "clsx/lite";
import { Info } from "lucide-react";
import InputNumber from "@/components/form-ui/input-number";
import Input from "@/components/form-ui/input";
import Textarea from "@/components/form-ui/textarea";
import Select from "@/components/form-ui/select";
import Switch from "@/components/form-ui/switch";
import { FieldTypeEnum, DataInputTypeEnum } from "@/enums/product";
import { InputTypeEnum } from "@/enums/app";
import { MAIN_FIELD_KEYS } from "@/config/constants";
import { values } from "lodash-es";

const ProductDatapoint = <T extends FieldValues>({
  control,
  field,
  readOnly = false,
}: {
  control: Control<T>;
  field: ProductManagement.ProductDataPoint;
  readOnly?: boolean;
}) => {
  const t = useTranslations();
  const { label, type, showUnits, fieldType, fieldId, units, key } = field;
  const name = fieldId as Path<T>;
  const mainFields = values(MAIN_FIELD_KEYS);
  const required = includes(mainFields, key);

  const renderLabel = (hasMargin = false): React.JSX.Element => (
    <div className={clsx("flex items-center", hasMargin && "mb-2")}>
      <label
        htmlFor={name}
        className={clsx(
          "block text-muted-foreground capitalize",
          readOnly && "pointer-events-none"
        )}
      >
        {label}
      </label>
      <Info className="h-4 w-4 text-muted-foreground ml-2" />
    </div>
  );

  const renderUnits = (): ReactNode => {
    if (showUnits) {
      return (
        <Select
          control={control}
          name={`${name}Unit` as Path<T>}
          options={map(units, (value) => ({ label: value, value }))}
          triggerClassName="w-[100px]"
          readOnly={readOnly}
          rules={{
            required: required
              ? t("field_required", { field: t("unit") })
              : false,
          }}
        />
      );
    }
    return null;
  };

  if (type === DataInputTypeEnum.NUMBER) {
    return (
      <div>
        {renderLabel(true)}
        <div className="flex gap-2">
          <div className="flex-1">
            <InputNumber
              control={control}
              name={name}
              readOnly={readOnly}
              rules={{
                required: required
                  ? t("field_required", { field: label })
                  : false,
              }}
            />
          </div>
          {renderUnits()}
        </div>
      </div>
    );
  }

  if (type === DataInputTypeEnum.FILE) {
    return (
      <Input
        control={control}
        name={name}
        type={InputTypeEnum.FILE}
        label={renderLabel()}
        readOnly={readOnly}
      />
    );
  }

  if (type === DataInputTypeEnum.BOOLEAN) {
    return (
      <Switch
        control={control}
        name={name}
        value={false as PathValue<T, Path<T>>}
        showLabel
        label={renderLabel()}
        readOnly={readOnly}
      />
    );
  }

  if (type === DataInputTypeEnum.TEXT && fieldType === FieldTypeEnum.MULTIPLE) {
    return (
      <Textarea
        control={control}
        name={name}
        label={renderLabel()}
        readOnly={readOnly}
        rules={{
          required: required ? t("field_required", { field: label }) : false,
        }}
      />
    );
  }

  return (
    <Input
      control={control}
      name={name}
      label={renderLabel()}
      readOnly={readOnly}
      rules={{
        required: required ? t("field_required", { field: label }) : false,
      }}
    />
  );
};

export default ProductDatapoint;
