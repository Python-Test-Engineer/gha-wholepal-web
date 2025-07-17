"use client";

import { toast } from "react-hot-toast";
import { Scrollbars } from "react-custom-scrollbars-2";
import Link from "next/link";
import { Eye, FileDown, Loader2, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ProductFileTypeEnum, ProductStatusEnum } from "@/enums/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { isScrolledToBottom } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/api/product";
import Checkbox from "@/components/form-ui/checkbox";
import { NotificationEnum } from "@/enums/socket-connect";
import { NotificationTypeEnum } from "@/enums/notification";

const ManuallyInputProductDialog = lazyload(
  () => import("@/dialog/manually-input-product-dialog")
);
const UploadedFilesDialog = lazyload(
  () => import("@/dialog/uploaded-files-dialog")
);
const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));

const SupplierProductsGrid: FunctionComponent<{
  productInfinityListQuery: UseInfiniteQueryResult<
    App.ListItem<ProductManagement.Product>
  >;
  setSelectedProducts: Dispatch<SetStateAction<ProductManagement.Product[]>>;
}> = ({ productInfinityListQuery, setSelectedProducts }) => {
  const t = useTranslations();
  const router = useRouter();
  const { on, off } = useSocket();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState<
    ProductManagement.FileInfo[]
  >([]);
  const { modal, openModal, closeModal } = useModalState([
    "reviewProduct",
    "uploadedFiles",
    "confirmDelete",
  ]);
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

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success(t("successfully_deleted"));
      productInfinityListQuery.refetch();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  useEffect(() => {
    on<ConnectSocket.SocketResponse>(
      NotificationEnum.PRODUCT_EVENT,
      ({ type }) => {
        if (type === NotificationTypeEnum.PRODUCT_PROCESS_COMPLETED) {
          productInfinityListQuery.refetch();
        }
      }
    );
    return () => off(NotificationEnum.PRODUCT_EVENT);
  }, []);

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

  const getPercent = (currentStep: number): number => {
    const percentByStep = {
      1: 20,
      2: 40,
      3: 60,
      4: 80,
      5: 100,
    };

    return get(percentByStep, currentStep, 0);
  };

  const onCheckboxChange = (): void => {
    const values = getValues();
    const checked = omitBy(values, (item) => !item) as string[];
    const selectedProducts = map(checked, (productId) =>
      find(products, ({ id }) => id === productId)
    );
    setSelectedProducts(selectedProducts);
  };

  const renderProgress = (
    product: ProductManagement.Product
  ): React.JSX.Element => {
    const isReviewing = product.status === ProductStatusEnum.MANUAL_REVIEWING;
    const percent = getPercent(product.currentStep);
    const isYellow = percent <= 40;
    const isBlue = percent < 100;
    const isGreen = percent === 100;
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Progress
          value={isReviewing ? percent : 0}
          className={cn(
            "bg-gray-200",
            isGreen &&
              "[&>div]:bg-gradient-to-l [&>div]:from-green-500 [&>div]:to-green-200",
            isBlue &&
              "[&>div]:bg-gradient-to-l [&>div]:from-blue-500 [&>div]:to-blue-50",
            isYellow &&
              "[&>div]:bg-gradient-to-l [&>div]:from-yellow-500 [&>div]:to-yellow-50"
          )}
        />
        {t("percent_with_value", { percent: isReviewing ? percent : 0 })}
      </div>
    );
  };

  const renderProductInfo = (
    product: ProductManagement.Product
  ): React.JSX.Element => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING
    ) {
      return (
        <p className="text-muted-foreground">{t("processing_your_files")}</p>
      );
    }

    if (product.status === ProductStatusEnum.AI_FAILED) {
      return (
        <p className="text-muted-foreground">
          {t("can_not_process_your_files")}
        </p>
      );
    }

    if (
      product.status === ProductStatusEnum.AI_DONE ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      const isReview = product.status === ProductStatusEnum.MANUAL_REVIEWING;
      return (
        <div className="flex flex-col gap-2">
          {renderProgress(product)}
          <Button
            onClick={() => {
              setSelectedProductId(product.id);
              openModal("reviewProduct");
            }}
          >
            {t(isReview ? "complete_with_click" : "click_to_verify_your_data")}
          </Button>
        </div>
      );
    }
    return (
      <>
        <p className="text-muted-foreground">
          {t.rich("name_with_colon", {
            tag: (chunk) => <span className="font-bold">{chunk}</span>,
            name: product.name || "-",
            nameTag: (chunk) => (
              <Link
                href={`/products/${product.id}`}
                className="text-primary hover:underline"
              >
                {chunk}
              </Link>
            ),
          })}
        </p>
        <p className="text-muted-foreground">
          {t.rich("sku_code_with_colon", {
            tag: (chunk) => <span className="font-bold">{chunk}</span>,
            skuCode: product.skuCode || "-",
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
      </>
    );
  };

  const renderActions = (
    product: ProductManagement.Product
  ): React.JSX.Element => {
    if (
      includes(
        [
          ProductStatusEnum.TODO,
          ProductStatusEnum.AI_PROCESSING,
          ProductStatusEnum.MANUAL_REVIEWING,
          ProductStatusEnum.AI_DONE,
          ProductStatusEnum.AI_FAILED,
        ],
        product.status
      )
    ) {
      return (
        <div className="flex flex-col gap-1">
          <div
            className="flex items-center justify-center h-9 w-9 rounded-full bg-white hover:bg-blue-100 hover:text-blue-500 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedFiles(product.files);
              openModal("uploadedFiles");
            }}
          >
            <FileDown className="w-4 h-4" />
          </div>
          <div
            className="flex items-center justify-center h-9 w-9 rounded-full bg-white hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedProductId(product.id);
              openModal("confirmDelete");
            }}
          >
            <Trash className="w-4 h-4" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <div
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white hover:bg-blue-100 hover:text-blue-500 transition-colors cursor-pointer"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          <Eye className="w-4 h-4" />
        </div>
        <div
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
          onClick={() => {
            setSelectedProductId(product.id);
            openModal("confirmDelete");
          }}
        >
          <Trash className="w-4 h-4" />
        </div>
      </div>
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
        <div className="absolute top-5 right-5 invisible group-hover:visible">
          {renderActions(product)}
        </div>
        <div className="absolute top-6 left-6 p-3 rounded-full bg-white bg-opacity-60 hover:bg-opacity-80">
          <Checkbox
            control={control}
            name={product.id}
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
      {modal.reviewProduct.load && (
        <ManuallyInputProductDialog
          open={modal.reviewProduct.open}
          productId={selectedProductId}
          refetch={productInfinityListQuery.refetch}
          onClose={closeModal("reviewProduct")}
        />
      )}
      {modal.uploadedFiles.load && (
        <UploadedFilesDialog
          open={modal.uploadedFiles.open}
          files={selectedFiles}
          onClose={closeModal("uploadedFiles")}
        />
      )}
      {modal.confirmDelete.load && (
        <ConfirmDialog
          open={modal.confirmDelete.open}
          title={t("confirm_delete_product")}
          onClose={closeModal("confirmDelete")}
          onConfirm={() => deleteProductMutation.mutate(selectedProductId)}
        />
      )}
    </Scrollbars>
  );
};

export default SupplierProductsGrid;
