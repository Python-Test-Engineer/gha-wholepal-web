declare namespace DocumentManagement {
  import("@/enums/document");
  import {
    DocumentTypeEnum,
    DocumentStatusEnum,
    NewLineFormOutputFormatEnum,
    NewLineFormLayoutTypeEnum,
    MimeTypesEnum,
  } from "@/enums/document";
  interface TradePartner extends App.Entity {
    name: string;
  }

  interface UploadNewLineFormData {
    tradePartnerName: string;
    file: File;
  }

  interface GenerateNLFData {
    documentId: string;
    productIds: string[];
    outputFormat: NewLineFormOutputFormatEnum;
    layoutType: NewLineFormLayoutTypeEnum;
  }

  interface CreateDocumentData {
    file: File;
    type: DocumentTypeEnum;
    name: string;
  }

  interface FileMetadata {
    name: string;
    size: number;
    mimetype: MimeTypesEnum;
  }

  interface Document extends App.Entity {
    name: string;
    path: string;
    fileMetadata: FileMetadata;
    type: DocumentTypeEnum;
    nlfMaxProduct: number;
    nlfMetadata: FileMetadata;
    companyId: string;
    userId: string;
    status: DocumentStatusEnum;
    company?: CompanyManagement.Company;
    user?: Auth.User;
    url: string;
  }

  interface DocumentParams extends App.ListItemRequestParams {
    type?: DocumentTypeEnum;
    status?: DocumentStatusEnum;
    name?: string;
  }

  interface DocumentShare extends App.Entity {
    company: CompanyManagement.Company;
    companyId: string;
    document: Document;
    documentId: string;
    userId: string;
    user: Auth.User;
  }

  interface NewLineForm extends App.Entity {
    companyId: string;
    document: Document;
    documentId: string;
    options: {
      layoutType: NewLineFormLayoutTypeEnum;
      outputFormat: NewLineFormOutputFormatEnum;
    };
    path: string;
    productIds: string[];
    status: DocumentStatusEnum;
    user: Auth.User;
    userId: string;
    url?: string;
  }
}
