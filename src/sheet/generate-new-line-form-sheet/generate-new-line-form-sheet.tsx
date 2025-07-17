"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import BaseSheet from "@/sheet/base-sheet";
import Input from "@/components/form-ui/input";
import Button from "@/components/form-ui/button";
import { generateNewLineForm, getDocuments } from "@/api/document";
import { Box, CircleX, InfoIcon, Loader2 } from "lucide-react";
import Popover from "@/components/form-ui/popover";
import { useDebounce } from "ahooks";
import UploadNLFTemplate from "./upload-nlf-template";
import { getProducts } from "@/api/product";
import {
  DocumentTypeEnum,
  NewLineFormLayoutTypeEnum,
  NewLineFormOutputFormatEnum,
} from "@/enums/document";
import Select from "@/components/form-ui/select";
import { ProductStatusEnum } from "@/enums/product";
import Scrollbars from "react-custom-scrollbars-2";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GenerateNewLineFormSheet: FunctionComponent<{
  open: boolean;
  products: ProductManagement.Product[];
  onClose: () => void;
}> = ({ open, products, onClose }) => {
  const t = useTranslations();
  const { control, watch, setValue, reset, handleSubmit } = useForm({
    defaultValues: {
      searchTemplate: "",
      searchProduct: "",
      layoutType: NewLineFormLayoutTypeEnum.ROW,
      outputFormat: NewLineFormOutputFormatEnum.EXCEL,
    },
  });
  const [searchTemplate, searchProduct] = watch([
    "searchTemplate",
    "searchProduct",
  ]);
  const searchTemplateQuery = useDebounce(searchTemplate);
  const searchProductQuery = useDebounce(searchProduct);
  const [view, setView] = useState<
    "searchTemplate" | "uploadNLF" | "generateNLF"
  >("searchTemplate");
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(products);
  const searchTemplateRef = useRef(null);
  const searchProductRef = useRef(null);

  const outputFormatOptions = [
    {
      label: t("excel"),
      value: NewLineFormOutputFormatEnum.EXCEL,
    },
    {
      label: t("csv"),
      value: NewLineFormOutputFormatEnum.CSV,
    },
  ];

  const layoutTypeOptions = [
    {
      label: t("row"),
      value: NewLineFormLayoutTypeEnum.ROW,
    },
    {
      label: t("column"),
      value: NewLineFormLayoutTypeEnum.COLUMN,
    },
  ];

  const [documentsQuery, productsQuery] = useMultipleRequests([
    {
      queryKey: ["getDocuments", { searchTemplateQuery }],
      queryFn: () =>
        getDocuments({ name: searchTemplateQuery, type: DocumentTypeEnum.NLF }),
    },
    {
      queryKey: ["getProducts", { searchProductQuery }],
      queryFn: () =>
        getProducts({
          keyword: searchProductQuery,
          status: ProductStatusEnum.MANUAL_DONE,
        }),
      enabled: Boolean(searchTemplate),
    },
  ]);

  useEffect(() => {
    if (documentsQuery.isError) {
      toast.error(documentsQuery.error.message);
    }
  }, [documentsQuery.isError]);

  useEffect(() => {
    if (productsQuery.isError) {
      toast.error(productsQuery.error.message);
    }
  }, [productsQuery.isError]);

  useEffect(() => {
    if (!open) {
      reset();
      setView("searchTemplate");
      setSelectedTemplate(null);
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products);
    }
  }, [open]);

  const generateNewLineFormMutation = useMutation({
    mutationFn: generateNewLineForm,
    onSuccess: () => {
      toast.success(t("successfully_submitted"));
      onClose();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const onGenerateNLF = handleSubmit((formValue) => {
    const { layoutType, outputFormat } = formValue;
    const productIds = map(selectedProducts, "id");
    generateNewLineFormMutation.mutate({
      documentId: selectedTemplate.id,
      productIds,
      layoutType,
      outputFormat,
    });
  });

  const onSearchTemplateChange = (value: string): void => {
    setSelectedTemplate(null);
    if (value) {
      setShowTemplateList(true);
      if (searchTemplateRef.current) {
        searchTemplateRef.current.focus();
      }
    }
  };

  const onSearchTemplateBlur = (): void => {
    if (!selectedTemplate) {
      setView("searchTemplate");
    }
  };

  const onSearchProductChange = (value: string): void => {
    if (value) {
      setShowProductList(true);
      if (searchProductRef.current) {
        searchProductRef.current.focus();
      }
    }
  };

  const onSelectTemplate = (document: DocumentManagement.Document): void => {
    setValue("searchTemplate", document.name);
    setSelectedTemplate(document);
    setView("generateNLF");
    setShowTemplateList(false);
  };

  const onSelectProduct = (product: ProductManagement.Product): void => {
    setSelectedProducts((prev) => {
      const isExisting = some(prev, ({ id }) => id === product.id);
      return isExisting ? prev : [...prev, product];
    });
    setShowProductList(false);
  };

  const onRemoveProduct = (productId: string): void => {
    setSelectedProducts((prev) => filter(prev, ({ id }) => id !== productId));
  };

  const renderTemplateList = (): React.JSX.Element => {
    if (documentsQuery.isLoading) {
      return (
        <div className="p-2 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      );
    }
    if (isEmpty(documentsQuery.data.items)) {
      return (
        <div className="p-2 flex flex-col gap-2 justify-center items-center text-muted-foreground">
          <Box className="w-6 h-6" />
          {t("no_results")}
        </div>
      );
    }

    return (
      <Scrollbars autoHeight>
        <div className="p-4">
          {map(documentsQuery.data.items, (document) => (
            <div
              key={document.id}
              className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => onSelectTemplate(document)}
            >
              {document.name}
            </div>
          ))}
        </div>
      </Scrollbars>
    );
  };

  const renderProductList = (): React.JSX.Element => {
    if (productsQuery.isLoading) {
      return (
        <div className="p-2 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      );
    }
    if (isEmpty(get(productsQuery.data, "items"))) {
      return (
        <div className="p-2 flex flex-col gap-2 justify-center items-center text-muted-foreground">
          <Box className="w-6 h-6" />
          {t("no_results")}
        </div>
      );
    }

    return (
      <Scrollbars autoHeight>
        <div className="p-4">
          {map(get(productsQuery.data, "items"), (product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      </Scrollbars>
    );
  };

  const renderSelectNLFTemplate = (): React.JSX.Element => (
    <Popover
      open={showTemplateList}
      content={renderTemplateList()}
      onOpenChange={setShowTemplateList}
      className="w-[var(--radix-popover-trigger-width)] max-h-64 p-0"
    >
      <Input
        control={control}
        name="searchTemplate"
        inputRef={searchTemplateRef}
        label={t("nlf_template_name")}
        placeholder={t("search_by_nlf_template_name")}
        containerClassName="text-left"
        onChange={onSearchTemplateChange}
        onBlur={onSearchTemplateBlur}
      />
    </Popover>
  );

  const renderProduct = (
    product: ProductManagement.Product
  ): React.JSX.Element => (
    <span
      key={product.id}
      className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
    >
      {product.name}
      <CircleX
        className="h-4 w-4 cursor-pointer"
        onClick={() => onRemoveProduct(product.id)}
      />
    </span>
  );

  const renderLayoutTypeLabel = (): React.JSX.Element => (
    <div className="flex items-center gap-2">
      {t("layout_type")}
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="w-4 h-4 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t.rich("layout_type_tooltip", {
              row: (chunk) => <span className="font-bold">{chunk}</span>,
              column: (chunk) => <span className="font-bold">{chunk}</span>,
            })}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  const renderContent = (): React.JSX.Element => {
    if (view === "searchTemplate") {
      return (
        <>
          {renderSelectNLFTemplate()}
          <Button
            label={t("add_new_trade_partner")}
            className="w-full"
            onClick={() => setView("uploadNLF")}
          />
        </>
      );
    }
    if (view === "uploadNLF") {
      return (
        <UploadNLFTemplate
          uploadSucceed={(document: DocumentManagement.Document) => {
            documentsQuery.refetch();
            setValue("searchTemplate", document.name);
            setSelectedTemplate(document);
            setView("generateNLF");
          }}
          onBack={() => setView("searchTemplate")}
        />
      );
    }

    return (
      <>
        {renderSelectNLFTemplate()}
        <Select
          control={control}
          name="outputFormat"
          label={t("output_format")}
          placeholder={t("select_output_format")}
          options={outputFormatOptions}
          rules={{
            required: t("field_required", { field: t("output_format") }),
          }}
        />
        <Select
          control={control}
          name="layoutType"
          label={renderLayoutTypeLabel()}
          placeholder={t("select_layout_type")}
          options={layoutTypeOptions}
          rules={{
            required: t("field_required", { field: t("layout_type") }),
          }}
        />
        <Popover
          open={showProductList}
          content={renderProductList()}
          onOpenChange={setShowProductList}
          className="w-[var(--radix-popover-trigger-width)] max-h-64 p-0"
        >
          <Input
            control={control}
            inputRef={searchProductRef}
            name="searchProduct"
            label={t("select_products")}
            placeholder={t("enter_product")}
            containerClassName="text-left"
            onChange={onSearchProductChange}
          />
        </Popover>
        {!isEmpty(selectedProducts) && (
          <div className="flex items-center gap-2 flex-wrap">
            {t("selected_products")}
            {map(selectedProducts, renderProduct)}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            label={t("back")}
            variant="outline"
            onClick={() => {
              setView("searchTemplate");
              setSelectedTemplate(null);
              setValue("searchTemplate", null);
            }}
          />
          <Button
            label={t("generate_new_line_form")}
            className="w-full"
            disabled={isEmpty(selectedProducts)}
            loading={generateNewLineFormMutation.isPending}
            onClick={onGenerateNLF}
          />
        </div>
      </>
    );
  };

  const renderTitle = (): React.JSX.Element => (
    <div className="flex items-center gap-4">
      {t("generate_new_line_form")}
      <span className="px-1 py-0.5 text-blue-600 bg-blue-100 border border-blue-600 rounded-md uppercase text-xs">
        beta
      </span>
    </div>
  );

  return (
    <BaseSheet
      open={open}
      title={renderTitle()}
      description={
        view !== "uploadNLF"
          ? t.rich("generate_new_line_form_description", {
              strong: (chunk) => <span className="font-bold">{chunk}</span>,
            })
          : null
      }
      onClose={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 mt-6"
      >
        {renderContent()}
      </motion.form>
    </BaseSheet>
  );
};

export default GenerateNewLineFormSheet;
