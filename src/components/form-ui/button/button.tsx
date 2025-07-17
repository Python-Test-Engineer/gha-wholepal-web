import { Loader2 } from "lucide-react";
import { Button as RadixButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Button: FunctionComponent<{
  label?: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}> = ({
  label,
  className,
  size = "default",
  variant = "default",
  disabled = false,
  loading = false,
  icon = null,
  onClick = () => null,
}) => {
  const renderIcon = (): ReactNode => {
    if (loading) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    return icon;
  };

  return (
    <RadixButton
      className={cn(className, loading && "pointer-events-none opacity-50")}
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
    >
      {renderIcon()}
      {label}
    </RadixButton>
  );
};

export default Button;
