"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import Select from "@/components/form-ui/select";
import { DocumentTypeEnum } from "@/enums/document";
import FileUpload from "@/components/form-ui/file-upload";
import { createDocument } from "@/api/document";
import { ACCEPT_FILE } from "@/config/constants";
import { MediaFileTypeEnum } from "@/enums/media";
import { truncateFilename } from "@/utils/helpers";

const CreateDocumentDialog: FunctionComponent<{
  open: boolean;
  refetch: () => void;
  onClose: () => void;
}> = ({ open, refetch, onClose }) => {
  const t = useTranslations();
  const { control, reset, handleSubmit } = useForm({
    defaultValues: { type: undefined, files: [] },
  });

  const fileTypeOptions = [
    {
      label: t("certification"),
      value: DocumentTypeEnum.CERTIFICATION,
    },
    {
      label: t("marketing_material"),
      value: DocumentTypeEnum.MARKETING_MATERIAL,
    },
    {
      label: t("product_catalog"),
      value: DocumentTypeEnum.PRODUCT_CATALOG,
    },
    {
      label: t("others"),
      value: DocumentTypeEnum.OTHERS,
    },
  ];

  const uploadDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      toast.success(t("successfully_created"));
      refetch();
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  const onSubmit = handleSubmit((formValue) => {
    const file = head(formValue.files);
    uploadDocumentMutation.mutate({
      type: formValue.type,
      file: file,
      name: truncateFilename(file.name),
    });
  });

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button label={t("cancel")} variant="outline" onClick={onClose} />
      <Button
        label={t("create")}
        loading={uploadDocumentMutation.isPending}
        onClick={onSubmit}
      />
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("new_document")}
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.form
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Select
          control={control}
          name="type"
          label={t("file_type")}
          placeholder={t("select_file_type")}
          options={fileTypeOptions}
          rules={{ required: t("field_required", { field: t("file_type") }) }}
        />
        <FileUpload
          control={control}
          acceptFile={ACCEPT_FILE.PLATFORM_DOCUMENT}
          fileType={MediaFileTypeEnum.PLATFORM_DOCUMENT}
          maxSize={20}
          name="files"
          rules={{ required: t("field_required", { field: t("this_field") }) }}
          enableDragAndDrop
        />
      </motion.form>
    </BaseDialog>
  );
};

export default CreateDocumentDialog;
