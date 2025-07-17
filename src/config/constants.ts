import { DocumentFileTypeEnum, ImageFileTypeEnum } from "@/enums/media";

export const DEFAULT_LANGUAGE = "en";
export const DATE_FORMAT = "YYYY/MM/DD";
export const DATE_TIME_FORMAT = "MMMM D, YYYY, HH:mm";
export const KEY_CODE = { SPACE: "Space" };

export const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const ITEM_VARIANTS = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])[^\n\s]{8,40}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MB_UNIT = 1000 * 1000; // 1MB

export const ACCEPT_FILE = {
  DOCUMENT: {
    [DocumentFileTypeEnum.PDF]: [".pdf"],
    [DocumentFileTypeEnum.XLS]: [".xls", ".xlsx"],
    [DocumentFileTypeEnum.DOC]: [".doc", ".docx"],
    [DocumentFileTypeEnum.CSV]: [".csv"],
    [DocumentFileTypeEnum.TSV]: [".tsv"],
  },
  IMAGE: {
    [ImageFileTypeEnum.JPEG]: [".jpg", ".jpeg"],
    [ImageFileTypeEnum.PNG]: [".png"],
    [ImageFileTypeEnum.SVG]: [".svg"],
    [ImageFileTypeEnum.HEIC]: [".heic"],
  },
  PLATFORM_DOCUMENT: {
    [DocumentFileTypeEnum.PDF]: [".pdf"],
    [DocumentFileTypeEnum.DOC]: [".doc", ".docx"],
    [DocumentFileTypeEnum.XLS]: [".xls", ".xlsx"],
    [DocumentFileTypeEnum.PPT]: [".ppt", ".pptx"],
    [DocumentFileTypeEnum.TXT]: [".txt"],
    [DocumentFileTypeEnum.CSV]: [".csv"],
    [DocumentFileTypeEnum.TSV]: [".tsv"],
    [ImageFileTypeEnum.JPEG]: [".jpg", ".jpeg"],
    [ImageFileTypeEnum.PNG]: [".png"],
    [ImageFileTypeEnum.GIF]: [".gif"],
    [ImageFileTypeEnum.BMP]: [".bmp"],
    [ImageFileTypeEnum.WEBP]: [".webp"],
    [ImageFileTypeEnum.SVG]: [".svg"],
  },
  PRODUCT_CERTIFICATION: {
    [ImageFileTypeEnum.JPEG]: [".jpg", ".jpeg"],
    [ImageFileTypeEnum.PNG]: [".png"],
    [ImageFileTypeEnum.SVG]: [".svg"],
    [ImageFileTypeEnum.HEIC]: [".heic"],
    [DocumentFileTypeEnum.PDF]: [".pdf"],
  },
};

export const MAIN_FIELD_KEYS = {
  PRODUCT_NAME: "product_name",
  SUPPLIER_NAME: "supplier_name",
  UNIT_BARCODE: "unit_barcode",
  CASE_BARCODE: "case_barcode",
  SERVING_SIZE: "serving_size",
  SKU_CODE: "sku_code",
  CATEGORY: "category",
  PRODUCT_CODE: "product_code",
};

export const WHOLEPAL_LINKS = {
  PRIVACY: "https://www.wholepal.com/privacy-policy",
  TERM: "https://www.wholepal.com/terms-of-use",
};
