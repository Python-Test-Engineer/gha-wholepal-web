"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import { useDebounce } from "ahooks";
import { searchCompanies } from "@/api/company";
import Input from "@/components/form-ui/input";
import Popover from "@/components/form-ui/popover";
import { Box, CircleX, Loader2 } from "lucide-react";
import { shareDocument } from "@/api/document";
import { ScrollArea } from "@/components/ui/scroll-area";
import Scrollbars from "react-custom-scrollbars-2";

const ShareDocumentDialog: FunctionComponent<{
  open: boolean;
  documentId: string;
  refetch: () => void;
  onClose: () => void;
}> = ({ open, documentId, refetch, onClose }) => {
  const t = useTranslations();
  const { control, reset, setValue, watch } = useForm({
    defaultValues: { name: "" },
  });
  const name = watch("name");
  const nameQuery = useDebounce(name);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const inputRef = useRef(null);

  const { data, isLoading } = useRequest({
    queryKey: ["searchCompanies", { nameQuery }],
    queryFn: () => searchCompanies({ name: nameQuery }),
  });

  useEffect(() => {
    if (!open) {
      reset();
      setShowSearchResult(false);
      setSelectedCompanies([]);
    }
  }, [open]);

  const shareDocumentMutation = useMutation({
    mutationFn: () =>
      shareDocument(documentId, { companyIds: map(selectedCompanies, "id") }),
    onSuccess: () => {
      toast.success(t("successfully_shared"));
      refetch();
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  const onSelect = (company: CompanyManagement.Company): void => {
    const isExisting = some(selectedCompanies, ({ id }) => id === company.id);
    if (!isExisting) {
      setSelectedCompanies((prev) => [...prev, company]);
    }
    setShowSearchResult(false);
    setValue("name", "");
  };

  const onRemove = (companyId: string): void => {
    setSelectedCompanies((prev) => filter(prev, ({ id }) => id !== companyId));
  };

  const onSearchChange = (value: string): void => {
    if (value) {
      setShowSearchResult(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button label={t("cancel")} variant="outline" onClick={onClose} />
      <Button
        label={t("share")}
        disabled={isEmpty(selectedCompanies)}
        loading={shareDocumentMutation.isPending}
        onClick={() => shareDocumentMutation.mutate()}
      />
    </div>
  );

  const renderSearchResult = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <div className="p-2 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      );
    }
    if (isEmpty(data)) {
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
          {map(data, (company) => (
            <div
              key={company.id}
              className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => onSelect(company)}
            >
              {company.name}
            </div>
          ))}
        </div>
      </Scrollbars>
    );
  };

  const renderTag = (company: CompanyManagement.Company): React.JSX.Element => (
    <span
      key={company.id}
      className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
    >
      {company.name}
      <CircleX
        className="h-4 w-4 cursor-pointer"
        onClick={() => onRemove(company.id)}
      />
    </span>
  );

  return (
    <BaseDialog
      open={open}
      title={t("share_document")}
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Popover
          open={showSearchResult}
          content={renderSearchResult()}
          onOpenChange={setShowSearchResult}
          className="w-[var(--radix-popover-trigger-width)] max-h-64 p-0"
        >
          <Input
            control={control}
            name="name"
            inputRef={inputRef}
            placeholder={t("search_by_company_name")}
            onChange={onSearchChange}
          />
        </Popover>
        {!isEmpty(selectedCompanies) && (
          <div className="flex items-center gap-2 flex-wrap">
            {t("selected_wholesalers")}
            {map(selectedCompanies, renderTag)}
          </div>
        )}
      </motion.div>
    </BaseDialog>
  );
};

export default ShareDocumentDialog;
