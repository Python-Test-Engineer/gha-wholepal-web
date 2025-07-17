"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ProductFileTypeEnum, ProductInfoTabEnum } from "@/enums/product";
import ProductDatapoint from "@/components/form-ui/product-datapoint";
import Input from "@/components/form-ui/input";
import { Check, Info, Paperclip } from "lucide-react";
import FileUpload from "../file-upload";
import { ACCEPT_FILE } from "@/config/constants";

const ProductInfo: FunctionComponent<{
  schema: ProductManagement.ProductCategory[];
  product: ProductManagement.Product;
  control: Control;
  type: ProductInfoTabEnum;
  readOnly: boolean;
  isSupplier: boolean;
  showWholesalerProductCode: boolean;
  handleUpdateProductCode: () => void;
  handleUpdateWholesalerProductCode: () => void;
  handleUploadCertification: (files: File[]) => void;
}> = ({
  schema,
  product,
  control,
  type,
  readOnly,
  isSupplier,
  showWholesalerProductCode,
  handleUpdateProductCode,
  handleUpdateWholesalerProductCode,
  handleUploadCertification,
}) => {
  const t = useTranslations();
  const productCategory = find(schema, { key: type });
  const { downloadFileMutation } = useDownloadFile();

  const renderLabel = (label: string, name: string): React.JSX.Element => (
    <div className="flex items-center">
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

  const renderProductCode = (): React.JSX.Element => (
    <>
      {showWholesalerProductCode && (
        <Input
          control={control}
          name="wholesalerProductCode"
          label={renderLabel(
            t("wholesaler_product_code"),
            "wholesalerProductCode"
          )}
        />
      )}
      {/* <Input
        control={control}
        name="productCode"
        label={renderLabel(t("product_code"), "productCode")}
        readOnly={!isSupplier}
        onBlur={handleUpdateProductCode}
      /> */}
    </>
  );

  const renderProductCertification = (): React.JSX.Element => {
    const filtered = filter(get(product, "files"), {
      type: ProductFileTypeEnum.PRODUCT_CERTIFICATION,
    });
    const ordered = orderBy(filtered, ["createdAt"], ["desc"]);
    const productCertification = head(ordered);
    return (
      <div className="flex flex-col gap-2">
        <FileUpload
          control={control}
          name="productCertification"
          label={t("product_certification")}
          acceptFile={ACCEPT_FILE.PRODUCT_CERTIFICATION}
          readOnly={!isSupplier}
          onChange={handleUploadCertification}
        />
        {productCertification && (
          <div
            className="flex items-center gap-2 text-primary cursor-pointer hover:underline break-all"
            onClick={() =>
              downloadFileMutation.mutate({
                url: productCertification.url,
                fileName: productCertification.name,
              })
            }
          >
            <Paperclip className="w-4 h-4" />
            {productCertification.name}
          </div>
        )}
      </div>
    );
  };

  const renderFields = (
    fields: ProductManagement.ProductDataPoint[]
  ): React.JSX.Element => {
    if (!isEmpty(fields)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [&_input[name=wholesalerProductCode]]:bg-white [&_input[name=wholesalerProductCode]]:border">
          {map(fields, (field: ProductManagement.ProductDataPoint) => {
            const isCategory = field.key === "category";
            const isCommodityCode = field.key === "commodity_code";
            if (isCategory) {
              return (
                <React.Fragment key={field.fieldId}>
                  <ProductDatapoint
                    key={field.fieldId}
                    control={control}
                    field={field}
                    readOnly={readOnly}
                  />
                  {renderProductCode()}
                </React.Fragment>
              );
            }
            if (isCommodityCode) {
              return (
                <React.Fragment key={field.fieldId}>
                  <ProductDatapoint
                    key={field.fieldId}
                    control={control}
                    field={field}
                    readOnly={readOnly}
                  />
                  {renderProductCertification()}
                </React.Fragment>
              );
            }
            return (
              <ProductDatapoint
                key={field.fieldId}
                control={control}
                field={field}
                readOnly={readOnly}
              />
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderContent = (): React.JSX.Element => {
    if (!isEmpty(productCategory.children)) {
      return (
        <>
          {map(productCategory.children, (subCategory) => (
            <div key={subCategory.key} className="flex flex-col gap-6">
              <p className="font-semibold">{subCategory.label}</p>
              {renderFields(get(subCategory, "fields", []))}
            </div>
          ))}
        </>
      );
    }

    return renderFields(get(productCategory, "fields", []));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-card rounded-lg flex flex-col gap-6"
    >
      {renderContent()}
    </motion.div>
  );
};

export default ProductInfo;
