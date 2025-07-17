"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Upload,
  FileUp,
  Check,
  FileText,
  AlertTriangle,
  UploadCloud,
  Table,
  FileSpreadsheet,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getProducts,
  exportProductsCSV,
  importProductsCSV,
  importProductsXLSX,
} from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [xlsxModalOpen, setXlsxModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [previewData, setPreviewData] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [fileFormat, setFileFormat] = useState("csv"); // csv or xlsx

  // Unique categories and suppliers for filters
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Fetching products with filters:", {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        supplier: selectedSupplier || undefined,
        page: currentPage,
        limit: productsPerPage,
      });

      const response = await getProducts({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        supplier: selectedSupplier || undefined,
        page: currentPage,
        limit: productsPerPage,
      });

      console.log("Products response:", response);

      if (response.success && response.data) {
        // Make sure we're accessing the right data structure
        const productData = response.data.products || [];

        console.log(`Received ${productData.length} products`);

        // Debug: log the first product if available
        if (productData.length > 0) {
          console.log("First product:", productData[0]);
        }

        setProducts(productData);
        setFilteredProducts(productData);

        // Extract unique categories and suppliers for filters
        if (productData.length > 0) {
          const uniqueCategories = [
            ...new Set(productData.map((p) => p.category).filter(Boolean)),
          ];

          const uniqueSuppliers = [
            ...new Set(productData.map((p) => p.supplier).filter(Boolean)),
          ];

          setCategories(uniqueCategories);
          setSuppliers(uniqueSuppliers);
        }
      } else {
        setError(response.error?.message || "Failed to load products");
        console.error("Error in products response:", response.error);
      }
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchTerm,
    selectedCategory,
    selectedSupplier,
    currentPage,
    productsPerPage,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click
  const handleRowClick = (productId) => {
    setSelectedRow(productId);

    // Navigate to product details after a short delay for the highlight effect
    setTimeout(() => {
      router.push(`/products/${productId}`);
    }, 200);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSupplier("");
  };

  // Open import modal with selected format
  const openImportModal = (format) => {
    setFileFormat(format);
    setSelectedFile(null);
    setPreviewData([]);
    setFileError("");
    setUploadProgress(0);
    setUploadStatus("idle");
    setActiveTab("upload");

    if (format === "csv") {
      setCsvModalOpen(true);
    } else {
      setXlsxModalOpen(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      setPreviewData([]);
      return;
    }

    // Validate file type based on format
    if (fileFormat === "csv") {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setFileError("Please select a valid CSV file");
        setSelectedFile(null);
        setPreviewData([]);
        return;
      }

      setSelectedFile(file);

      // Preview the CSV content
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const rows = text.toString().split("\n");
          const headers = rows[0].split(",").map((h) => h.trim());

          // Limit preview to first 10 rows for performance
          const maxPreviewRows = Math.min(rows.length, 10);
          const preview = [];

          for (let i = 1; i < maxPreviewRows; i++) {
            if (rows[i].trim()) {
              const values = rows[i].split(",").map((v) => v.trim());
              const row = {};
              headers.forEach((header, index) => {
                // Handle missing values gracefully
                row[header || `Column ${index + 1}`] = values[index] || "";
              });
              preview.push(row);
            }
          }

          setPreviewData(preview);
        } catch (err) {
          console.error("Error parsing CSV preview:", err);
          setFileError("Error parsing CSV file. Please check the format.");
        }
      };

      reader.readAsText(file);
    } else if (fileFormat === "xlsx") {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        setFileError("Please select a valid Excel file (.xlsx or .xls)");
        setSelectedFile(null);
        setPreviewData([]);
        return;
      }

      setSelectedFile(file);

      // Preview the XLSX content
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

          // Extract headers (first row)
          const headers = {};
          if (jsonData.length > 0) {
            Object.keys(jsonData[0]).forEach((key) => {
              headers[key] = jsonData[0][key] || key;
            });
          }

          // Process data rows (limit to 10 for preview)
          const processedData = [];
          const maxRows = Math.min(jsonData.length - 1, 10);

          for (let i = 1; i <= maxRows; i++) {
            if (jsonData[i]) {
              const row = {};
              Object.keys(jsonData[i]).forEach((key) => {
                const headerName = headers[key] || key;
                row[headerName] = jsonData[i][key];
              });
              processedData.push(row);
            }
          }

          setPreviewData(processedData);
        } catch (err) {
          console.error("Error parsing XLSX preview:", err);
          setFileError("Error parsing Excel file. Please check the format.");
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Handle file upload (CSV or XLSX)
  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError("Please select a file first");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      let response;

      if (fileFormat === "csv") {
        response = await importProductsCSV(selectedFile);
      } else {
        response = await importProductsXLSX(selectedFile);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setUploadStatus("success");
        toast.success(
          `Successfully imported ${response.data?.count || 0} products`
        );

        // Force a delay before closing modal and refreshing
        setTimeout(() => {
          if (fileFormat === "csv") {
            setCsvModalOpen(false);
          } else {
            setXlsxModalOpen(false);
          }

          // Reset state immediately
          setSelectedFile(null);
          setPreviewData([]);
          setUploadProgress(0);
          setActiveTab("upload");

          // Force refresh products with a clean state
          setSearchTerm("");
          setSelectedCategory("");
          setSelectedSupplier("");
          setCurrentPage(1);

          // Add small delay before fetching products
          setTimeout(() => {
            fetchProducts();
          }, 500);

          setUploadStatus("idle");
        }, 1500);
      } else {
        // Error handling as before
      }
    } catch (err) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setFileError("An unexpected error occurred during upload");
      console.error(`Error uploading ${fileFormat.toUpperCase()}:`, err);
    }
  };

  // Handle export
  const handleExport = () => {
    exportProductsCSV();
  };

  // Reset modal state when closed
  const handleModalClose = () => {
    if (uploadStatus !== "uploading") {
      if (fileFormat === "csv") {
        setCsvModalOpen(false);
      } else {
        setXlsxModalOpen(false);
      }

      // Reset state after animation completes
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewData([]);
        setFileError("");
        setUploadProgress(0);
        setUploadStatus("idle");
        setActiveTab("upload");
      }, 300);
    }
  };

  // Rest of the component remains the same until the buttons section

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-background min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">
            Browse and manage your wholesale product catalog
          </p>
        </div>

        {/* Search and Filter Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card p-4 rounded-lg mb-6"
        >
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by product name, description, barcode, or supplier..."
              className="w-full bg-muted border-none pl-10 text-foreground placeholder:text-muted-foreground py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mb-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              className="text-foreground flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={resetFilters}
                variant="ghost"
                className="text-muted-foreground flex items-center gap-2"
                disabled={!searchTerm && !selectedCategory && !selectedSupplier}
              >
                <X className="h-4 w-4" />
                Reset
              </Button>

              {/* Import buttons - now with dropdown or multiple buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => openImportModal("csv")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Connect
                </Button>
                <Button
                  onClick={() => openImportModal("csv")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <Table className="h-4 w-4" />
                  Import CSV
                </Button>

                <Button
                  onClick={() => openImportModal("xlsx")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Import Excel
                </Button>
              </div>

              <Button
                onClick={handleExport}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* ...rest of the component remains the same... */}
        </motion.div>

        {/* Add this right after the motion.div containing search and filter */}

        {/* Products Table */}
        <div className="bg-card rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading products...
              </span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center p-12 text-red-500">
              <AlertCircle className="h-6 w-6 mr-2" />
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Your product catalog is empty. Import products or add new ones
                to get started.
              </p>
              <Button
                onClick={() => openImportModal("xlsx")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import Products
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map(
                      (product: {
                        id: string;
                        name: string;
                        category: string;
                        supplier: string;
                        processed: string;
                        version: string;
                      }) => (
                        <tr
                          key={product.id}
                          className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                            selectedRow === product.id ? "bg-primary/10" : ""
                          }`}
                          onClick={() => handleRowClick(product.id)}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">
                              {product.name || "Unnamed Product"}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {product.category || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {product.supplier || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.processed === "yes"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {product.processed === "yes"
                                ? "Processed"
                                : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {product.version || "1.0"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80 hover:bg-background"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/products/${product.id}`);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {products.length > 0 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-border">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage * productsPerPage >= products.length
                      }
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstProduct + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastProduct, products.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{products.length}</span>{" "}
                        products
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-l-md"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page numbers */}
                        {[
                          ...Array(
                            Math.ceil(products.length / productsPerPage)
                          ),
                        ].map((_, index) => (
                          <Button
                            key={index}
                            variant={
                              currentPage === index + 1 ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => paginate(index + 1)}
                            className={`${
                              currentPage === index + 1
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {index + 1}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-r-md"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={
                            currentPage * productsPerPage >= products.length
                          }
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* CSV Import Modal */}
        <Dialog open={csvModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5 text-primary" />
                Import Products from CSV
              </DialogTitle>
              <DialogDescription>
                Upload a CSV file to import multiple products at once
              </DialogDescription>
            </DialogHeader>

            {/* ...rest of your CSV modal content... */}
          </DialogContent>
        </Dialog>

        {/* XLSX Import Modal */}
        {/* Replace your XLSX Import Modal with this improved version */}
        <Dialog open={xlsxModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Import Products from Excel
              </DialogTitle>
              <DialogDescription>
                Upload an Excel file (.xlsx or .xls) to import multiple products
                at once
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-1">
              <Tabs
                defaultValue="upload"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger
                    value="upload"
                    disabled={uploadStatus === "uploading"}
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="template"
                    disabled={uploadStatus === "uploading"}
                  >
                    Template
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  {/* Upload Status */}
                  {uploadStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Upload Successful!
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Your products have been imported successfully.
                      </p>
                    </div>
                  ) : uploadStatus === "error" ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Upload Failed
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        {fileError ||
                          "There was an error importing your products. Please try again."}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setUploadStatus("idle")}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* File Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          fileError
                            ? "border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                            : selectedFile
                            ? "border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                            : "border-gray-100 dark:border-gray-300 hover:border-primary hover:bg-primary/5"
                        } transition-colors duration-200 cursor-pointer relative`}
                        onClick={() =>
                          document.getElementById("xlsxFileUpload")?.click()
                        }
                      >
                        <input
                          type="file"
                          id="xlsxFileUpload"
                          accept=".xlsx,.xls"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={uploadStatus === "uploading"}
                        />

                        <div className="flex flex-col items-center">
                          {selectedFile ? (
                            <>
                              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <FileSpreadsheet className="h-7 w-7 text-primary" />
                              </div>
                              <h3 className="text-lg font-medium text-foreground">
                                {selectedFile.name}
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {(selectedFile.size / 1024).toFixed(1)} KB ·
                                Excel
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFile(null);
                                  setPreviewData([]);
                                }}
                                disabled={uploadStatus === "uploading"}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <UploadCloud className="h-7 w-7 text-primary" />
                              </div>
                              <h3 className="text-lg font-medium text-foreground">
                                Drop your Excel file here
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                or click to browse your files
                              </p>
                              <p className="text-xs text-muted-foreground mt-3">
                                Supports Excel files (.xlsx, .xls) up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Error Message */}
                      {fileError && (
                        <div className="text-red-500 text-sm flex items-center mt-2">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {fileError}
                        </div>
                      )}

                      {/* Preview - This uses the improved preview code from the first artifact */}
                      {previewData.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Preview:{" "}
                            <span className="text-xs text-muted-foreground">
                              (showing {previewData.length} rows)
                            </span>
                          </h4>
                          <div className="border rounded-md overflow-hidden">
                            <div className="max-h-60 overflow-y-auto overflow-x-auto">
                              <table className="w-full table-fixed">
                                <thead className="bg-muted sticky top-0 z-10">
                                  <tr>
                                    {Object.keys(previewData[0]).map(
                                      (header, index) => (
                                        <th
                                          key={index}
                                          className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap"
                                          style={{ maxWidth: "150px" }}
                                        >
                                          {header}
                                        </th>
                                      )
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {previewData.map((row, rowIndex) => (
                                    <tr
                                      key={rowIndex}
                                      className="border-t border-border hover:bg-muted/50"
                                    >
                                      {Object.entries(row).map(
                                        ([_, value], cellIndex) => (
                                          <td
                                            key={cellIndex}
                                            className="px-3 py-2 text-xs text-foreground"
                                            style={{ maxWidth: "150px" }}
                                          >
                                            <div
                                              className="truncate"
                                              title={String(value || "")}
                                            >
                                              {String(value || "")}
                                            </div>
                                          </td>
                                        )
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedFile
                              ? `Showing ${previewData.length} of ${
                                  selectedFile.name.split(".")[0]
                                } rows (preview)`
                              : ""}
                          </p>
                        </div>
                      )}

                      {/* Upload Progress */}
                      {uploadStatus === "uploading" && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-foreground">
                              Uploading...
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {uploadProgress}%
                            </span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent
                  value="template"
                  className="space-y-4 overflow-y-auto pr-1"
                >
                  <div className="border rounded-lg p-4">
                    <h3 className="text-md font-medium text-foreground mb-2">
                      Excel Template Format
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your Excel file should include the following columns:
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-full mb-4">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                              Column Name
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                              Required
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-xs text-foreground">
                              Name
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Yes
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Product name
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-xs text-foreground">
                              Version
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              No
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Product version (defaults to 1.0)
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-xs text-foreground">
                              Processed
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              No
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Processing status (yes/no)
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-xs text-foreground">
                              Description
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              No
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Product description
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-xs text-foreground">
                              Category
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              No
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Product category
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-xs text-foreground">
                              Supplier
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              No
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              Supplier name
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 flex items-center"
                      onClick={() => {
                        // TODO: Download template
                        toast.success("Excel template download started");
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="mt-2 pt-2 border-t">
              <Button
                variant="outline"
                onClick={handleModalClose}
                disabled={uploadStatus === "uploading"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={
                  !selectedFile ||
                  uploadStatus === "uploading" ||
                  uploadStatus === "success"
                }
                className={`${
                  uploadStatus === "uploading" ? "opacity-80" : ""
                }`}
              >
                {uploadStatus === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Products
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
