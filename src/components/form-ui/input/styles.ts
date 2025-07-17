export const inputStyles = classVariant(
  [
    "flex",
    "items-center",
    "p-3",
    "gap-2",
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
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    "file:text-foreground",
  ],
  {
    variants: {
      size: {
        medium: "h-9 px-3",
        large: "h-12 px-5",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
      readOnly: {
        true: "pointer-events-none",
        false: "",
      },
      hasPrefixIcon: {
        true: "ps-8",
        false: "",
      },
      hasSuffixIcon: {
        true: "pe-8",
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
      isFile: {
        true: "p-2",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "medium",
        hasPrefixIcon: true,
        class: "ps-8",
      },
      {
        size: "large",
        hasPrefixIcon: true,
        class: "ps-10",
      },
      {
        size: "medium",
        hasSuffixIcon: true,
        class: "pe-8",
      },
      {
        size: "large",
        hasSuffixIcon: true,
        class: "pe-10",
      },
      {
        size: "large",
        isFile: true,
        class: "p-3.5",
      },
    ],
    defaultVariants: {
      size: "medium",
      disabled: false,
      hasPrefixIcon: false,
      isError: false,
      readOnly: false,
    },
  }
);

export const iconStyles = classVariant(["absolute"], {
  variants: {
    size: {
      medium: "w-4 h-4 top-2.5",
      large: "w-5 h-5 top-3.5",
    },
    position: {
      left: "left-2",
      right: "right-2",
    },
    cursor: {
      true: "cursor-pointer hover:text-foreground",
      false: "",
    },
    isCheck: {
      true: "text-green-500",
      false: "text-muted-foreground",
    },
  },
  compoundVariants: [
    {
      size: "large",
      position: "left",
      class: "left-3",
    },
    {
      size: "large",
      position: "right",
      class: "right-3",
    },
  ],
  defaultVariants: {
    size: "medium",
    position: "left",
    cursor: false,
    isCheck: false,
  },
});
