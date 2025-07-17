export enum DocumentTypeEnum {
  NLF = "nlf",
  CERTIFICATION = "certification",
  MARKETING_MATERIAL = "marketing_material",
  PRODUCT_CATALOG = "product_catalog",
  OTHERS = "others",
}

export enum DocumentStatusEnum {
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum NewLineFormOutputFormatEnum {
  EXCEL = "excel",
  CSV = "csv",
}

export enum NewLineFormLayoutTypeEnum {
  ROW = "row",
  COLUMN = "column",
}

export enum MimeTypesEnum {
  JPG = "image/jpg",
  PNG = "image/png",
  JPEG = "image/jpeg",
  XLS = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  PPT = "application/vnd.ms-powerpoint",
  PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  PDF = "application/pdf",
  JSON = "application/json",
  TXT = "text/plain",
  CSV = "text/csv",
  TSV = "text/tab-separated-values",
  WEBP = "image/webp",
  HEIC = "image/heic",
  SVG = "image/svg+xml",
  GIF = "image/gif",
  BMP = "image/bmp",
}
