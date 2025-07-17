declare namespace ProductManagement {
  import("@/enums/product");
  import type {
    DataInputTypeEnum,
    ProductInfoTabEnum,
    UnitTypeEnum,
    ProductStatusEnum,
    ProductConnectStatusEnum,
    FieldTypeEnum,
    ProductFileTypeEnum,
  } from "@/enums/product";

  interface Product {
    id: string;
    name: string;
    size: string;
    supplier: string;
    version: string;
    category: string;
    variant: string;
    createdAt: string;
    updatedAt: string;
    schemaItems: SchemaItem[];
    skuCode?: string;
    unitBarcode?: string;
    caseBarcode?: string;
    productCode?: string;
    image?: string;
    status?: ProductStatusEnum;
    files?: FileInfo[];
    currentStep?: number;
    productConnectStatus?: ProductConnectStatusEnum;
    productConnectId?: string;
    productVersionId?: string;
    versions?: ProductVersion[];
    latestVersionId?: string;
    wholesalerProductCode?: string;
  }

  interface ProductDataPoint {
    fieldId?: string;
    label: string;
    type: DataInputTypeEnum;
    showUnits: boolean;
    category?: string;
    fieldType: FieldTypeEnum;
    unitTypeArray?: UnitTypeEnum[];
    units?: string[];
    key: string;
  }

  interface ProductCategory {
    label: string;
    key: ProductInfoTabEnum;
    fields: ProductDataPoint[];
    sectionId: string;
    children?: ProductCategory[];
  }

  interface PendingProduct {
    id: string;
    wholesalerName: string;
    wholesalerId: string;
    createdAt: number;
  }

  interface AcceptedProduct {
    id: string;
    wholesalerId: string;
  }

  interface SchemaItem {
    id?: string;
    label?: string;
    value?: string | number | boolean;
    unit: string;
  }

  interface UpdateProgressData {
    items: SchemaItem[];
    currentStep?: number;
    isDone?: boolean;
  }

  interface ProductsParams extends App.ListItemRequestParams {
    keyword?: string;
    status?: ProductStatusEnum;
  }

  interface ProductVersion extends App.Entity {
    isLatest: boolean;
    productId: string;
    publisherId: string;
    version: number;
  }

  interface UploadImageData {
    type: ProductFileTypeEnum;
    image: File;
  }

  interface FileInfo {
    id: string;
    name: string;
    path: string;
    productId?: string;
    type?: ProductFileTypeEnum;
    url?: string;
  }
}
