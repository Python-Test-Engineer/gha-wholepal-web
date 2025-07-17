"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import { DocumentTypeEnum } from "@/enums/document";
import FileUpload from "@/components/form-ui/file-upload";
import { createDocument } from "@/api/document";
import { ACCEPT_FILE } from "@/config/constants";
import { MediaFileTypeEnum } from "@/enums/media";
import Input from "@/components/form-ui/input";

const CreateNLFTemplateDialog: FunctionComponent<{
  open: boolean;
  refetch: () => void;
  onClose: () => void;
}> = ({ open, refetch, onClose }) => {
  const t = useTranslations();
  const { control, reset, setError, handleSubmit } = useForm({
    defaultValues: { name: "", files: [] },
  });
  const { handleResponseError } = useFormValidator();

  const uploadNLFTemplateMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      toast.success(t("successfully_created"));
      refetch();
      onClose();
    },
    onError: (error: App.ResponseError) => handleResponseError(error, setError),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  const onSubmit = handleSubmit((formValue) => {
    const file = head(formValue.files);
    uploadNLFTemplateMutation.mutate({
      type: DocumentTypeEnum.NLF,
      file: file,
      name: formValue.name,
    });
  });

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button label={t("cancel")} variant="outline" onClick={onClose} />
      <Button
        label={t("create")}
        loading={uploadNLFTemplateMutation.isPending}
        onClick={onSubmit}
      />
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("new_nlf_template")}
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.form
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          control={control}
          name="name"
          label={t("nlf_template_name")}
          placeholder={t("enter_name")}
          rules={{
            required: t("field_required", { field: t("nlf_template_name") }),
            maxLength: {
              value: 500,
              message: t("invalid_max_length", { max: 500 }),
            },
          }}
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

export default CreateNLFTemplateDialog;
