"use client";

import { motion } from "framer-motion";
import { File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import BaseDialog from "@/dialog/base-dialog";
import { ProductFileTypeEnum } from "@/enums/product";
import { windowOpen } from "@/utils/helpers";

const UploadedFilesDialog: FunctionComponent<{
  open: boolean;
  files: ProductManagement.FileInfo[];
  onClose: () => void;
}> = ({ open, files, onClose }) => {
  const t = useTranslations();
  const { downloadFileMutation } = useDownloadFile();

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end">
      <Button variant="outline" onClick={onClose}>
        {t("cancel")}
      </Button>
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("uploaded_files")}
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {map(filter(files, { type: ProductFileTypeEnum.DOCUMENTS }), (file) => (
          <div
            key={file.id}
            className="flex gap-2 items-center justify-between p-1"
          >
            <div className="flex gap-1 items-center flex-1">
              <File className="w-4 h-4" />
              <p className="flex-1">{file.name}</p>
            </div>
            <Download
              className="w-4 h-4 cursor-pointer"
              onClick={() =>
                downloadFileMutation.mutate({
                  url: file.url,
                  fileName: file.name,
                })
              }
            />
          </div>
        ))}
      </motion.div>
    </BaseDialog>
  );
};

export default UploadedFilesDialog;
