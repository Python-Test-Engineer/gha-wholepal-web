"use client";

import { Search, Table, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Input from "@/components/form-ui/input";
import { Layout } from "@/components/Layout";
import { useDebounce } from "ahooks";
import TableView from "./table-view";
import GridView from "./grid-view";

const SupplierProducts: FunctionComponent = () => {
  const t = useTranslations();
  const { control, watch } = useForm({ defaultValues: { search: "" } });
  const search = watch("search", "");
  const searchQuery = useDebounce(search);
  const [activeTab, setActiveTab] = useState("table");

  const renderHeader = (): React.JSX.Element => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {t("supplier_products")}
      </h1>
      <p className="text-muted-foreground">
        {t("browse_and_manage_products_provided_by_suppliers")}
      </p>
    </div>
  );

  const renderSearchAndFilter = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card p-4 rounded-lg mb-6 flex flex-col gap-4"
    >
      <Input
        name="search"
        control={control}
        placeholder={t("wholesaler_search_product_placeholder")}
        size="large"
        prefixIcon={<Search />}
      />
      <TabsList className="w-max">
        <TabsTrigger value="table" className="flex items-center gap-2">
          <Table className="w-4 h-4" />
          {t("table")}
        </TabsTrigger>
        <TabsTrigger value="grid" className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          {t("grid")}
        </TabsTrigger>
      </TabsList>
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
            <TableView searchQuery={trim(searchQuery)} />
          </TabsContent>
          <TabsContent value="grid">
            <GridView searchQuery={trim(searchQuery)} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SupplierProducts;
