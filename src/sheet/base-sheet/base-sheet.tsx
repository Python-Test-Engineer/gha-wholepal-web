"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const BaseSheet: FunctionComponent<{
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  onClose: () => void;
}> = ({
  open,
  title = null,
  description = null,
  footer,
  children,
  onClose,
}) => {
  const renderHeader = (): ReactNode => (
    <SheetHeader>
      <SheetTitle>{title}</SheetTitle>
      <SheetDescription className="whitespace-pre-wrap">
        {description}
      </SheetDescription>
    </SheetHeader>
  );

  const renderFooter = (): ReactNode => {
    if (footer) {
      return <SheetFooter className="mt-4 pt-4 border-t">{footer}</SheetFooter>;
    }
    return null;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        {renderHeader()}
        {children}
        {renderFooter()}
      </SheetContent>
    </Sheet>
  );
};

export default BaseSheet;
