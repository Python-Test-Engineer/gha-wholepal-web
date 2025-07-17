"use client";

import {
  Ban,
  CircleCheck,
  CircleFadingArrowUp,
  Loader2,
  Pause,
  Plus,
} from "lucide-react";
import { Scrollbars } from "react-custom-scrollbars-2";
// import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  connectProduct,
  getSupplierProducts,
  updateConnectVersion,
} from "@/api/product";
import { motion } from "framer-motion";
import { isScrolledToBottom } from "@/utils/helpers";
import { ProductConnectStatusEnum, ProductFileTypeEnum } from "@/enums/product";
import { Button } from "@/components/ui/button";

const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));

const GridView: FunctionComponent<{ searchQuery: string }> = ({
  searchQuery,
}) => {
  const t = useTranslations();
  const { modal, openModal, closeModal } = useModalState([
    "confirm",
    "confirmUpdate",
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [updateVersionData, setUpdateVersionData] =
    useState<
      Pick<ProductManagement.Product, "productConnectId" | "productVersionId">
    >(null);

  const productInfinityListQuery = useInfiniteRequest({
    queryKey: ["get-infinite-supplier-products", { searchQuery }],
    queryFn: ({ pageParam }) =>
      getSupplierProducts({
        page: pageParam as number,
        limit: 12,
        keyword: searchQuery,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.totalPages ? meta.currentPage + 1 : null,
  });

  const products = useMemo<ProductManagement.Product[]>(
    () =>
      reduce(
        get(productInfinityListQuery.data, "pages", []),
        (acc, { items }) => [...acc, ...items],
        []
      ),
    [productInfinityListQuery.data]
  );

  useEffect(() => {
    if (productInfinityListQuery.isError) {
      toast.error(productInfinityListQuery.error.message);
    }
  }, [productInfinityListQuery.isError]);

  const connectProductMutation = useMutation({
    mutationFn: (productVersionId: string) => connectProduct(productVersionId),
    onSuccess: () => {
      toast.success(t("successfully_added"));
      productInfinityListQuery.refetch();
      setSelectedId(null);
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const updateConnectVersionMutation = useMutation({
    mutationFn: (
      data: Pick<
        ProductManagement.Product,
        "productConnectId" | "productVersionId"
      >
    ) => updateConnectVersion(data.productConnectId, data.productVersionId),
    onSuccess: () => {
      toast.success(t("successfully_updated"));
      productInfinityListQuery.refetch();
      setSelectedId(null);
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

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
        {t.rich("pc_with_colon", {
          tag: (chunk) => <span className="font-bold">{chunk}</span>,
          productCode: product.skuCode || "-",
        })}
      </p>
    </>
  );

  const renderAction = (
    product: ProductManagement.Product
  ): React.JSX.Element => {
    if (product.productConnectStatus === ProductConnectStatusEnum.PENDING) {
      return (
        <Button
          className="bg-amber-500"
          disabled
          onClick={(event) => event.stopPropagation()}
        >
          <Pause className="w-4 h-4" />
          {t("pending")}
        </Button>
      );
    }
    if (product.productConnectStatus === ProductConnectStatusEnum.APPROVED) {
      return (
        <Button disabled onClick={(event) => event.stopPropagation()}>
          <CircleCheck className="w-4 h-4" />
          {t("connected")}
        </Button>
      );
    }
    if (product.productConnectStatus === ProductConnectStatusEnum.REJECTED) {
      return (
        <Button
          className="bg-red-500 "
          disabled
          onClick={(event) => event.stopPropagation()}
        >
          <Ban className="w-4 h-4" />
          {t("declined")}
        </Button>
      );
    }
    if (
      product.productConnectStatus === ProductConnectStatusEnum.READY_TO_UPDATE
    ) {
      return (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            setUpdateVersionData({
              productConnectId: product.productConnectId,
              productVersionId: product.productVersionId,
            });
            openModal("confirmUpdate");
          }}
        >
          <CircleFadingArrowUp className="w-4 h-4" />
          {t("new_update_available")}
        </Button>
      );
    }

    return (
      <Button
        onClick={(event) => {
          event.stopPropagation();
          setSelectedId(product.productVersionId);
          openModal("confirm");
        }}
      >
        <Plus className="w-4 h-4" />
        {t("add_product")}
      </Button>
    );
  };

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
        className="flex flex-col gap-2 p-4 bg-card rounded-lg h-fit relative group cursor-pointer"
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
        {renderAction(product)}
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
      {modal.confirm.load && (
        <ConfirmDialog
          open={modal.confirm.open}
          title={t("confirm_add_product_title")}
          description={t("confirm_add_product_title")}
          onClose={closeModal("confirm")}
          onConfirm={() => connectProductMutation.mutateAsync(selectedId)}
        />
      )}
      {modal.confirmUpdate.load && (
        <ConfirmDialog
          open={modal.confirmUpdate.open}
          title={t("confirm_update_product_version")}
          description={t("confirm_update_product_version")}
          onClose={closeModal("confirmUpdate")}
          onConfirm={() =>
            updateConnectVersionMutation.mutateAsync(updateVersionData)
          }
        />
      )}
    </Scrollbars>
  );
};

export default GridView;
