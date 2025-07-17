import { useDropzone, ErrorCode } from "react-dropzone";
import { MB_UNIT } from "@/config/constants";
import type {
  Accept,
  DropzoneOptions,
  FileError,
  FileRejection,
} from "react-dropzone";

export const useDropFile = (
  config: DropzoneOptions,
  {
    onDrop,
    onReject,
    onDropAccepted,
  }: {
    onDrop?: DropzoneOptions["onDrop"];
    onDropAccepted?: DropzoneOptions["onDropAccepted"];
    onReject?: (message: string) => void;
  }
) => {
  const t = useTranslations();

  const getTypesByAcceptFiles = (accept?: Accept): string => {
    return reduce(accept, (types: string[], currentTypes: string[]) =>
      types.concat(currentTypes)
    )
      .join(", ")
      .replace(/\./gi, "");
  };

  const getRejectionError = (
    files: FileRejection[],
    { accept, maxSize, maxFiles }: DropzoneOptions
  ): string => {
    const errors = get(head(files), "errors");
    const fileTypes = getTypesByAcceptFiles(accept);
    const isWrongFormat = errors.some(
      (error: FileError) => error.code === ErrorCode.FileInvalidType
    );
    const isLargeFile = errors.some(
      (error: FileError) => error.code === ErrorCode.FileTooLarge
    );
    const isTooManyFiles = errors.some(
      (error: FileError) => error.code === ErrorCode.TooManyFiles
    );
    let errorMessage = "";
    if (isWrongFormat) {
      errorMessage = t("unsupported_file_format", { fileTypes });
    } else if (isLargeFile) {
      errorMessage = t("file_too_large_error", {
        fileSize: (maxSize as number) / MB_UNIT,
      });
    } else if (isTooManyFiles) {
      errorMessage = t("too_many_files_error", { maxFiles });
    } else {
      errorMessage = t("unknown_reason_error");
    }
    return errorMessage;
  };

  const onDropRejected = (files: FileRejection[]) => {
    if (onReject) {
      const message = getRejectionError(files, config);
      onReject(message);
    }
  };

  const dropzone = useDropzone({
    ...config,
    onDrop,
    onDropAccepted,
    onDropRejected,
  });

  return { dropzone };
};
