"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import { getFile } from "@/api/app";
import { downloadFile } from "@/utils/helpers";

const PreviewImageDialog: FunctionComponent<{
  open: boolean;
  image: ProductManagement.FileInfo;
  onClose: () => void;
}> = ({ open, image, onClose }) => {
  const t = useTranslations();

  const downloadImageMutation = useMutation({
    mutationFn: () => getFile(image.url),
    onSuccess: (response) => downloadFile(image.name, response.data),
    onError: (error: App.ResponseError) =>
      toast.error(error.message || t("download_image_failed")),
  });

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button label={t("cancel")} variant="outline" onClick={onClose} />
      <Button
        label={t("download")}
        loading={downloadImageMutation.isPending}
        onClick={() => downloadImageMutation.mutate()}
      />
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("product_image")}
      contentClassname="sm:max-w-[500px]"
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative p-1 bg-muted rounded-lg aspect-square">
          <img
            src={get(image, "url")}
            alt={image.name}
            // fill
            className="absolute inset-0 object-contain w-full max-h-[100%]"
          />
        </div>
      </motion.div>
    </BaseDialog>
  );
};

export default PreviewImageDialog;
