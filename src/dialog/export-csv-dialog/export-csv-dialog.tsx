"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BaseDialog from "@/dialog/base-dialog";
import RadioGroup from "@/components/form-ui/radio-group";

const ExportCSVDialog: FunctionComponent<{
  open: boolean;
  ids: string[];
  onClose: () => void;
}> = ({ open, ids, onClose }) => {
  const t = useTranslations();
  const { control, watch, handleSubmit } = useForm({
    defaultValues: { exportType: "full_export" },
  });
  const exportType = watch("exportType", "full_export");

  const options = [
    {
      label: t("full_export"),
      value: "full_export",
    },
    {
      label: t("custom"),
      value: "custom",
    },
  ];

  const onSubmit = handleSubmit((formValue) => {
    console.log("formValue", formValue);
  });

  const renderFooter = (): React.JSX.Element => (
    <div className="flex flex-end gap-2">
      <Button variant="outline" onClick={onClose}>
        {t("cancel")}
      </Button>
      <Button onClick={onSubmit}>{t("export_csv")}</Button>
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("export_products")}
      footer={renderFooter()}
      onClose={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RadioGroup control={control} name="exportType" options={options} />
      </motion.form>
    </BaseDialog>
  );
};

export default ExportCSVDialog;
