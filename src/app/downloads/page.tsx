"use client";

import { toast } from "react-hot-toast";
import { deleteNLF, getNewLineForms } from "@/api/document";
import DataTable from "@/components/form-ui/datatable";
import { Layout } from "@/components/Layout";
import {
  CheckCircle,
  Clock,
  Download,
  FileDown,
  Loader2,
  Trash,
  XCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DocumentStatusEnum,
  NewLineFormOutputFormatEnum,
} from "@/enums/document";
import { DATE_TIME_FORMAT } from "@/config/constants";
import { NotificationEnum } from "@/enums/socket-connect";
import { NotificationTypeEnum } from "@/enums/notification";
import useFile from "@/hooks/use-file";

const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));

const Downloads: FunctionComponent = () => {
  const t = useTranslations();
  const { formatDate } = useDateTime(DATE_TIME_FORMAT);
  const { on, off } = useSocket();
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });
  const [selectedNLF, setSelectedNLF] =
    useState<DocumentManagement.NewLineForm>(null);
  const { modal, openModal, closeModal } = useModalState([
    "confirmDelete",
    "confirmDownload",
  ]);

  const { downloadFileMutation } = useDownloadFile();
  const { getExtension } = useFile();

  const getStatusBadge = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.COMPLETED:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs w-max">
            <CheckCircle className="h-3 w-3" />
            {t("completed")}
          </span>
        );

      case DocumentStatusEnum.FAILED:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs w-max">
            <XCircle className="h-3 w-3" />
            {t("failed")}
          </span>
        );
      case DocumentStatusEnum.PROCESSING:
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs w-max">
            <Clock className="h-3 w-3" />
            {t("processing")}
          </span>
        );
    }
  };

  const getOutputFormat = (
    outputFormat: NewLineFormOutputFormatEnum
  ): string => {
    if (outputFormat === NewLineFormOutputFormatEnum.CSV) {
      return t("csv");
    }
    return t("excel");
  };

  const renderDownload = (
    nlf: DocumentManagement.NewLineForm
  ): React.JSX.Element => (
    <div
      className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 transition-colors"
      onClick={() => {
        setSelectedNLF(nlf);
        openModal("confirmDownload");
      }}
    >
      <Download className="w-4 h-4" />
    </div>
  );

  const renderDelete = (
    nlf: DocumentManagement.NewLineForm
  ): React.JSX.Element => (
    <div
      className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
      onClick={() => {
        setSelectedNLF(nlf);
        openModal("confirmDelete");
      }}
    >
      <Trash className="w-4 h-4" />
    </div>
  );

  const columns: ColumnDef<DocumentManagement.NewLineForm>[] = [
    {
      accessorKey: "document",
      header: t("nlf_template"),
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2 ">
          <FileDown className="w-4 h-4 min-w-4 text-primary" />
          {get(row.original, "document.name") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "options",
      header: t("output_format"),
      cell: ({ row }) =>
        getOutputFormat(get(row.original, "options.outputFormat")),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "user",
      header: t("created_by"),
      cell: ({ row }) => get(row.original, "user.fullName") || "-",
    },
    {
      accessorKey: "productIds",
      header: t("number_of_products"),
      cell: ({ row }) => size(row.getValue("productIds")),
    },
    {
      accessorKey: "createdAt",
      header: t("created_date"),
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "id",
      header: t("actions"),
      enableHiding: false,
      size: 40,
      cell: ({ row }) => {
        if (row.original.status === DocumentStatusEnum.COMPLETED) {
          return (
            <div className="flex justify-end gap-2">
              {renderDownload(row.original)}
              {renderDelete(row.original)}
            </div>
          );
        }
        if (row.original.status === DocumentStatusEnum.FAILED) {
          return (
            <div className="flex justify-end gap-2">
              {renderDelete(row.original)}
            </div>
          );
        }
        return null;
      },
    },
  ];

  const { isSuccess, isRefetching, data, isError, error, isLoading, refetch } =
    useRequest({
      queryKey: [
        "getNewLineForms",
        { limit: pagination.perPage, page: pagination.currentPage },
      ],
      queryFn: () =>
        getNewLineForms({
          limit: pagination.perPage,
          page: pagination.currentPage,
        }),
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
        if (type === NotificationTypeEnum.NLF_PROCESS_COMPLETE) {
          refetch();
        }
      }
    );
    return () => off(NotificationEnum.DOCUMENT_EVENT);
  }, []);

  const deleteNLFMutation = useMutation({
    mutationFn: () => deleteNLF(selectedNLF.id),
    onSuccess: () => {
      toast.success(t("successfully_deleted"));
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const onChangePage = (currentPage: number): void =>
    setPagination((prev) => ({ ...prev, currentPage }));

  const renderHeader = (): React.JSX.Element => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {t("downloads")}
      </h1>
      <p className="text-muted-foreground">
        {t("manage_customer_download_and_file_access")}
      </p>
    </div>
  );

  const renderContent = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            {t("loading_downloads")}
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
      <div className="p-4 md:p-6 bg-background min-h-screen">
        {renderHeader()}
        {renderContent()}
      </div>
      {modal.confirmDelete.load && (
        <ConfirmDialog
          open={modal.confirmDelete.open}
          title={t("confirm")}
          description={t("confirm_delete_nlf")}
          onClose={closeModal("confirmDelete")}
          onConfirm={deleteNLFMutation.mutate}
        />
      )}
      {modal.confirmDownload.load && (
        <ConfirmDialog
          open={modal.confirmDownload.open}
          title={t("download_new_line_form")}
          description={t("confirm_download")}
          onClose={closeModal("confirmDownload")}
          onConfirm={() =>
            downloadFileMutation.mutate({
              url: selectedNLF.url,
              fileName: `${get(selectedNLF, "document.name")}-${get(
                selectedNLF,
                "company.name"
              )}.${getExtension(
                get(selectedNLF, "document.fileMetadata.name")
              )}`,
            })
          }
        />
      )}
    </Layout>
  );
};

export default Downloads;
