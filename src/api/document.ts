import { dataSerialization } from "@/utils/helpers";

export const generateNewLineForm = (
  data: DocumentManagement.GenerateNLFData
): Promise<void> =>
  useHttpRequest({ url: "/new-line-forms", method: "POST", data });

export const getNewLineForms = (
  params: App.ListItemRequestParams
): Promise<App.ListItem<DocumentManagement.NewLineForm>> =>
  useHttpRequest({ url: "/new-line-forms", params });

export const deleteNLF = (id: string): Promise<void> =>
  useHttpRequest({ url: `/new-line-forms/${id}`, method: "DELETE" });

export const createDocument = (
  data: DocumentManagement.CreateDocumentData
): Promise<DocumentManagement.Document> => {
  const formData = dataSerialization(data);
  return useHttpRequest({
    url: "/documents",
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getDocuments = (
  params: DocumentManagement.DocumentParams
): Promise<App.ListItem<DocumentManagement.Document>> =>
  useHttpRequest({ url: "/documents", params });

export const deleteDocument = (id: string): Promise<void> =>
  useHttpRequest({ url: `/documents/${id}`, method: "DELETE" });

export const getDocument = (id: string): Promise<DocumentManagement.Document> =>
  useHttpRequest({ url: `/documents/${id}` });

export const shareDocument = (
  id: string,
  data: { companyIds: string[] }
): Promise<void> =>
  useHttpRequest({ url: `/documents/${id}/shares`, method: "POST", data });

export const getSharesOfDocument = (
  id: string,
  params: App.ListItemRequestParams
): Promise<App.ListItem<DocumentManagement.DocumentShare>> =>
  useHttpRequest({ url: `/documents/${id}/shares`, params });

export const deleteDocumentShare = (
  documentId: string,
  documentShareId: string
): Promise<void> =>
  useHttpRequest({
    url: `/documents/${documentId}/shares/${documentShareId}`,
    method: "DELETE",
  });
