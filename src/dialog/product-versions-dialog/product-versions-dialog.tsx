"use client";

import { Scrollbars } from "react-custom-scrollbars-2";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import DataTable from "@/components/form-ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import ConfirmDialog from "@/dialog//confirm-dialog";
import { publishProduct } from "@/api/product";
import { DATE_TIME_FORMAT } from "@/config/constants";
import Link from "next/link";
import { ProductFileTypeEnum } from "@/enums/product";

const ProductVersionDialog: FunctionComponent<{
  open: boolean;
  product: ProductManagement.Product;
  refetch: () => void;
  onClose: () => void;
}> = ({ open, product, refetch, onClose }) => {
  const t = useTranslations();
  const { formatDate } = useDateTime(DATE_TIME_FORMAT);
  const { versions, id } = product;
  const [modalState, setModalState] = useState({
    confirm: false,
  });

  const columns: ColumnDef<ProductManagement.ProductVersion>[] = [
    {
      accessorKey: "version",
      header: t("version"),
      cell: ({ row }) =>
        t.rich("version_with_value", {
          value: row.getValue("version"),
          version: (chunk) => (
            <Link
              href={`/product-versions/${row.original.id}`}
              target="_blank"
              className="text-primary hover:underline"
            >
              {chunk}
            </Link>
          ),
        }),
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
  ];

  const publishProductMutation = useMutation({
    mutationFn: () => publishProduct(id),
    onSuccess: () => {
      toast.success(t("successfully_publish"));
      refetch();
      onClose();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const meetMinimumData = useMemo(() => {
    const { name, size, unitBarcode, skuCode, files } = product;
    const hasImage = some(
      files,
      (file) =>
        file.type === ProductFileTypeEnum.PRIMARY_IMAGE ||
        file.type === ProductFileTypeEnum.SECONDARY_IMAGE
    );
    return (
      hasImage &&
      Boolean(name) &&
      Boolean(size) &&
      Boolean(unitBarcode) &&
      Boolean(skuCode)
    );
  }, [product]);

  const toggleModal = (name: keyof typeof modalState): void => {
    setModalState((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePublish = (): void => {
    if (meetMinimumData) {
      toggleModal("confirm");
    } else {
      toast.error(t("product_not_meet_minimum_data"));
    }
  };

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button label={t("cancel")} variant="outline" onClick={onClose} />
      <Button
        label={t("publish_new_product_version")}
        onClick={handlePublish}
      />
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("manage_product_versions")}
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Scrollbars autoHeight autoHeightMin={300}>
          <DataTable
            data={versions}
            columns={columns}
            empty={t("empty_product_version")}
          />
        </Scrollbars>
      </motion.div>
      <ConfirmDialog
        open={modalState.confirm}
        title={t("confirm_publish_product_title")}
        onClose={() => toggleModal("confirm")}
        onConfirm={publishProductMutation.mutateAsync}
      />
    </BaseDialog>
  );
};

export default ProductVersionDialog;
