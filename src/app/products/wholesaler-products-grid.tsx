"use client";

import { Scrollbars } from "react-custom-scrollbars-2";
import { Loader2 } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import Checkbox from "@/components/form-ui/checkbox";
import { motion } from "framer-motion";
import { ProductFileTypeEnum } from "@/enums/product";
import { isScrolledToBottom } from "@/utils/helpers";
import WholesalerProductCode from "./wholesaler-product-code";

const WholeSalerProductsGrid: FunctionComponent<{
  productInfinityListQuery: UseInfiniteQueryResult<
    App.ListItem<ProductManagement.Product>
  >;
  setSelectedProductIds: Dispatch<SetStateAction<string[]>>;
}> = ({ productInfinityListQuery, setSelectedProductIds }) => {
  const t = useTranslations();
  const { control, getValues } = useForm();

  const products = useMemo<ProductManagement.Product[]>(
    () =>
      reduce(
        get(productInfinityListQuery.data, "pages", []),
        (acc, { items }) => [...acc, ...items],
        []
      ),
    [productInfinityListQuery.data]
  );

  const onCheckboxChange = (): void => {
    const values = getValues();
    const checked = omitBy(values, (item) => !item);
    setSelectedProductIds(keys(checked));
  };

  const onScrollbarUpdate = (values: App.ScrollValue): void => {
    const { clientHeight, scrollTop, scrollHeight } = values;
    const isAtBottom = isScrolledToBottom({
      clientHeight,
      scrollTop,
      scrollHeight,
    });
    if (
      isAtBottom &&
      productInfinityListQuery.hasNextPage &&
      !productInfinityListQuery.isFetchingNextPage
    ) {
      productInfinityListQuery.fetchNextPage();
    }
  };

  if (productInfinityListQuery.isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          {t("loading_product")}
        </span>
      </div>
    );
  }

  if (isEmpty(products)) {
    return (
      <div className="flex justify-center items-center p-12">
        <span className="ml-3 text-muted-foreground">
          {t("empty_product_version")}
        </span>
      </div>
    );
  }

  const renderProductInfo = (
    product: ProductManagement.Product
  ): React.JSX.Element => (
    <>
      <p className="text-muted-foreground">
        {t.rich("name_with_colon", {
          tag: (chunk) => <span className="font-bold">{chunk}</span>,
          name: product.name || "-",
          nameTag: (chunk) => (
            <Link
              href={`/product-versions/${product.productVersionId}`}
              className="text-primary hover:underline"
            >
              {chunk}
            </Link>
          ),
        })}
      </p>
      <p className="text-muted-foreground">
        {t.rich("size_with_colon", {
          tag: (chunk) => <span className="font-bold">{chunk}</span>,
          size: product.size || "-",
        })}
      </p>
      <p className="text-muted-foreground">
        {t.rich("category_with_colo_value", {
          tag: (chunk) => <span className="font-bold">{chunk}</span>,
          category: product.category || "-",
        })}
      </p>
      <p className="text-muted-foreground">
        {t.rich("barcode_with_colon", {
          tag: (chunk) => <span className="font-bold">{chunk}</span>,
          barcode: product.caseBarcode || "-",
        })}
      </p>
      <p className="text-muted-foreground">
        {t.rich("supplier_pc_with_colon", {
          tag: (chunk) => <span className="font-bold">{chunk}</span>,
          productCode: product.skuCode || "-",
        })}
      </p>
      <div className="text-muted-foreground">
        <span className="font-bold flex items-center gap-2 flex-wrap">
          Wholesaler PC:
          <WholesalerProductCode
            product={product}
            refetch={productInfinityListQuery.refetch}
          />
        </span>
      </div>
    </>
  );

  const renderProduct = (
    product: ProductManagement.Product
  ): React.JSX.Element => {
    const orderedFiles = orderBy(product.files, ["createdAt"], ["desc"]);
    const primaryImage = find(orderedFiles, {
      type: ProductFileTypeEnum.PRIMARY_IMAGE,
    });
    const primaryImageUrl = get(primaryImage, "url");
    const key = `${product.id}-${product.status}`;
    return (
      <div
        key={key}
        className="flex flex-col gap-2 p-4 bg-card rounded-lg h-fit relative group"
      >
        <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
          {primaryImageUrl ? (
            <img
              src={primaryImageUrl}
              alt={product.name}
              width={200}
              height={200}
              className="object-contain max-h-[90%]"
            />
          ) : (
            t("no_image_available")
          )}
        </div>
        {renderProductInfo(product)}
        <div className="absolute top-6 left-6 p-3 rounded-full bg-white bg-opacity-60 hover:bg-opacity-80">
          <Checkbox
            control={control}
            name={product.productVersionId}
            onChange={onCheckboxChange}
          />
        </div>
      </div>
    );
  };

  return (
    <Scrollbars
      autoHeight
      autoHeightMin={400}
      autoHeightMax={`calc(100vh - 200px)`}
      onUpdate={onScrollbarUpdate}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {map(products, renderProduct)}
      </motion.div>
      {productInfinityListQuery.isFetchingNextPage && (
        <div className="flex justify-center p-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </Scrollbars>
  );
};

export default WholeSalerProductsGrid;
