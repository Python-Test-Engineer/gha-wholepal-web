"use client";

import { Download, FileDown, Loader2, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Input from "@/components/form-ui/input";
import { Layout } from "@/components/Layout";
import { useDebounce } from "ahooks";
import { Button } from "@/components/ui/button";
import Select from "@/components/form-ui/select";
import { DocumentTypeEnum } from "@/enums/document";
import DataTable from "@/components/form-ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { getDocuments } from "@/api/document";
import usePlatformDocument from "@/hooks/use-platform-document";
import { DATE_TIME_FORMAT } from "@/config/constants";
import { NotificationEnum } from "@/enums/socket-connect";
import { NotificationTypeEnum } from "@/enums/notification";

const WholesalerDocuments: FunctionComponent = () => {
  const t = useTranslations();
  const { formatDate } = useDateTime(DATE_TIME_FORMAT);
  const { on, off } = useSocket();
  const { control, watch, reset } = useForm({
    defaultValues: { search: "", type: null },
  });
  const [search, type] = watch(["search", "type"]);
  const searchQuery = useDebounce(search);
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });
  const { convertBytesToMB, getFileType, getMimetype } = usePlatformDocument();

  const fileTypeOptions = [
    {
      label: t("certification"),
      value: DocumentTypeEnum.CERTIFICATION,
    },
    {
      label: t("marketing_material"),
      value: DocumentTypeEnum.MARKETING_MATERIAL,
    },
    {
      label: t("product_catalog"),
      value: DocumentTypeEnum.PRODUCT_CATALOG,
    },
    {
      label: t("others"),
      value: DocumentTypeEnum.OTHERS,
    },
  ];

  const columns: ColumnDef<DocumentManagement.Document>[] = [
    {
      accessorKey: "name",
      header: t("file_name"),
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2 ">
          <FileDown className="w-4 h-4 min-w-4 text-primary" />
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: t("shared_by"),
      cell: ({ row }) => get(row.original, "company.name") || "-",
    },
    {
      accessorKey: "type",
      header: t("type"),
      cell: ({ row }) => getFileType(row.getValue("type")),
    },
    {
      accessorKey: "size",
      header: t("file_size"),
      cell: ({ row }) =>
        convertBytesToMB(get(row.original, "fileMetadata.size")),
    },
    {
      accessorKey: "fileMetadata",
      header: t("file_type"),
      cell: ({ row }) =>
        getMimetype(get(row.original, "fileMetadata.mimetype")),
    },
    {
      accessorKey: "createdAt",
      header: t("created_date"),
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "id",
      header: "",
      enableHiding: false,
      size: 40,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 transition-colors"
              onClick={() =>
                downloadFileMutation.mutate({
                  url: get(row.original, "url"),
                  fileName: get(row.original, "name"),
                })
              }
            >
              <Download className="w-4 h-4" />
            </div>
          </div>
        );
      },
    },
  ];

  const filterParams = useMemo<DocumentManagement.DocumentParams>(() => {
    let params = omitBy(
      {
        name: trim(searchQuery),
        type,
        page: pagination.currentPage,
        perPage: pagination.perPage,
      },
      (item) => !item
    );
    return params;
  }, [searchQuery, type, pagination.currentPage, pagination.perPage]);

  const { isLoading, data, isSuccess, isRefetching, isError, error, refetch } =
    useRequest({
      queryKey: [
        "getDocuments",
        {
          ...filterParams,
        },
      ],
      queryFn: () => getDocuments(filterParams),
    });

  useEffect(() => {
    if (isSuccess && !isRefetching) {
      const {
        meta: { totalItems, itemsPerPage, currentPage },
      } = data;
      setPagination({ total: totalItems, perPage: itemsPerPage, currentPage });
    }
  }, [isSuccess, isRefetching]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError]);

  useEffect(() => {
    on<ConnectSocket.SocketResponse>(
      NotificationEnum.DOCUMENT_EVENT,
      ({ type }) => {
        if (type === NotificationTypeEnum.DOCUMENT_SHARED) {
          refetch();
        }
      }
    );
    return () => off(NotificationEnum.DOCUMENT_EVENT);
  }, []);

  const { downloadFileMutation } = useDownloadFile();

  const onChangePage = (currentPage: number): void =>
    setPagination((prev) => ({ ...prev, currentPage }));

  const renderHeader = (): React.JSX.Element => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground ">{t("documents")}</h1>
    </div>
  );

  const renderSearchAndFilter = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-12 gap-4"
    >
      <Input
        name="search"
        control={control}
        placeholder={t("search_by_name")}
        size="large"
        prefixIcon={<Search />}
        containerClassName="md:col-span-5"
      />
      <Select
        control={control}
        name="type"
        placeholder={t("all_file_type")}
        size="large"
        options={fileTypeOptions}
        containerClassName="md:col-span-5"
      />
      <Button
        variant="ghost"
        className="flex items-center gap-2 md:col-span-2 h-12"
        size="lg"
        onClick={() => reset()}
      >
        <X className="h-4 w-4" />
        {t("reset")}
      </Button>
    </motion.div>
  );

  const renderContent = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            {t("loading_documents")}
          </span>
        </div>
      );
    }

    return (
      <DataTable
        data={get(data, "items")}
        columns={columns}
        paginationConfig={{ ...pagination, onChangePage }}
      />
    );
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {renderHeader()}
        {renderSearchAndFilter()}
        {renderContent()}
      </div>
    </Layout>
  );
};

export default WholesalerDocuments;
