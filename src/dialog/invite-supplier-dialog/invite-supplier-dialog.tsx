"use client";

import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import Input from "@/components/form-ui/input";
import Textarea from "@/components/form-ui/textarea";
import Checkbox from "@/components/form-ui/checkbox";
import { EMAIL_REGEX } from "@/config/constants";
import { Mail } from "lucide-react";
import { inviteSupplier } from "@/api/company";

const InviteSupplierDialog: FunctionComponent<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const t = useTranslations();
  const { control, reset, setError, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      productCategory: "",
      notes: "",
      shouldNotify: false,
    },
  });
  const { handleResponseError } = useFormValidator();

  const inviteSupplierMutation = useMutation({
    mutationFn: inviteSupplier,
    onSuccess: () => {
      toast.success(t("successfully_invited"));
      onClose();
    },
    onError: (error: App.ResponseError) => handleResponseError(error, setError),
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const onSubmit = handleSubmit((formValue) => {
    inviteSupplierMutation.mutate({
      ...formValue,
      email: toLower(formValue.email),
    });
  });

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button label={t("cancel")} variant="outline" onClick={onClose} />
      <Button
        label={t("send_invitation")}
        icon={<Mail className="h-4 w-4" />}
        loading={inviteSupplierMutation.isPending}
        onClick={onSubmit}
      />
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("invite_new_supplier")}
      contentClassname="sm:max-w-[500px]"
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <Input
          control={control}
          name="name"
          label={t("company_name")}
          placeholder={t("enter_supplier_company_name")}
          rules={{
            required: t("field_required", { field: t("company_name") }),
          }}
        />
        <Input
          control={control}
          name="email"
          label={t("contact_email")}
          placeholder="supplier@example.com"
          rules={{
            required: t("field_required", { field: t("contact_email") }),
            pattern: { value: EMAIL_REGEX, message: t("invalid_email_format") },
          }}
        />
        <Input
          control={control}
          name="productCategory"
          label={t("product_category")}
          placeholder={t("category_placeholder")}
          rules={{
            required: t("field_required", { field: t("product_category") }),
          }}
        />
        <Textarea
          control={control}
          name="notes"
          label={t("additional_notes")}
          placeholder={t("additional_notes_placeholder")}
        />
        <Checkbox
          control={control}
          name="shouldNotify"
          label={t("notify_me_when_supplier_accepts_invitation")}
        />
      </motion.form>
    </BaseDialog>
  );
};

export default InviteSupplierDialog;
