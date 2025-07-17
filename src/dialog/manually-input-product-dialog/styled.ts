export const stepStyles = classVariant(
  [
    "w-10",
    "h-10",
    "md:w-16",
    "md:h-16",
    "flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "text-xl",
    "font-bold",
  ],
  {
    variants: {
      isActive: {
        true: "border-2 border-gray-600",
        false: "",
      },
      isDone: {
        true: "bg-black text-white",
        false: "",
      },
    },
    compoundVariants: [
      {
        isActive: false,
        isDone: false,
        class: "bg-gray-200",
      },
    ],
    defaultVariants: {
      isActive: false,
    },
  }
);

export const connectorStyles = classVariant(
  [
    "h-[2px]",
    "w-[14]",
    "min-w-[14]",
    "md:w-[20px]",
    "md:min-w-[20px]",
    "grow",
    "translate-y-5",
    "md:translate-y-8",
  ],
  {
    variants: {
      isActive: {
        true: "bg-gray-600",
        false: "bg-gray-200",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);
