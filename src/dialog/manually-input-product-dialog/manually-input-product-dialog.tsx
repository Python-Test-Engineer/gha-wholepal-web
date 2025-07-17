"use client";

import { toast } from "react-hot-toast";
import Button from "@/components/form-ui/button";
import BaseDialog from "@/dialog/base-dialog";
import { ProductInfoTabEnum, ProductStepEnum } from "@/enums/product";
import {
  createProduct,
  getProductDetails,
  getSchema,
  updateProductProgress,
} from "@/api/product";
import Steps from "./steps";
import ProductInfo from "./product-info";
import useProduct from "@/hooks/use-product";
import { Loader2 } from "lucide-react";

const ManuallyInputProductDialog: FunctionComponent<{
  open: boolean;
  productId?: string;
  refetch?: () => void;
  onClose: () => void;
}> = ({ open, productId, refetch = () => null, onClose }) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { getProductDatapointValue, getSchemaItem } = useProduct();
  const [activeStep, setActiveStep] = useState(ProductStepEnum.LINE_DETAILS);
  const isReviewing = Boolean(productId);
  const { control, reset, handleSubmit } = useForm();
  const isCommercial = activeStep === ProductStepEnum.PRICING;
  const isLineDetails = activeStep === ProductStepEnum.LINE_DETAILS;
  const scrollRef = useRef(null);

  const steps = [
    ProductStepEnum.LINE_DETAILS,
    ProductStepEnum.NUTRITION_VALUES,
    ProductStepEnum.PRODUCT_SPECIFICATIONS,
    ProductStepEnum.DIETARY_INFO,
    ProductStepEnum.PRICING,
  ];

  const [productDetailsQuery, schemaQuery] = useMultipleRequests([
    {
      queryKey: ["getProductDetails", { productId }],
      queryFn: () => getProductDetails(productId),
      enabled: isReviewing,
    },
    {
      queryKey: ["getSchema"],
      queryFn: () => getSchema(),
    },
  ]);

  const getTypeByStep = (): ProductInfoTabEnum => {
    const stepValues = {
      [ProductStepEnum.LINE_DETAILS]: ProductInfoTabEnum.LINE_DETAILS,
      [ProductStepEnum.PRICING]: ProductInfoTabEnum.PRICING,
      [ProductStepEnum.NUTRITION_VALUES]: ProductInfoTabEnum.NUTRITION_VALUES,
      [ProductStepEnum.PRODUCT_SPECIFICATIONS]:
        ProductInfoTabEnum.PRODUCT_SPECIFICATIONS,
      [ProductStepEnum.DIETARY_INFO]: ProductInfoTabEnum.DIETARY_INFO,
    };

    return get(stepValues, activeStep);
  };

  const updateProgressMutation = useMutation({
    mutationFn: (data: ProductManagement.UpdateProgressData) =>
      updateProductProgress(productId, data),
    onSuccess: () => {
      refetch();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const createProductMutation = useMutation({
    mutationFn: (data: { items: ProductManagement.SchemaItem[] }) =>
      createProduct(data),
    onSuccess: (response) => {
      toast.success(response.message);
      refetch();
      onClose();
      setActiveStep(ProductStepEnum.LINE_DETAILS);
      reset();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  useEffect(() => {
    if (productDetailsQuery.isError) {
      toast.error(productDetailsQuery.error.message);
    }
  }, [productDetailsQuery.isError]);

  useEffect(() => {
    if (productDetailsQuery.isSuccess) {
      const currentStep = get(
        productDetailsQuery.data,
        "currentStep",
        ProductStepEnum.LINE_DETAILS
      );
      setActiveStep(
        currentStep === 0 ? ProductStepEnum.LINE_DETAILS : currentStep
      );
    }
  }, [productDetailsQuery.isSuccess]);

  useEffect(() => {
    if (productDetailsQuery.isSuccess && schemaQuery.isSuccess) {
      resetFormData();
    }
  }, [productDetailsQuery.isSuccess, schemaQuery.isSuccess, activeStep]);

  useEffect(() => {
    if (!open) {
      queryClient.removeQueries({
        queryKey: ["getProductDetails", { productId }],
      });
    }
  }, [open]);

  const resetFormData = (): void => {
    const productCategory = find(schemaQuery.data, { key: getTypeByStep() });
    const fields = isEmpty(productCategory.children)
      ? get(productCategory, "fields", [])
      : reduce(
          productCategory.children,
          (acc, cur) => [...acc, ...cur.fields],
          []
        );
    const formData = reduce(
      fields,
      (
        acc: Record<string, string | number | boolean>,
        cur: ProductManagement.ProductDataPoint
      ) => {
        return {
          ...acc,
          ...getProductDatapointValue(
            cur,
            productDetailsQuery.data.schemaItems
          ),
        };
      },
      {}
    );
    reset(formData);
  };

  const onInvalid = (): void => {
    toast.error(t("please_fill_in_the_required_fields"));
    const target =
      scrollRef.current?.view.getElementsByClassName("ring-destructive");
    if (target) {
      scrollRef.current?.scrollTop({
        top: target.offsetTop - scrollRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const saveProgress = handleSubmit(async (formValue) => {
    const items = getSchemaItem(formValue);
    const saveStep =
      productDetailsQuery.data.currentStep > activeStep
        ? productDetailsQuery.data.currentStep
        : activeStep;
    await updateProgressMutation.mutateAsync({
      items,
      currentStep: saveStep,
    });
    toast.success(t("successfully_saved"));
    onClose();
  }, onInvalid);

  const onNext = handleSubmit(async (formValue) => {
    const items = getSchemaItem(formValue);
    const saveStep =
      productDetailsQuery.data.currentStep > activeStep + 1
        ? productDetailsQuery.data.currentStep
        : activeStep + 1;
    const data = isCommercial
      ? {
          items,
          currentStep: ProductStepEnum.PRICING,
          isDone: true,
        }
      : {
          items,
          currentStep: saveStep,
        };
    await updateProgressMutation.mutateAsync(data);
    if (isCommercial) {
      toast.success(t("product_submitted_and_validated_successfully"));
      onClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  }, onInvalid);

  const createNext = handleSubmit((formValue: FieldValues) => {
    if (isCommercial) {
      const items = getSchemaItem(formValue);
      createProductMutation.mutate({ items });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  }, onInvalid);

  const renderFooter = (): React.JSX.Element => {
    if (isReviewing) {
      return (
        <div className="flex justify-between gap-4 flex-auto">
          <Button
            label={t("previous")}
            variant="outline"
            disabled={isLineDetails || updateProgressMutation.isPending}
            onClick={() => setActiveStep((prev) => prev - 1)}
          />
          <div className="flex gap-4">
            <Button
              label={t("save_progress")}
              variant="outline"
              disabled={updateProgressMutation.isPending}
              onClick={saveProgress}
            />
            <Button
              label={t(isCommercial ? "done" : "next")}
              disabled={updateProgressMutation.isPending}
              onClick={onNext}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-between gap-4 flex-auto">
        <Button
          label={t("previous")}
          variant="outline"
          disabled={isLineDetails || createProductMutation.isPending}
          onClick={() => setActiveStep((prev) => prev - 1)}
        />
        <Button
          label={t(isCommercial ? "done" : "next")}
          loading={createProductMutation.isPending}
          onClick={createNext}
        />
      </div>
    );
  };

  const renderContent = (): React.JSX.Element => {
    if (productDetailsQuery.isLoading || schemaQuery.isLoading) {
      return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
    }

    return (
      <ProductInfo
        type={getTypeByStep()}
        control={control}
        schema={schemaQuery.data}
        scrollRef={scrollRef}
      />
    );
  };

  return (
    <BaseDialog
      open={open}
      contentClassname="sm:max-w-[1000px]"
      footer={renderFooter()}
      onClose={onClose}
    >
      <Steps steps={steps} activeStep={activeStep} schema={schemaQuery.data} />
      {renderContent()}
    </BaseDialog>
  );
};

export default ManuallyInputProductDialog;
