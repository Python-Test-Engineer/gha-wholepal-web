import {
  Popover as PopoverRoot,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { PopoverContentProps } from "@radix-ui/react-popover";

const Popover: FunctionComponent<{
  open?: boolean;
  content: ReactNode;
  children: ReactNode;
  className?: string;
  align?: PopoverContentProps["align"];
  onOpenChange?: (open: boolean) => void;
}> = ({
  open,
  content,
  children,
  className,
  align = "start",
  onOpenChange,
}) => {
  return (
    <PopoverRoot defaultOpen={false} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("pointer-events-auto touch-auto", className)}
        forceMount
      >
        {content}
      </PopoverContent>
    </PopoverRoot>
  );
};

Popover.displayName = "Popover";
export default Popover;
