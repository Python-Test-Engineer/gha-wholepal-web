"use client";

import { Loader2 } from "lucide-react";
import Button from "@/components/form-ui/button";
import BaseModal from "@/dialog/base-dialog";
import { useToggle } from "ahooks";

const ConfirmDialog: FunctionComponent<{
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}> = ({ open, title, description, onConfirm, onClose }) => {
  const t = useTranslations();
  const [loading, { toggle: toggleLoading }] = useToggle(false);

  const handleConfirm = (): void => {
    toggleLoading();
    Promise.resolve(onConfirm)
      .then(() => onConfirm())
      .finally(() => {
        onClose();
        toggleLoading();
      });
  };

  return (
    <BaseModal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
    >
      <div className="flex justify-end">
        <Button
          label={t("continue")}
          loading={loading}
          onClick={handleConfirm}
        />
      </div>
    </BaseModal>
  );
};

export default ConfirmDialog;
