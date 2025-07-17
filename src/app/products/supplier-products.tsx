"use client";

import {
  Search,
  X,
  Plus,
  Download,
  Upload,
  LayoutGrid,
  Table,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useDebounce } from "ahooks";
import { motion } from "framer-motion";
import Button from "@/components/form-ui/button";
import Input from "@/components/form-ui/input";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupplierProductsTable from "./supplier-products-table";
import SupplierProductsGrid from "./supplier-products-grid";
import useProductList from "./use-product-list";
import { exportProductsToCSV } from "@/api/product";
import { downloadFile } from "@/utils/helpers";
import { ProductStatusEnum } from "@/enums/product";

const UploadProductDialog = lazyload(
  () => import("@/dialog/upload-product-dialog")
);
const ManuallyInputProductDialog = lazyload(
  () => import("@/dialog/manually-input-product-dialog")
);
const ExportCSVDialog = lazyload(() => import("@/dialog/export-csv-dialog"));
const GenerateNewLineFormSheet = lazyload(
  () => import("@/sheet/generate-new-line-form-sheet")
);

const SupplierProducts: FunctionComponent = () => {
  const t = useTranslations();
  const { control, watch, reset } = useForm({ defaultValues: { search: "" } });
  const search = watch("search", "");
  const searchQuery = useDebounce(search);
  const { modal, openModal, closeModal } = useModalState([
    "uploadProducts",
    "addProduct",
    "exportCSV",
    "generateNewLineForm",
  ]);
  const [selectedProducts, setSelectedProducts] = useState<
    ProductManagement.Product[]
  >([]);
  const [activeTab, setActiveTab] = useState("table");
  const isTable = activeTab === "table";

  const {
    productListQuery,
    productInfinityListQuery,
    pagination,
    onChangePage,
  } = useProductList(trim(searchQuery), isTable);

  const refetch = isTable
    ? productListQuery.refetch
    : productInfinityListQuery.refetch;

  const exportCSVMutation = useMutation({
    mutationFn: exportProductsToCSV,
    onSuccess: (response) => downloadFile("product-list.csv", response),
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const onChangeTab = (tab: string) => {
    setSelectedProducts([]);
    setActiveTab(tab);
  };

  const renderHeader = (): React.JSX.Element => (
    <div className="mb-6 from-yellow-500">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {t("my_products")}
      </h1>
      <p className="text-muted-foreground">
        {t("browse_and_manage_your_products")}
      </p>
    </div>
  );

  const renderSearchAndFilter = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card p-4 rounded-lg mb-6"
    >
      <Input
        name="search"
        control={control}
        placeholder={t("supplier_search_product_placeholder")}
        size="large"
        prefixIcon={<Search />}
      />

      <div className="flex justify-between items-center gap-2 mt-4 mb-2">
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            {t("table")}
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            {t("grid")}
          </TabsTrigger>
        </TabsList>
        <div className="flex justify-end items-center gap-2">
          <Button
            label={t("reset")}
            variant="ghost"
            className="text-muted-foreground flex items-center gap-2"
            disabled={!searchQuery}
            icon={<X className="h-4 w-4" />}
            onClick={() => reset()}
          />
          <Button
            label={t("manually_input_product")}
            icon={<Plus className="h-4 w-4" />}
            onClick={() => openModal("addProduct")}
          />
          <Button
            label={t("upload_products")}
            icon={<Upload className="h-4 w-4" />}
            onClick={() => openModal("uploadProducts")}
          />
          <Button
            label={t("generate_completed_new_line_form")}
            onClick={() => openModal("generateNewLineForm")}
          />
          <Button
            label={t("export_to_csv")}
            icon={<Download className="h-4 w-4" />}
            loading={exportCSVMutation.isPending}
            disabled={isEmpty(selectedProducts)}
            onClick={() =>
              exportCSVMutation.mutate(
                map(
                  filter(selectedProducts, {
                    status: ProductStatusEnum.MANUAL_DONE,
                  }),
                  "id"
                )
              )
            }
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {renderHeader()}
        <Tabs
          defaultValue="table"
          value={activeTab}
          onValueChange={onChangeTab}
          className="w-full"
        >
          {renderSearchAndFilter()}
          <TabsContent value="table">
            <SupplierProductsTable
              productListQuery={productListQuery}
              pagination={pagination}
              onChangePage={onChangePage}
              setSelectedProducts={setSelectedProducts}
            />
          </TabsContent>
          <TabsContent value="grid">
            <SupplierProductsGrid
              productInfinityListQuery={productInfinityListQuery}
              setSelectedProducts={setSelectedProducts}
            />
          </TabsContent>
        </Tabs>
        {modal.uploadProducts.load && (
          <UploadProductDialog
            open={modal.uploadProducts.open}
            onClose={closeModal("uploadProducts")}
            refetchProducts={refetch}
          />
        )}
        {modal.addProduct.load && (
          <ManuallyInputProductDialog
            open={modal.addProduct.open}
            refetch={refetch}
            onClose={closeModal("addProduct")}
          />
        )}
        {modal.exportCSV.load && (
          <ExportCSVDialog
            open={modal.exportCSV.open}
            ids={map(
              filter(selectedProducts, {
                status: ProductStatusEnum.MANUAL_DONE,
              }),
              "id"
            )}
            onClose={closeModal("exportCSV")}
          />
        )}
        {modal.generateNewLineForm.load && (
          <GenerateNewLineFormSheet
            open={modal.generateNewLineForm.open}
            products={filter(selectedProducts, {
              status: ProductStatusEnum.MANUAL_DONE,
            })}
            onClose={closeModal("generateNewLineForm")}
          />
        )}
      </div>
    </Layout>
  );
};

export default SupplierProducts;
