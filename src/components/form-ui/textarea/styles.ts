export const inputStyles = classVariant(
  [
    "p-3",
    "w-full",
    "bg-muted",
    "rounded-md",
    "text-base",
    "md:text-sm",
    "shadow-sm",
    "transition-colors",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-1",
    "focus-visible:ring-ring",
  ],
  {
    variants: {
      size: {
        medium: "px-3",
        large: "px-5",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
      readOnly: {
        true: "pointer-events-none",
        false: "",
      },
      isError: {
        true: "ring-2 ring-destructive",
        false: "",
      },
      bordered: {
        true: "border border-input",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      disabled: false,
      isError: false,
      readOnly: false,
    },
  }
);
