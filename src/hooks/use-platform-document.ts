import { DocumentTypeEnum, MimeTypesEnum } from "@/enums/document";

const usePlatformDocument = () => {
  const t = useTranslations();

  const convertBytesToMB = (bytes: number): string => {
    if (bytes) {
      const megabytes = bytes / (1024 * 1024);
      return t("megabytes", { megabytes: megabytes.toFixed(2) });
    }
    return "-";
  };

  const getFileType = (fileType: DocumentTypeEnum): string => {
    switch (fileType) {
      case DocumentTypeEnum.CERTIFICATION:
        return t("certification");
      case DocumentTypeEnum.MARKETING_MATERIAL:
        return t("marketing_material");
      case DocumentTypeEnum.PRODUCT_CATALOG:
        return t("product_catalog");
      case DocumentTypeEnum.OTHERS:
        return t("others");
      default:
        return "-";
    }
  };

  const getMimetype = (mimetype: MimeTypesEnum): string => {
    switch (mimetype) {
      case MimeTypesEnum.DOC:
        return t("doc");
      case MimeTypesEnum.DOCX:
        return t("docx");
      case MimeTypesEnum.JPEG:
        return t("jpeg");
      case MimeTypesEnum.JPG:
        return t("jpg");
      case MimeTypesEnum.JSON:
        return t("json");
      case MimeTypesEnum.PDF:
        return t("pdf");
      case MimeTypesEnum.PNG:
        return t("png");
      case MimeTypesEnum.PPT:
        return t("ppt");
      case MimeTypesEnum.PPTX:
        return t("pptx");
      case MimeTypesEnum.XLS:
        return t("xls");
      case MimeTypesEnum.XLSX:
        return t("xlsx");
      case MimeTypesEnum.TXT:
        return t("txt");
      case MimeTypesEnum.CSV:
        return t("csv");
      case MimeTypesEnum.TSV:
        return t("tsv");
      case MimeTypesEnum.BMP:
        return t("bmp");
      case MimeTypesEnum.GIF:
        return t("gif");
      case MimeTypesEnum.HEIC:
        return t("heic");
      case MimeTypesEnum.SVG:
        return t("svg");
      case MimeTypesEnum.WEBP:
        return t("webp");
      default:
        return "-";
    }
  };

  return { convertBytesToMB, getFileType, getMimetype };
};

export default usePlatformDocument;
