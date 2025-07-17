"use client";

import { toast } from "react-hot-toast";
import { updateConnectedProductCustomAttributes } from "@/api/product";
import Input from "@/components/form-ui/input";
import { useDebounceEffect } from "ahooks";

const WholesalerProductCode: FunctionComponent<{
  product: ProductManagement.Product;
  refetch: () => void;
}> = ({ product, refetch }) => {
  const t = useTranslations();
  const { control, getValues, watch } = useForm({
    defaultValues: { wholesalerProductCode: product.wholesalerProductCode },
  });
  const wholesalerProductCode = watch("wholesalerProductCode");

  const updateConnectedProductCustomAttributesMutation = useMutation({
    mutationFn: (data: { productCode: string }) =>
      updateConnectedProductCustomAttributes(product.productConnectId, data),
    onSuccess: () => {
      toast.success(t("wholesaler_product_code_saved"));
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const handleUpdateProductCode = (): void => {
    const wholesalerProductCode = getValues("wholesalerProductCode");
    if (wholesalerProductCode !== product.wholesalerProductCode) {
      updateConnectedProductCustomAttributesMutation.mutate({
        productCode: wholesalerProductCode,
      });
    }
  };

  useDebounceEffect(handleUpdateProductCode, [wholesalerProductCode], {
    wait: 1000,
  });

  return <Input control={control} name="wholesalerProductCode" />;
};

export default WholesalerProductCode;
