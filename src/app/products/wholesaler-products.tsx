"use client";

import { Search, X, Plus, Download, Table, LayoutGrid } from "lucide-react";
import { useDebounce } from "ahooks";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/form-ui/button";
import Input from "@/components/form-ui/input";
import { Layout } from "@/components/Layout";
import { exportProductsToCSV } from "@/api/product";
import { downloadFile } from "@/utils/helpers";
import useWholesalerProductList from "./use-wholesaler-product-list";
import WholeSalerProductsTable from "./wholesaler-products-table";
import WholeSalerProductsGrid from "./wholesaler-products-grid";

const WholeSalerProducts: FunctionComponent = () => {
  const t = useTranslations();
  const router = useRouter();
  const { control, watch, reset } = useForm({ defaultValues: { search: "" } });
  const search = watch("search", "");
  const searchQuery = useDebounce(search);
  const [activeTab, setActiveTab] = useState("table");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const isTable = activeTab === "table";
  const {
    productListQuery,
    productInfinityListQuery,
    pagination,
    onChangePage,
  } = useWholesalerProductList(trim(searchQuery), isTable);

  const exportCSVMutation = useMutation({
    mutationFn: (ids: string[]) => exportProductsToCSV(ids, true),
    onSuccess: (response) => downloadFile("product-list.csv", response),
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const renderHeader = (): React.JSX.Element => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {t("my_products")}
      </h1>
      <p className="text-muted-foreground">
        {t("supplier_products_description")}
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
        placeholder={t("wholesaler_search_product_placeholder")}
        size="large"
        prefixIcon={<Search />}
      />
      <div className="flex items-center justify-between">
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
        <div className="flex justify-end items-center gap-2 mt-4 mb-2">
          <Button
            label={t("reset")}
            icon={<X className="h-4 w-4" />}
            variant="ghost"
            className="text-muted-foreground flex items-center gap-2"
            disabled={!searchQuery}
            onClick={() => reset()}
          />

          <Button
            label={t("add_products")}
            icon={<Plus className="h-4 w-4" />}
            onClick={() => router.push("/supplier-products")}
          />
          <Button
            label={t("export_to_csv")}
            icon={<Download className="h-4 w-4" />}
            loading={exportCSVMutation.isPending}
            disabled={isEmpty(selectedProductIds)}
            onClick={() => exportCSVMutation.mutate(selectedProductIds)}
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
          onValueChange={setActiveTab}
          className="w-full"
        >
          {renderSearchAndFilter()}
          <TabsContent value="table">
            <WholeSalerProductsTable
              productListQuery={productListQuery}
              pagination={pagination}
              onChangePage={onChangePage}
              setSelectedProductIds={setSelectedProductIds}
            />
          </TabsContent>
          <TabsContent value="grid">
            <WholeSalerProductsGrid
              productInfinityListQuery={productInfinityListQuery}
              setSelectedProductIds={setSelectedProductIds}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WholeSalerProducts;
