"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BaseModal: FunctionComponent<{
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  contentClassname?: string;
  onClose: () => void;
}> = ({
  open,
  title = null,
  description = null,
  footer,
  children,
  contentClassname = "sm:max-w-[600px]",
  onClose,
}) => {
  const renderHeader = (): ReactNode => (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  );

  const renderFooter = (): ReactNode => {
    if (footer) {
      return (
        <DialogFooter className="mt-2 pt-2 border-t">{footer}</DialogFooter>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={contentClassname}>
        {renderHeader()}
        {children}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
