"use client";

import { Scrollbars } from "react-custom-scrollbars-2";
import { motion } from "framer-motion";
import { ProductInfoTabEnum } from "@/enums/product";
import ProductDatapoint from "@/components/form-ui/product-datapoint";
import useProduct from "@/hooks/use-product";

const ProductInfo: FunctionComponent<{
  type: ProductInfoTabEnum;
  control: Control;
  schema: ProductManagement.ProductCategory[];
  scrollRef: Ref<Scrollbars>;
}> = ({ type, control, schema, scrollRef }) => {
  const t = useTranslations();
  const { getCategoryTileByType } = useProduct();
  const productCategory = find(schema, { key: type });

  const renderFields = (
    fields: ProductManagement.ProductDataPoint[]
  ): React.JSX.Element => {
    if (!isEmpty(fields)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {map(fields, (field: ProductManagement.ProductDataPoint) => (
            <ProductDatapoint
              key={field.label}
              control={control}
              field={field}
            />
          ))}
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
            <div key={subCategory.key} className="flex flex-col gap-3">
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
    <Scrollbars ref={scrollRef} key={type} autoHeight autoHeightMin={350}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col gap-6 p-1"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold">{getCategoryTileByType(type)}</h3>
          <p>
            {t("fill_out_for_your_product", {
              category: getCategoryTileByType(type),
            })}
          </p>
        </div>
        {renderContent()}
      </motion.div>
    </Scrollbars>
  );
};

export default ProductInfo;
