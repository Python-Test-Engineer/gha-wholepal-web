"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Input from "@/components/form-ui/input";
import Button from "@/components/form-ui/button";
import FileUpload from "@/components/form-ui/file-upload";
import { createDocument } from "@/api/document";
import { ACCEPT_FILE } from "@/config/constants";
import { MediaFileTypeEnum } from "@/enums/media";
import { DocumentTypeEnum } from "@/enums/document";

const UploadNLFTemplate: FunctionComponent<{
  uploadSucceed: (document: DocumentManagement.Document) => void;
  onBack: () => void;
}> = ({ uploadSucceed, onBack }) => {
  const t = useTranslations();
  const { control, setError, handleSubmit } = useForm();
  const { handleResponseError } = useFormValidator();

  const uploadNewLineFormMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (response) => {
      toast.success(t("successfully_uploaded"));
      uploadSucceed(response);
    },
    onError: (error: App.ResponseError) => handleResponseError(error, setError),
  });

  const onUploadNewLineForm = handleSubmit((formValue) => {
    const { templateName, files } = formValue;
    uploadNewLineFormMutation.mutate({
      name: templateName,
      file: head(files),
      type: DocumentTypeEnum.NLF,
    });
  });

  return (
    <>
      <Input
        control={control}
        name="templateName"
        label={t("nlf_template_name")}
        placeholder={t("enter_nlf_template_name")}
        rules={{
          required: t("field_required", { field: t("nlf_template_name") }),
          maxLength: {
            value: 500,
            message: t("invalid_max_length", { max: 500 }),
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col gap-2 mt-4"
      >
        <span className="font-semibold">
          {t("upload_new_line_form_template")}
        </span>
        <FileUpload
          control={control}
          acceptFile={ACCEPT_FILE.PLATFORM_DOCUMENT}
          fileType={MediaFileTypeEnum.PLATFORM_DOCUMENT}
          maxSize={20}
          name="files"
          rules={{
            required: t("field_required", { field: t("this_field") }),
          }}
          enableDragAndDrop
        />
      </motion.div>
      <div className="flex gap-2">
        <Button label={t("back")} variant="outline" onClick={onBack} />
        <Button
          label={t("upload_new_line_form")}
          className="w-full"
          loading={uploadNewLineFormMutation.isPending}
          onClick={onUploadNewLineForm}
        />
      </div>
    </>
  );
};

export default UploadNLFTemplate;
