"use client";

import { Download, FileDown, Loader2, Search, Trash, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Input from "@/components/form-ui/input";
import { Layout } from "@/components/Layout";
import { useDebounce } from "ahooks";
import { Button } from "@/components/ui/button";
import Select from "@/components/form-ui/select";
import { DocumentStatusEnum, DocumentTypeEnum } from "@/enums/document";
import DataTable from "@/components/form-ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { deleteDocument, getDocuments } from "@/api/document";
import usePlatformDocument from "@/hooks/use-platform-document";
import { DATE_TIME_FORMAT } from "@/config/constants";
import useFile from "@/hooks/use-file";

const CreateNLFTemplateDialog = lazyload(
  () => import("@/dialog/create-nlf-template-dialog")
);
const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));

const NLFTemplates: FunctionComponent = () => {
  const t = useTranslations();
  const { formatDate } = useDateTime(DATE_TIME_FORMAT);
  const { control, watch, reset } = useForm({
    defaultValues: { search: "", status: null },
  });
  const [search, status] = watch(["search", "status"]);
  const searchQuery = useDebounce(search);
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });
  const { modal, openModal, closeModal } = useModalState([
    "create",
    "confirmDelete",
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const { convertBytesToMB, getMimetype } = usePlatformDocument();

  const statusOptions = [
    {
      label: t("processing"),
      value: DocumentStatusEnum.PROCESSING,
    },
    {
      label: t("completed"),
      value: DocumentStatusEnum.COMPLETED,
    },
    {
      label: t("failed"),
      value: DocumentStatusEnum.FAILED,
    },
  ];

  const columns: ColumnDef<DocumentManagement.Document>[] = [
    {
      accessorKey: "name",
      header: t("file_name"),
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2">
          <FileDown className="w-4 h-4 min-w-4 text-primary" />
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: t("created_by"),
      cell: ({ row }) => get(row.original, "user.fullName") || "-",
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
                  fileName: get(row.original, "fileMetadata.name"),
                })
              }
            >
              <Download className="w-4 h-4" />
            </div>
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
              onClick={() => {
                setSelectedId(row.getValue("id"));
                openModal("confirmDelete");
              }}
            >
              <Trash className="w-4 h-4" />
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
        status,
        type: DocumentTypeEnum.NLF,
        page: pagination.currentPage,
        perPage: pagination.perPage,
      },
      (item) => !item
    );
    return params;
  }, [searchQuery, status, pagination.currentPage, pagination.perPage]);

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

  const deleteDocumentMutation = useMutation({
    mutationFn: () => deleteDocument(selectedId),
    onSuccess: () => {
      toast.success(t("successfully_deleted"));
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const { downloadFileMutation } = useDownloadFile();
  const { getExtension } = useFile();

  const onChangePage = (currentPage: number): void =>
    setPagination((prev) => ({ ...prev, currentPage }));

  const renderHeader = (): React.JSX.Element => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground ">
        {t("new_line_form_templates")}
      </h1>
    </div>
  );

  const renderSearchAndFilter = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card p-4 rounded-lg mb-6 flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="search"
          control={control}
          placeholder={t("search_by_name")}
          size="large"
          prefixIcon={<Search />}
        />
        <Select
          control={control}
          name="status"
          placeholder={t("all_status")}
          size="large"
          options={statusOptions}
          containerClassName="grow"
        />
      </div>

      <div className="flex items-center gap-2 justify-end mb-2">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => reset()}
        >
          <X className="h-4 w-4" />
          {t("reset")}
        </Button>
        <Button
          className="flex items-center gap-2"
          onClick={() => openModal("create")}
        >
          <FileDown className="h-4 w-4" />
          {t("new_nlf_template")}
        </Button>
      </div>
    </motion.div>
  );

  const renderContent = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            {t("loading_nlf_templates")}
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
      {modal.create.load && (
        <CreateNLFTemplateDialog
          open={modal.create.open}
          refetch={refetch}
          onClose={closeModal("create")}
        />
      )}
      {modal.confirmDelete.load && (
        <ConfirmDialog
          open={modal.confirmDelete.open}
          title={t("confirm_delete_nlf_template")}
          onClose={closeModal("confirmDelete")}
          onConfirm={deleteDocumentMutation.mutate}
        />
      )}
    </Layout>
  );
};

export default NLFTemplates;
