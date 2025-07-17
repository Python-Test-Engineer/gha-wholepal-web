import { toString } from "lodash-es";
import { DataInputTypeEnum, ProductInfoTabEnum } from "@/enums/product";

const useProduct = () => {
  const t = useTranslations();

  const stringToBoolean = (string: string): boolean => {
    return includes(["true", "1", "yes", "on"], toLower(trim(string)));
  };

  const parseDatapointValue = (input: string): string => {
    try {
      const parsed = JSON.parse(input);
      if (isNumber(parsed)) {
        return input;
      }
      if (
        every(
          parsed,
          (item) => isArray(item) && item.length === 2 && isString(item[0])
        )
      ) {
        // Handle array of [string, number] pairs
        return map(parsed, ([name, value]) => `${name}: ${value}`).join("\n");
      }
      if (every(parsed, isString)) {
        // Handle array of strings
        return join(parsed, "\n");
      }

      return input;
    } catch (error) {
      return input;
    }
  };

  const getProductDatapointValue = (
    datapoint: ProductManagement.ProductDataPoint,
    schemaItems: ProductManagement.SchemaItem[]
  ): Record<string, string | number | boolean> => {
    const item = find(schemaItems, { id: datapoint.fieldId });
    if (item) {
      if (datapoint.type === DataInputTypeEnum.BOOLEAN) {
        return {
          [datapoint.fieldId]: item.value
            ? stringToBoolean(item.value as string)
            : false,
        };
      }
      if (datapoint.type === DataInputTypeEnum.NUMBER) {
        let data: Record<string, string | number | boolean> = {
          [datapoint.fieldId]: item.value,
        };
        if (datapoint.showUnits) {
          data = {
            ...data,
            [`${datapoint.fieldId}Unit`]: item.unit,
          };
        }
        return data;
      }
      if (datapoint.type === DataInputTypeEnum.TEXT) {
        return {
          [datapoint.fieldId]: parseDatapointValue(item.value as string),
        };
      }
      return { [datapoint.fieldId]: "" };
    }
    return { [datapoint.fieldId]: "" };
  };

  const getCategoryTileByType = (step: ProductInfoTabEnum): string => {
    const stepLabels = {
      [ProductInfoTabEnum.LINE_DETAILS]: t("line_details"),
      [ProductInfoTabEnum.NUTRITION_VALUES]: t("nutrition_values"),
      [ProductInfoTabEnum.PRODUCT_SPECIFICATIONS]: t("product_specifications"),
      [ProductInfoTabEnum.DIETARY_INFO]: t("dietary_info"),
      [ProductInfoTabEnum.PRICING]: t("pricing"),
    };
    return get(stepLabels, step, null);
  };

  const getSchemaItem = (
    formValue: FieldValues
  ): ProductManagement.SchemaItem[] =>
    map(
      filter(
        keys(formValue),
        (key) =>
          !key.endsWith("Unit") &&
          key !== "productCode" &&
          key !== "wholesalerProductCode"
      ),
      (key) => ({
        id: key,
        value: toString(formValue[key]),
        ...(formValue[`${key}Unit`] && { unit: formValue[`${key}Unit`] }),
      })
    );

  return {
    getProductDatapointValue,
    getCategoryTileByType,
    getSchemaItem,
  };
};

export default useProduct;
