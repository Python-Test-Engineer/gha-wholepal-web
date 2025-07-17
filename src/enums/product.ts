export enum ProductInfoTabEnum {
  LINE_DETAILS = "line_details",
  PRICING = "pricing",
  PRODUCT_SPECIFICATIONS = "product_specifications",
  NUTRITION_VALUES = "nutrition_values",
  DIETARY_INFO = "dietary_info",
  COMPANY_CONTACTS = "company_information",
}

export enum DataInputTypeEnum {
  TEXT = "text",
  NUMBER = "number",
  FILE = "file",
  BOOLEAN = "boolean",
}

export enum FieldTypeEnum {
  SINGLE = "single",
  MULTIPLE = "multi",
  BOOLEAN = "bool",
}

export enum ProductConnectStatusEnum {
  PENDING = "pending",
  APPROVED = "connected",
  REJECTED = "rejected",
  READY_TO_UPDATE = "ready_to_update",
}

export enum ProductFileTypeEnum {
  PRIMARY_IMAGE = "primary_image",
  SECONDARY_IMAGE = "secondary_image",
  PRODUCT_CERTIFICATION = "product_certification",
  DOCUMENTS = "documents",
}

export enum ProductStatusEnum {
  TODO = "todo",
  AI_PROCESSING = "ai_processing",
  AI_DONE = "ai_processing_complete",
  AI_FAILED = "ai_failed",
  MANUAL_REVIEWING = "manual_reviewing",
  MANUAL_DONE = "manual_review_complete",
}

export enum ProductStepEnum {
  LINE_DETAILS = 1,
  NUTRITION_VALUES = 2,
  PRODUCT_SPECIFICATIONS = 3,
  DIETARY_INFO = 4,
  PRICING = 5,
}
