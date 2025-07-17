/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from "axios";

const apiUrl = API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    [key: string]: any;
  };
  status?: number;
}

export const getUserProfile = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get("/user/profile");
    return { success: true, data: response.data.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data || { message: "Network error occurred" },
      status: axiosError.response?.status,
    };
  }
};

export const updateUserProfile = async (
  profileData: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put("/user/profile", profileData);
    return { success: true, data: response.data.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data || { message: "Network error occurred" },
      status: axiosError.response?.status,
    };
  }
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post("/user/password", {
      currentPassword,
      newPassword,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data || { message: "Network error occurred" },
      status: axiosError.response?.status,
    };
  }
};

export const getProducts = async (
  params: {
    search?: string;
    category?: string;
    supplier?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<ApiResponse<any>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.supplier) queryParams.append("supplier", params.supplier);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    console.log("Fetching products with params:", params);

    const response = await api.get(`/products?${queryParams.toString()}`);

    console.log("Products API response:", response.data);

    // Make sure we're processing the correct data structure
    if (response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
      };
    } else if (response.data && response.data.success) {
      // Alternative structure sometimes returned by APIs
      return {
        success: true,
        data: response.data,
      };
    } else {
      // Unexpected response structure
      console.error("Unexpected API response structure:", response.data);
      return {
        success: false,
        error: { message: "Unexpected API response format" },
      };
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data || { message: "Network error occurred" },
      status: axiosError.response?.status,
    };
  }
};

export const importProductsCSV = async (
  file: File
): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/products/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data || { message: "Network error occurred" },
      status: axiosError.response?.status,
    };
  }
};

// Export all products to CSV
export const exportProductsCSV = async (): Promise<void> => {
  try {
    // TODO: This needs to be handled differently since we want to trigger a download
    const response = await api.get("/products/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();

    // TODO: Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting products:", error);
    // TODO: Show a notification to the user here
  }
};

export const importProductsXLSX = async (
  file: File
): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/products/import-xlsx", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data || { message: "Network error occurred" },
      status: axiosError.response?.status,
    };
  }
};

export const exportProductsDemo = async (
  products: ProductManagement.Product[]
): Promise<void> => {
  try {
    const response = await api.post(
      "/products/export-demo",
      { products },
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();

    // TODO: Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    console.error("Export error details:", axiosError);
  }
};

export default api;
