"use client";

import { Plus, Loader2, FileText, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/form-ui/datatable";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckedState } from "@radix-ui/react-checkbox";
import WholesalerProductCode from "./wholesaler-product-code";

const WholeSalerProductsTable: FunctionComponent<{
  productListQuery: UseQueryResult<App.ListItem<ProductManagement.Product>>;
  pagination: App.Pagination;
  onChangePage: (page: number) => void;
  setSelectedProductIds: Dispatch<SetStateAction<string[]>>;
}> = ({
  productListQuery,
  pagination,
  onChangePage,
  setSelectedProductIds,
}) => {
  const t = useTranslations();
  const router = useRouter();

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
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <Link
          href={`/product-versions/${row.original.productVersionId}`}
          className="text-primary hover:underline"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "supplier",
      header: t("supplier"),
      cell: ({ row }) => row.getValue("supplier") || "-",
    },
    {
      accessorKey: "size",
      header: t("size"),
      cell: ({ row }) => row.getValue("size") || "-",
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => row.getValue("category") || "-",
    },
    {
      accessorKey: "unitBarcode",
      header: t("unit_barcode"),
      cell: ({ row }) => row.getValue("unitBarcode") || "-",
    },
    {
      accessorKey: "caseBarcode",
      header: t("case_barcode"),
      cell: ({ row }) => row.getValue("caseBarcode") || "-",
    },
    {
      accessorKey: "skuCode",
      header: t("supplier_pc"),
      cell: ({ row }) => row.getValue("skuCode") || "-",
    },
    {
      accessorKey: "wholesalerProductCode",
      header: t("wholesaler_pc"),
      cell: ({ row }) => (
        <WholesalerProductCode
          product={row.original}
          refetch={productListQuery.refetch}
        />
      ),
    },
    {
      accessorKey: "id",
      header: "",
      enableHiding: false,
      size: 50,
      cell: ({ row }) => {
        const productVersionId = row.original.productVersionId;
        return (
          <div className="flex justify-end gap-2">
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500"
              onClick={() =>
                router.push(`/product-versions/${productVersionId}`)
              }
            >
              <Eye className="w-4 h-4" />
            </div>
          </div>
        );
      },
    },
  ];

  const renderEmpty = (): React.JSX.Element => (
    <div className="flex flex-col justify-center items-center p-12 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-6">
        {t("no_products_found")}
      </h3>
      <Button onClick={() => router.push("/supplier-products")}>
        <Plus className="h-4 w-4" />
        {t("find_products_on_wholepal")}
      </Button>
    </div>
  );

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
    <DataTable
      data={get(productListQuery.data, "items")}
      columns={columns}
      onRowSelectionChange={(products) =>
        setSelectedProductIds(map(products, "productVersionId"))
      }
      empty={renderEmpty()}
      paginationConfig={{ ...pagination, onChangePage }}
    />
  );
};

export default WholeSalerProductsTable;
