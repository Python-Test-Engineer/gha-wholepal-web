"use client";

import { toast } from "react-hot-toast";
import { Trash, Eye, Loader2, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/form-ui/datatable";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { ColumnDef } from "@tanstack/react-table";
import { ProductStatusEnum } from "@/enums/product";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { deleteProduct } from "@/api/product";
import { NotificationEnum } from "@/enums/socket-connect";
import { NotificationTypeEnum } from "@/enums/notification";

const UploadedFilesDialog = lazyload(
  () => import("@/dialog/uploaded-files-dialog")
);
const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));
const ManuallyInputProductDialog = lazyload(
  () => import("@/dialog/manually-input-product-dialog")
);

const SupplierProductsTable: FunctionComponent<{
  productListQuery: UseQueryResult<App.ListItem<ProductManagement.Product>>;
  pagination: App.Pagination;
  onChangePage: (page: number) => void;
  setSelectedProducts: Dispatch<SetStateAction<ProductManagement.Product[]>>;
}> = ({ productListQuery, pagination, onChangePage, setSelectedProducts }) => {
  const router = useRouter();
  const t = useTranslations();
  const { on, off } = useSocket();
  const { modal, openModal, closeModal } = useModalState([
    "uploadedFiles",
    "reviewProduct",
    "confirmDelete",
  ]);
  const [selectedFiles, setSelectedFiles] = useState<
    ProductManagement.FileInfo[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

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

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success(t("successfully_deleted"));
      productListQuery.refetch();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  useEffect(() => {
    on<ConnectSocket.SocketResponse>(
      NotificationEnum.PRODUCT_EVENT,
      ({ type }) => {
        if (type === NotificationTypeEnum.PRODUCT_PROCESS_COMPLETED) {
          productListQuery.refetch();
        }
      }
    );
    return () => off(NotificationEnum.PRODUCT_EVENT);
  }, []);

  const renderProgress = (
    product: ProductManagement.Product
  ): React.JSX.Element => {
    const isReviewing = product.status === ProductStatusEnum.MANUAL_REVIEWING;
    const percent = getPercent(product.currentStep);
    const isYellow = percent <= 40;
    const isBlue = percent < 100;
    const isGreen = percent === 100;

    return (
      <div className="flex items-center gap-2 w-full max-w-[200px] text-muted-foreground">
        <Progress
          value={isReviewing ? percent : 0}
          className={cn(
            "bg-gray-200 max-w-[200px]",
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

  const renderName = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING
    ) {
      return <TableCell colSpan={7}>{t("processing_your_files")}</TableCell>;
    }
    if (product.status === ProductStatusEnum.AI_FAILED) {
      return (
        <TableCell colSpan={7}>{t("can_not_process_your_files")}</TableCell>
      );
    }
    if (
      product.status === ProductStatusEnum.AI_DONE ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      const isReviewing = product.status === ProductStatusEnum.MANUAL_REVIEWING;
      return (
        <TableCell colSpan={7}>
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={() => {
                setSelectedProductId(product.id);
                openModal("reviewProduct");
              }}
            >
              {t(
                isReviewing
                  ? "product_in_progress_complete_with_click"
                  : "upload_complete_click_to_verify_your_data"
              )}
            </Button>
            {renderProgress(product)}
          </div>
        </TableCell>
      );
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return (
        <TableCell>
          <Link
            href={`/products/${product.id}`}
            className="text-primary hover:underline"
          >
            {product.name}
          </Link>
        </TableCell>
      );
    }
    return null;
  };

  const renderSupplier = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_FAILED ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      return null;
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return <TableCell>{product.supplier || "-"}</TableCell>;
    }
    return null;
  };

  const renderSize = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_FAILED ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      return null;
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return <TableCell>{product.size || "-"}</TableCell>;
    }
    return null;
  };

  const renderCategory = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_FAILED ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      return null;
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return <TableCell>{product.category || "-"}</TableCell>;
    }
    return null;
  };

  const renderSKUCode = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_FAILED ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      return null;
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return <TableCell>{product.skuCode || "-"}</TableCell>;
    }
    return null;
  };

  const renderUnitBarcode = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_FAILED ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      return null;
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return <TableCell>{product.unitBarcode || "-"}</TableCell>;
    }
    return null;
  };

  const renderCaseBarcode = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_FAILED ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING
    ) {
      return null;
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return <TableCell>{product.caseBarcode || "-"}</TableCell>;
    }
    return null;
  };

  const renderActions = (product: ProductManagement.Product): ReactNode => {
    if (
      product.status === ProductStatusEnum.TODO ||
      product.status === ProductStatusEnum.AI_PROCESSING ||
      product.status === ProductStatusEnum.AI_DONE ||
      product.status === ProductStatusEnum.MANUAL_REVIEWING ||
      product.status === ProductStatusEnum.AI_FAILED
    ) {
      return (
        <TableCell>
          <div className="flex justify-end gap-2">
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 transition-colors"
              onClick={() => {
                setSelectedFiles(product.files);
                openModal("uploadedFiles");
              }}
            >
              <FileDown className="w-4 h-4" />
            </div>
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
              onClick={() => {
                setSelectedProductId(product.id);
                openModal("confirmDelete");
              }}
            >
              <Trash className="w-4 h-4" />
            </div>
          </div>
        </TableCell>
      );
    }
    if (product.status === ProductStatusEnum.MANUAL_DONE) {
      return (
        <TableCell>
          <div className="flex justify-end gap-2">
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 transition-colors"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <Eye className="w-4 h-4" />
            </div>
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
              onClick={() => {
                setSelectedProductId(product.id);
                openModal("confirmDelete");
              }}
            >
              <Trash className="w-4 h-4" />
            </div>
          </div>
        </TableCell>
      );
    }
    return null;
  };

  const columns: ColumnDef<ProductManagement.Product>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={
            (table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() &&
                "indeterminate")) as CheckedState
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <TableCell>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </TableCell>
      ),
    },
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => renderName(row.original),
    },
    {
      accessorKey: "supplier",
      header: t("supplier"),
      cell: ({ row }) => renderSupplier(row.original),
    },
    {
      accessorKey: "size",
      header: t("size"),
      cell: ({ row }) => renderSize(row.original),
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => renderCategory(row.original),
    },
    {
      accessorKey: "skuCode",
      header: t("sku_code"),
      cell: ({ row }) => renderSKUCode(row.original),
    },
    {
      accessorKey: "unitBarcode",
      header: t("unit_barcode"),
      cell: ({ row }) => renderUnitBarcode(row.original),
    },
    {
      accessorKey: "caseBarcode",
      header: t("case_barcode"),
      cell: ({ row }) => renderCaseBarcode(row.original),
    },
    {
      accessorKey: "id",
      header: "",
      enableHiding: false,
      size: 100,
      cell: ({ row }) => renderActions(row.original),
    },
  ];

  if (productListQuery.isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          {t("loading_product")}
        </span>
      </div>
    );
  }

  return (
    <>
      <DataTable
        data={get(productListQuery.data, "items")}
        columns={columns}
        empty={t("empty_product_version")}
        useRawCellRender
        onRowSelectionChange={(products) => setSelectedProducts(products)}
        paginationConfig={{ ...pagination, onChangePage }}
      />
      {modal.uploadedFiles.load && (
        <UploadedFilesDialog
          open={modal.uploadedFiles.open}
          files={selectedFiles}
          onClose={closeModal("uploadedFiles")}
        />
      )}
      {modal.reviewProduct.load && (
        <ManuallyInputProductDialog
          open={modal.reviewProduct.open}
          productId={selectedProductId}
          refetch={productListQuery.refetch}
          onClose={closeModal("reviewProduct")}
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
    </>
  );
};

export default SupplierProductsTable;
