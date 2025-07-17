"use client";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { File, Trash, UploadCloud } from "lucide-react";
import { ACCEPT_FILE, MB_UNIT } from "@/config/constants";
import { MediaFileTypeEnum } from "@/enums/media";
import { useDropFile } from "@/hooks/use-drop-file";
import type { DropzoneOptions, FileWithPath } from "react-dropzone";
import MessageError from "@/components/form-ui/message-error";
import { cn } from "@/lib/utils";

interface FileUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  fileType?: MediaFileTypeEnum;
  maxFiles?: number;
  maxSize?: number;
  acceptFile?: DropzoneOptions["accept"];
  multiple?: boolean;
  rules?: RegisterOptions<T>;
  enableDragAndDrop?: boolean;
  label?: string;
  readOnly?: boolean;
  onChange?: (files: File[]) => void;
}

const FileUpload = <T extends FieldValues>({
  control,
  name,
  fileType = MediaFileTypeEnum.DOCUMENT,
  acceptFile = ACCEPT_FILE.DOCUMENT,
  multiple = false,
  maxFiles = 1,
  maxSize = 10,
  rules,
  enableDragAndDrop = false,
  label,
  readOnly,
  onChange = () => null,
}: FileUploadProps<T>) => {
  const t = useTranslations();
  const { field, formState } = useController({
    name,
    control,
    rules,
  });
  const errors = get(formState, "errors", {});
  const isError = Boolean(get(errors, name));
  const fileTypeLabels = {
    [MediaFileTypeEnum.DOCUMENT]: t("document_files"),
    [MediaFileTypeEnum.IMAGE]: t("image_files"),
    [MediaFileTypeEnum.PLATFORM_DOCUMENT]: t("platform_document_files"),
  };

  const { dropzone } = useDropFile(
    {
      accept: acceptFile,
      maxSize: maxSize * MB_UNIT,
      maxFiles,
      multiple,
    },
    {
      onDropAccepted: (files: FileWithPath[]) => {
        field.onChange(files);
        onChange(files);
      },
      onReject: toast.error,
    }
  );

  const onRemoveFile = (fileName: string): void => {
    const newFiles = filter(
      field.value,
      (file) => get(file, "name") !== fileName
    );
    field.onChange(newFiles);
  };

  const renderUploadArea = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div
        {...dropzone.getRootProps()}
        className={cn(
          "flex flex-col items-center border-2 border-dashed rounded-lg p-6 text-center border-gray-200 dark:border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors duration-200 cursor-pointer",
          isError && "border-red-500"
        )}
      >
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <UploadCloud className="h-7 w-7 text-primary" />
        </div>
        {t.rich("drop_your_excel_file_here", {
          fileTypes: get(fileTypeLabels, fileType),
          drop: (chunk) => (
            <h3 className="text-lg font-medium text-foreground">{chunk}</h3>
          ),
          click: (chunk) => (
            <p className="text-muted-foreground mt-1">{chunk}</p>
          ),
          support: (chunk) => (
            <p className="text-muted-foreground mt-1">{chunk}</p>
          ),
          count: maxSize,
        })}
        <input {...dropzone.getInputProps()} />
      </div>
      {isError && <MessageError errors={errors} name={name} />}
    </motion.div>
  );

  const renderContent = (): React.JSX.Element => {
    if (enableDragAndDrop) {
      return (
        <>
          {renderUploadArea()}
          <AnimatePresence>
            {map(field.value, (acceptFile: FileWithPath) => (
              <motion.div
                key={acceptFile.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 items-center justify-between p-1 hover:bg-gray-100"
              >
                <div className="flex gap-1 items-center flex-1">
                  <File className="w-4 h-4" />
                  <p className="flex-1">{acceptFile.name}</p>
                </div>
                <Trash
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => onRemoveFile(acceptFile.name)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      );
    }

    return (
      <div
        {...dropzone.getRootProps()}
        className={cn("cursor-pointer", readOnly && "pointer-events-none")}
      >
        {label && (
          <label
            htmlFor={name}
            className="block text-muted-foreground mb-2 capitalize"
          >
            {label}
          </label>
        )}
        <div className="h-9 p-3 w-full flex items-center bg-muted rounded-md text-sm">
          <input {...dropzone.getInputProps()} />
          {t("upload_file")}
        </div>
      </div>
    );
  };

  return <div className="flex flex-col gap-2">{renderContent()}</div>;
};

export default FileUpload;
