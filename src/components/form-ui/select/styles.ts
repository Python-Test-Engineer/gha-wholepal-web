export const triggerStyles = classVariant(
  [
    "flex",
    "justify-between",
    "items-center",
    "w-full",
    "text-base",
    "md:text-sm",
    "bg-muted",
    "border-none",
    "text-foreground",
    "rounded-md",
    "appearance-none",
    "focus-visible:outline-none",
    "focus-visible:ring-1",
    "focus-visible:ring-ring",
  ],
  {
    variants: {
      size: {
        medium: "py-1.5 px-3 h-9",
        large: "py-3 px-4 h-12",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
      isError: {
        true: "ring-2 ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      disabled: false,
      isError: false,
    },
  }
);

export const itemStyles = classVariant([
  "flex",
  "items-center",
  "justify-between",
  "gap-3",
  "h-10",
  "px-3",
  "text-base",
  "md:text-sm",
  "rounded-md",
  "outline-none",
  "hover:bg-gray-100",
  "cursor-pointer",
]);
