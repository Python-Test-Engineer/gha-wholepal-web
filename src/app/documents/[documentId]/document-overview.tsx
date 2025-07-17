"use client";

import { DATE_TIME_FORMAT } from "@/config/constants";
import { DocumentStatusEnum } from "@/enums/document";
import usePlatformDocument from "@/hooks/use-platform-document";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Download, XCircle } from "lucide-react";

const DocumentOverview: FunctionComponent<{
  document: DocumentManagement.Document;
}> = ({ document }) => {
  const t = useTranslations();
  const { formatDate } = useDateTime(DATE_TIME_FORMAT);
  const { convertBytesToMB, getFileType } = usePlatformDocument();
  const { downloadFileMutation } = useDownloadFile();

  const getStatusBadge = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.COMPLETED:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs w-max">
            <CheckCircle className="h-3 w-3" />
            {t("completed")}
          </span>
        );

      case DocumentStatusEnum.FAILED:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs w-max">
            <XCircle className="h-3 w-3" />
            {t("failed")}
          </span>
        );
      case DocumentStatusEnum.PROCESSING:
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs w-max">
            <Clock className="h-3 w-3" />
            {t("processing")}
          </span>
        );
    }
  };

  const renderDownload = (): React.JSX.Element => (
    <div
      className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 transition-colors cursor-pointer"
      onClick={() =>
        downloadFileMutation.mutate({
          url: document.url,
          fileName: get(document, "name"),
        })
      }
    >
      <Download className="w-4 h-4" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="lg:col-span-3"
    >
      <p className="p-3 bg-background text-foreground font-medium">
        {t("quick_document_overview")}
      </p>
      <div className="bg-card p-4 rounded-lg">
        <table className="w-full">
          <tbody>
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">File name:</td>
              <td className="py-2 text-foreground">
                <div className="w-full inline-flex items-center justify-between gap-2 flex-wrap">
                  {document.name}
                  {renderDownload()}
                </div>
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">Type:</td>
              <td className="py-2 text-foreground">
                {getFileType(document.type)}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">Status:</td>
              <td className="py-2 text-foreground">
                {getStatusBadge(document.status)}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">Company:</td>
              <td className="py-2 text-foreground">
                {get(document, "company.name")}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">Created by:</td>
              <td className="py-2 text-foreground">
                {get(document, "user.fullName")}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">File size:</td>
              <td className="py-2 text-foreground">
                {convertBytesToMB(get(document, "fileMetadata.size"))}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground align-top">Created:</td>
              <td className="py-2 text-foreground">
                {formatDate(document.createdAt)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DocumentOverview;
