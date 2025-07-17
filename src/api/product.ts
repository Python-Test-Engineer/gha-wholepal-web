import { ProductConnectStatusEnum } from "@/enums/product";
import { dataSerialization } from "@/utils/helpers";

export const uploadProducts = (files: File[]): Promise<{ message: string }> => {
  const formData = new FormData();

  forEach(files, (file) => {
    formData.append("inFiles", file);
  });

  return useHttpRequest({
    url: "/products/submit-documents",
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProducts = (
  params: ProductManagement.ProductsParams
): Promise<App.ListItem<ProductManagement.Product>> =>
  useHttpRequest({ url: "/products", params });

export const getProductDetails = (
  id: string,
  isVersion = false
): Promise<ProductManagement.Product> => {
  const endpoint = isVersion ? `/product-versions/${id}` : `/products/${id}`;
  return useHttpRequest({ url: endpoint });
};

export const getSchema = (): Promise<ProductManagement.ProductCategory[]> =>
  useHttpRequest({ url: "/schemas" });

export const updateProductProgress = (
  productId: string,
  data: ProductManagement.UpdateProgressData
): Promise<ProductManagement.Product> =>
  useHttpRequest({
    url: `/products/${productId}/values`,
    method: "PATCH",
    data,
  });

export const createProduct = (data: {
  items: ProductManagement.SchemaItem[];
}): Promise<{ message: string; productId: string }> =>
  useHttpRequest({ url: "/products", method: "POST", data });

export const getSupplierProducts = (
  params: ProductManagement.ProductsParams
): Promise<App.ListItem<ProductManagement.Product>> =>
  useHttpRequest({ url: "/supplier-products", params });

export const connectProduct = (productVersionId: string): Promise<void> =>
  useHttpRequest({
    url: `/products/${productVersionId}/connect-product`,
    method: "POST",
  });

export const updateConnectVersion = (
  productConnectId: string,
  productVersionId: string
): Promise<void> =>
  useHttpRequest({
    url: `/products/update-connect-version/${productConnectId}`,
    method: "PATCH",
    data: { productVersionId },
  });

export const updateConnectStatus = (
  productVersionId: string,
  data: {
    status: ProductConnectStatusEnum;
    companyId: string;
    notificationId: string;
  }
) =>
  useHttpRequest({
    url: `/products/${productVersionId}/connect-product`,
    method: "PATCH",
    data,
  });

export const publishProduct = (productId: string): Promise<void> =>
  useHttpRequest({ url: `/products/${productId}/publish`, method: "POST" });

export const getWholesalerProducts = (
  params: ProductManagement.ProductsParams
): Promise<App.ListItem<ProductManagement.Product>> =>
  useHttpRequest({ url: "/wholesaler-products", params });

export const uploadImage = (
  productId: string,
  data: ProductManagement.UploadImageData
): Promise<void> => {
  const formData = dataSerialization(data);

  return useHttpRequest({
    url: `/products/${productId}/upload-image`,
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const exportProductToCSV = (
  id: string,
  isVersion: boolean
): Promise<string> => {
  const endpoint = isVersion
    ? `/product-versions/${id}/export-csv`
    : `/products/${id}/export-csv`;

  return useHttpRequest({
    url: endpoint,
    responseType: "blob",
  });
};

export const exportProductsToCSV = (
  ids: string[],
  isVersion = false
): Promise<string> => {
  const endpoint = isVersion
    ? "/product-versions/export-csv-list"
    : "/products/export-csv-list";
  return useHttpRequest({
    url: endpoint,
    method: "POST",
    data: { ids },
    responseType: "blob",
  });
};

export const deleteProduct = (productId: string): Promise<void> =>
  useHttpRequest({ url: `/products/${productId}`, method: "DELETE" });

export const updateProductCustomAttributes = (
  productId: string,
  data: { productCode: string }
): Promise<void> =>
  useHttpRequest({
    url: `/products/${productId}/custom-attributes`,
    method: "PATCH",
    data,
  });

export const updateConnectedProductCustomAttributes = (
  productConnectId: string,
  data: { productCode: string }
): Promise<void> =>
  useHttpRequest({
    url: `/wholesaler-products/${productConnectId}/custom-attributes`,
    method: "PATCH",
    data,
  });
