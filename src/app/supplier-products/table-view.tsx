"use client";

import {
  Plus,
  Pause,
  CircleCheck,
  Loader2,
  Ban,
  CircleFadingArrowUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import DataTable from "@/components/form-ui/datatable";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  getSupplierProducts,
  connectProduct,
  updateConnectVersion,
} from "@/api/product";
import { ProductConnectStatusEnum } from "@/enums/product";

const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));

const TableView: FunctionComponent<{ searchQuery: string }> = ({
  searchQuery,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { modal, openModal, closeModal } = useModalState([
    "confirm",
    "confirmUpdate",
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [updateVersionData, setUpdateVersionData] =
    useState<
      Pick<ProductManagement.Product, "productConnectId" | "productVersionId">
    >(null);
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const columns: ColumnDef<ProductManagement.Product>[] = [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <Link
          href={`/product-versions/${row.original.productVersionId}`}
          className="text-primary hover:underline"
        >
          {row.getValue("name") || "-"}
        </Link>
      ),
    },
    {
      accessorKey: "supplier",
      header: t("supplier"),
      cell: ({ row }) => <span>{row.getValue("supplier") || "-"}</span>,
    },
    {
      accessorKey: "size",
      header: t("size"),
      cell: ({ row }) => <span>{row.getValue("size") || "-"}</span>,
    },
    {
      accessorKey: "unitBarcode",
      header: t("unit_barcode"),
      cell: ({ row }) => <span>{row.getValue("unitBarcode") || "-"}</span>,
    },
    {
      accessorKey: "caseBarcode",
      header: t("case_barcode"),
      cell: ({ row }) => <span>{row.getValue("caseBarcode") || "-"}</span>,
    },
    {
      accessorKey: "skuCode",
      header: t("product_code"),
      cell: ({ row }) => <span>{row.getValue("skuCode") || "-"}</span>,
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => <span>{row.getValue("category") || "-"}</span>,
    },
    {
      accessorKey: "id",
      header: "",
      enableHiding: false,
      size: 116,
      cell: ({ row }) => {
        const productConnectStatus = row.original.productConnectStatus;

        if (productConnectStatus === ProductConnectStatusEnum.PENDING) {
          return (
            <div className="flex justify-end">
              <Button
                className="bg-amber-500 w-[168px]"
                disabled
                onClick={(event) => event.stopPropagation()}
              >
                <Pause className="w-4 h-4" />
                {t("pending")}
              </Button>
            </div>
          );
        }

        if (productConnectStatus === ProductConnectStatusEnum.APPROVED) {
          return (
            <div className="flex justify-end">
              <Button
                className="w-[168px]"
                disabled
                onClick={(event) => event.stopPropagation()}
              >
                <CircleCheck className="w-4 h-4" />
                {t("connected")}
              </Button>
            </div>
          );
        }

        if (productConnectStatus === ProductConnectStatusEnum.REJECTED) {
          return (
            <div className="flex justify-end">
              <Button
                className="bg-red-500 w-[168px]"
                disabled
                onClick={(event) => event.stopPropagation()}
              >
                <Ban className="w-4 h-4" />
                {t("declined")}
              </Button>
            </div>
          );
        }

        if (productConnectStatus === ProductConnectStatusEnum.READY_TO_UPDATE) {
          return (
            <div className="flex justify-end">
              <Button
                className="w-[168px]"
                onClick={(event) => {
                  event.stopPropagation();
                  setUpdateVersionData({
                    productConnectId: row.original.productConnectId,
                    productVersionId: row.original.productVersionId,
                  });
                  openModal("confirmUpdate");
                }}
              >
                <CircleFadingArrowUp className="w-4 h-4" />
                {t("new_update_available")}
              </Button>
            </div>
          );
        }
        return (
          <div className="flex justify-end">
            <Button
              className="w-[168px]"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedId(row.original.productVersionId);
                openModal("confirm");
              }}
            >
              <Plus className="w-4 h-4" />
              {t("add_product")}
            </Button>
          </div>
        );
      },
    },
  ];

  const { isLoading, data, isSuccess, isRefetching, isError, error, refetch } =
    useRequest({
      queryKey: [
        "getSupplierProducts",
        {
          searchQuery,
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        },
      ],
      queryFn: () =>
        getSupplierProducts({
          keyword: searchQuery,
          page: pagination.currentPage,
          limit: pagination.perPage,
        }),
    });

  useEffect(() => {
    if (isSuccess && !isRefetching) {
      const {
        meta: { totalItems, itemsPerPage, currentPage },
      } = data;
      setPagination({ total: totalItems, perPage: itemsPerPage, currentPage });
    }
  }, [isSuccess, isRefetching]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError]);

  const connectProductMutation = useMutation({
    mutationFn: (productVersionId: string) => connectProduct(productVersionId),
    onSuccess: () => {
      toast.success(t("successfully_added"));
      refetch();
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
      refetch();
      setSelectedId(null);
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const onChangePage = (currentPage: number): void =>
    setPagination((prev) => ({ ...prev, currentPage }));

  if (isLoading) {
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
        data={get(data, "items")}
        columns={columns}
        onRowClick={(row) => {
          const productVersionId = row.original.productVersionId;
          router.push(`/product-versions/${productVersionId}`);
        }}
        paginationConfig={{ ...pagination, onChangePage }}
      />
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
    </>
  );
};

export default TableView;
