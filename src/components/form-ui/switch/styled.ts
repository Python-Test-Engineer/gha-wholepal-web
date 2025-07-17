export const switchStyles = classVariant([], {
  variants: {
    readOnly: {
      true: "pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    readOnly: false,
  },
});
