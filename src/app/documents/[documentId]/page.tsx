"use client";

import { toast } from "react-hot-toast";
import {
  deleteDocumentShare,
  getDocument,
  getSharesOfDocument,
} from "@/api/document";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Share2, Unlink } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import DocumentOverview from "./document-overview";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import DataTable from "@/components/form-ui/datatable";

const ShareDocumentDialog = lazyload(
  () => import("@/dialog/share-document-dialog")
);
const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));

const DocumentDetails: FunctionComponent = () => {
  const t = useTranslations();
  const { documentId } = useParams();
  const router = useRouter();
  const { formatDate } = useDateTime();
  const [selectedShareId, setSelectedShareId] = useState(null);
  const { modal, openModal, closeModal } = useModalState([
    "share",
    "confirmDelete",
  ]);
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const columns: ColumnDef<DocumentManagement.DocumentShare>[] = [
    {
      accessorKey: "document",
      header: t("file_name"),
      cell: ({ row }) => get(row.original, "document.name") || "-",
    },
    {
      accessorKey: "company",
      header: t("shared_with"),
      cell: ({ row }) => get(row.original, "company.name") || "-",
    },
    {
      accessorKey: "createdAt",
      header: t("shared_date"),
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "user",
      header: t("shared_by"),
      cell: ({ row }) => get(row.original, "user.fullName") || "-",
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
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
              onClick={() => {
                setSelectedShareId(row.getValue("id"));
                openModal("confirmDelete");
              }}
            >
              <Unlink className="w-4 h-4" />
            </div>
          </div>
        );
      },
    },
  ];

  const [documentQuery, sharesOfDocumentQuery] = useMultipleRequests([
    {
      queryKey: ["getDocument", { documentId }],
      queryFn: () => getDocument(documentId as string),
      enabled: Boolean(documentId),
    },
    {
      queryKey: [
        "getSharesOfDocument",
        { currentPage: pagination.currentPage, perPage: pagination.perPage },
      ],
      queryFn: () =>
        getSharesOfDocument(documentId as string, {
          page: pagination.currentPage,
          limit: pagination.perPage,
        }),
    },
  ]);

  useEffect(() => {
    if (
      sharesOfDocumentQuery.isSuccess &&
      !sharesOfDocumentQuery.isRefetching
    ) {
      const {
        meta: { totalItems, itemsPerPage, currentPage },
      } = sharesOfDocumentQuery.data;
      setPagination({ total: totalItems, perPage: itemsPerPage, currentPage });
    }
  }, [sharesOfDocumentQuery.isSuccess, sharesOfDocumentQuery.isRefetching]);

  useEffect(() => {
    if (sharesOfDocumentQuery.isError) {
      toast.error(sharesOfDocumentQuery.error.message);
    }
  }, [sharesOfDocumentQuery.isError]);

  const deleteDocumentShareMutation = useMutation({
    mutationFn: () =>
      deleteDocumentShare(documentId as string, selectedShareId),
    onSuccess: () => {
      toast.success(t("successfully_deleted"));
      sharesOfDocumentQuery.refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const onChangePage = (currentPage: number): void =>
    setPagination((prev) => ({ ...prev, currentPage }));

  if (documentQuery.isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">
              {t("loading_document_details")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderHeader = (): React.JSX.Element => {
    return (
      <div className="bg-card p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="text-foreground flex items-center mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {get(documentQuery.data, "name")}
          </Button>
        </div>
        <Button onClick={() => openModal("share")}>
          <Share2 className="h-4 w-4 mr-2" />
          {t("share")}
        </Button>
      </div>
    );
  };

  const renderSharingSettings = (): React.JSX.Element => {
    if (sharesOfDocumentQuery.isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-card p-6 rounded-lg"
      >
        <DataTable
          data={get(sharesOfDocumentQuery.data, "items", [])}
          columns={columns}
          paginationConfig={{ ...pagination, onChangePage }}
        />
        {modal.confirmDelete.load && (
          <ConfirmDialog
            open={modal.confirmDelete.open}
            title={t("confirm")}
            description={t("confirm_delete_document_share")}
            onClose={closeModal("confirmDelete")}
            onConfirm={deleteDocumentShareMutation.mutate}
          />
        )}
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {renderHeader()}
        <div className=" p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <DocumentOverview document={documentQuery.data} />
          <div className="lg:col-span-9">
            <p className="p-3 bg-background text-foreground font-medium">
              {t("sharing_settings")}
            </p>
            {renderSharingSettings()}
          </div>
        </div>
      </div>
      {modal.share.load && (
        <ShareDocumentDialog
          open={modal.share.open}
          documentId={documentId as string}
          refetch={sharesOfDocumentQuery.refetch}
          onClose={closeModal("share")}
        />
      )}
    </Layout>
  );
};

export default DocumentDetails;
