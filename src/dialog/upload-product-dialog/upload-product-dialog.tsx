"use client";

import { toast } from "react-hot-toast";
import FileUpload from "@/components/form-ui/file-upload";
import Button from "@/components/form-ui/button";
import { uploadProducts } from "@/api/product";
import BaseDialog from "@/dialog/base-dialog";
import useFile from "@/hooks/use-file";

const UploadProductDialog: FunctionComponent<{
  open: boolean;
  onClose: () => void;
  refetchProducts?: () => void;
}> = ({ open, onClose, refetchProducts = () => null }) => {
  const t = useTranslations();
  const {
    control,
    formState: { isDirty },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: { files: [] },
  });
  const { getExtension } = useFile();

  const uploadMutation = useMutation({
    mutationFn: uploadProducts,
    onSuccess: (response) => {
      toast.success(response.message);
      refetchProducts();
      onClose();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const proceedWithUpload = handleSubmit((formValue) => {
    const isUploadSingle = size(formValue.files) === 1;
    if (isUploadSingle) {
      uploadMutation.mutate(formValue.files);
    } else {
      const extensions = map(formValue.files, (file) =>
        getExtension(file.name)
      );
      const onlyIncludesCsvTsv = every(
        extensions,
        (extension) => extension === "csv" || extension === "tsv"
      );
      if (onlyIncludesCsvTsv) {
        uploadMutation.mutate(formValue.files);
      } else {
        toast.error(t("only_csv_and_tsv_allowed_when_upload_multiple"));
      }
    }
  });

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-4">
      <Button
        label={t("cancel")}
        variant="outline"
        disabled={uploadMutation.isPending}
        onClick={onClose}
      />
      <Button
        label={t("proceed_with_upload")}
        disabled={!isDirty}
        loading={uploadMutation.isPending}
        onClick={() => proceedWithUpload()}
      />
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("add_products")}
      description={t("add_products_description")}
      contentClassname="sm:max-w-[600px]"
      footer={renderFooter()}
      onClose={onClose}
    >
      <FileUpload
        control={control}
        name="files"
        multiple
        maxFiles={10}
        enableDragAndDrop
      />
    </BaseDialog>
  );
};

export default UploadProductDialog;
