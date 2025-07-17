"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Info,
  Edit,
  Download,
  Layers,
  User,
  Loader2,
  Plus,
  Pause,
  CircleCheck,
  Contact,
  Ban,
  Camera,
  CircleFadingArrowUp,
  CircleDollarSign,
} from "lucide-react";
import Button from "@/components/form-ui/button";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import {
  ProductConnectStatusEnum,
  ProductFileTypeEnum,
  ProductInfoTabEnum,
} from "@/enums/product";
import ProductInfo from "./product-info";
import { UserTypeEnum } from "@/enums/user";
import useDateTime from "@/hooks/use-date-time";
import {
  connectProduct,
  exportProductToCSV,
  getProductDetails,
  getSchema,
  updateConnectedProductCustomAttributes,
  updateConnectVersion,
  updateProductCustomAttributes,
  updateProductProgress,
  uploadImage,
} from "@/api/product";
import useProduct from "@/hooks/use-product";
import SecondaryImage from "./secondary-image";
import PrimaryImage from "./primary-image";
import { downloadFile } from "@/utils/helpers";
import { DATE_TIME_FORMAT } from "@/config/constants";
import { useDebounceEffect } from "ahooks";

const ConfirmDialog = lazyload(() => import("@/dialog/confirm-dialog"));
const ProductVersionDialog = lazyload(
  () => import("@/dialog/product-versions-dialog")
);
const ExportCSVDialog = lazyload(() => import("@/dialog/export-csv-dialog"));
const UploadProductImage = lazyload(
  () => import("@/dialog/upload-product-image")
);
const UploadedFilesDialog = lazyload(
  () => import("@/dialog/uploaded-files-dialog")
);
const PreviewImageDialog = lazyload(
  () => import("@/dialog/preview-image-dialog")
);

const ProductDetails: FunctionComponent<{ isVersion?: boolean }> = ({
  isVersion = false,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const productVersionId = params.productVersionId as string;
  const { userInfo: currentUser } = useUser();
  const { formatDate } = useDateTime(DATE_TIME_FORMAT);
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);
  const isSupplier = userType === UserTypeEnum.SUPPLIER;
  const [activeTab, setActiveTab] = useState(ProductInfoTabEnum.LINE_DETAILS);
  const [changedTab, setChangedTab] = useState<ProductInfoTabEnum>(null);
  const {
    control,
    formState: { isDirty },
    watch,
    getValues,
    reset,
    handleSubmit,
  } = useForm();
  const { getProductDatapointValue, getSchemaItem } = useProduct();
  const [selectedImage, setSelectedImage] = useState(null);
  const { modal, openModal, closeModal } = useModalState([
    "confirm",
    "publish",
    "updateConnectVersion",
    "exportCSV",
    "uploadImage",
    "uploadSecondaryImage",
    "uploadedFiles",
    "confirmChangeTab",
    "previewImage",
  ]);

  const getTabIcon = (type: ProductInfoTabEnum) => {
    const icons = {
      [ProductInfoTabEnum.LINE_DETAILS]: Info,
      [ProductInfoTabEnum.PRICING]: CircleDollarSign,
      [ProductInfoTabEnum.PRODUCT_SPECIFICATIONS]: Layers,
      [ProductInfoTabEnum.NUTRITION_VALUES]: User,
      [ProductInfoTabEnum.DIETARY_INFO]: Info,
      [ProductInfoTabEnum.COMPANY_CONTACTS]: Contact,
    };

    return get(icons, type, Info);
  };

  const [productDetailsQuery, schemaQuery] = useMultipleRequests([
    {
      queryKey: [
        "getProductDetails",
        { productId: isVersion ? productVersionId : productId, isVersion },
      ],
      queryFn: () =>
        getProductDetails(isVersion ? productVersionId : productId, isVersion),
      enabled: Boolean(isVersion ? productVersionId : productId),
    },
    {
      queryKey: ["getSchema"],
      queryFn: () => getSchema(),
    },
  ]);

  const tabs = useMemo(() => {
    return map(schemaQuery.data, (item) => ({
      id: item.key,
      label: item.label,
    }));
  }, [schemaQuery.data]);

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductManagement.UpdateProgressData) =>
      updateProductProgress(productId, data),
    onSuccess: async () => {
      toast.success(t("successfully_saved"));
      const response = await productDetailsQuery.refetch();
      resetFormData(response.data);
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const connectProductMutation = useMutation({
    mutationFn: () => connectProduct(productDetailsQuery.data.productVersionId),
    onSuccess: () => {
      toast.success(t("successfully_added"));
      productDetailsQuery.refetch();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const updateConnectVersionMutation = useMutation({
    mutationFn: () =>
      updateConnectVersion(
        productDetailsQuery.data.productConnectId,
        productDetailsQuery.data.latestVersionId
      ),
    onSuccess: () => {
      toast.success(t("successfully_updated"));
      if (
        productDetailsQuery.data.latestVersionId ===
        productDetailsQuery.data.productVersionId
      ) {
        productDetailsQuery.refetch();
      } else {
        router.push(
          `/product-versions/${get(
            productDetailsQuery.data,
            "latestVersionId"
          )}`
        );
      }
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const exportProductMutation = useMutation({
    mutationFn: () =>
      exportProductToCSV(isVersion ? productVersionId : productId, isVersion),
    onSuccess: (data: string) =>
      downloadFile(`${kebabCase(productDetailsQuery.data.name)}.csv`, data),
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const updateProductCustomAttributesMutation = useMutation({
    mutationFn: (data: { productCode: string }) =>
      updateProductCustomAttributes(productId, data),
    onSuccess: async () => {
      const response = await productDetailsQuery.refetch();
      resetFormData(response.data);
      toast.success(t("product_code_saved"));
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const updateConnectedProductCustomAttributesMutation = useMutation({
    mutationFn: (data: { productCode: string }) =>
      updateConnectedProductCustomAttributes(
        productDetailsQuery.data.productConnectId,
        data
      ),
    onSuccess: async () => {
      const response = await productDetailsQuery.refetch();
      resetFormData(response.data);
      toast.success(t("wholesaler_product_code_saved"));
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const uploadCertificationMutation = useMutation({
    mutationFn: (image: File) =>
      uploadImage(productId, {
        type: ProductFileTypeEnum.PRODUCT_CERTIFICATION,
        image,
      }),
    onSuccess: async () => {
      const response = await productDetailsQuery.refetch();
      resetFormData(response.data);
      toast.success(t("successfully_uploaded"));
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  useEffect(() => {
    if (productDetailsQuery.isSuccess && schemaQuery.isSuccess) {
      resetFormData(productDetailsQuery.data);
    }
  }, [productDetailsQuery.isSuccess, schemaQuery.isSuccess, activeTab]);

  useEffect(() => {
    if (productDetailsQuery.isError) {
      toast.error(t("unable_process_this_time"));
      router.push("/products");
    }
  }, [productDetailsQuery.isError]);

  const resetFormData = (product: ProductManagement.Product): void => {
    const productCategory = find(schemaQuery.data, { key: activeTab });
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
          ...getProductDatapointValue(cur, product.schemaItems),
        };
      },
      {}
    );
    const isLineDetails = activeTab === ProductInfoTabEnum.LINE_DETAILS;
    reset(
      isLineDetails
        ? {
            ...formData,
            productCode: product.productCode,
            wholesalerProductCode: product.wholesalerProductCode,
          }
        : formData
    );
  };

  const onSave = handleSubmit((formValue: FieldValues) => {
    const items = getSchemaItem(formValue);
    updateProductMutation.mutate({ items });
  });

  const handleUpdateProductCode = (): void => {
    const productCode = getValues("productCode");
    if (productCode && productCode !== productDetailsQuery.data.productCode) {
      updateProductCustomAttributesMutation.mutate({ productCode });
    }
  };

  const handleUpdateWholesalerProductCode = (): void => {
    const productCode = getValues("wholesalerProductCode");
    if (
      productCode &&
      productCode !== productDetailsQuery.data.wholesalerProductCode
    ) {
      updateConnectedProductCustomAttributesMutation.mutate({ productCode });
    }
  };

  const handleUploadCertification = (files: File[]): void => {
    uploadCertificationMutation.mutate(head(files));
  };

  const onChangeTab = (currentTab: ProductInfoTabEnum): void => {
    if (isDirty) {
      setChangedTab(currentTab);
      openModal("confirmChangeTab");
    } else {
      setActiveTab(currentTab);
    }
  };

  const wholesalerProductCode = watch("wholesalerProductCode");

  useDebounceEffect(
    handleUpdateWholesalerProductCode,
    [wholesalerProductCode],
    {
      wait: 1000,
    }
  );

  if (productDetailsQuery.isLoading || schemaQuery.isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">
              {t("loading_product_details")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderAddProduct = (): ReactNode => {
    const productConnectStatus = get(
      productDetailsQuery.data,
      "productConnectStatus"
    );

    if (productConnectStatus === ProductConnectStatusEnum.PENDING) {
      return (
        <Button
          label={t("pending")}
          icon={<Pause className="w-4 h-4" />}
          className="w-[116px] bg-amber-500"
          disabled
        />
      );
    }

    if (productConnectStatus === ProductConnectStatusEnum.APPROVED) {
      return (
        <Button
          label={t("connected")}
          icon={<CircleCheck className="w-4 h-4" />}
          className="w-[116px]"
          disabled
        />
      );
    }

    if (productConnectStatus === ProductConnectStatusEnum.REJECTED) {
      return (
        <Button
          label={t("declined")}
          icon={<Ban className="w-4 h-4" />}
          className="bg-red-500"
          disabled
        />
      );
    }

    if (productConnectStatus === ProductConnectStatusEnum.READY_TO_UPDATE) {
      return (
        <Button
          label={t("new_update_available")}
          icon={<CircleFadingArrowUp className="h-4 w-4" />}
          onClick={() => openModal("updateConnectVersion")}
        />
      );
    }

    return (
      <Button
        label={t("add_product")}
        icon={<Plus className="h-4 w-4" />}
        onClick={() => openModal("confirm")}
      />
    );
  };

  const renderHeader = (): React.JSX.Element => {
    return (
      <div className="bg-card p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            label={get(productDetailsQuery.data, "name")}
            icon={<ArrowLeft className="h-5 w-5" />}
            variant="ghost"
            className="text-foreground flex items-center mr-4"
            onClick={() => router.back()}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            label={t("export_csv")}
            icon={<Download className="h-4 w-4" />}
            variant="outline"
            className="border-border text-foreground"
            loading={exportProductMutation.isPending}
            onClick={() => exportProductMutation.mutate()}
          />

          {!isSupplier && renderAddProduct()}
          {isSupplier && !isVersion && (
            <Button
              label={t("publish_new_product_version")}
              onClick={() => {
                if (isDirty) {
                  toast(t("unsaved_changes_save_before_publishing"), {
                    icon: <Info className="h-6 w-6 text-blue-500" />,
                  });
                } else {
                  openModal("publish");
                }
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderProductImages = (): React.JSX.Element => {
    const orderedFiles = orderBy(
      get(productDetailsQuery.data, "files"),
      ["createdAt"],
      ["desc"]
    );
    const primaryImage = find(orderedFiles, {
      type: ProductFileTypeEnum.PRIMARY_IMAGE,
    });
    const secondaryImages = filter(orderedFiles, {
      type: ProductFileTypeEnum.SECONDARY_IMAGE,
    });
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-lg overflow-hidden mb-6"
      >
        <div className="p-3 bg-background text-foreground font-medium">
          {t("product_image")}
        </div>
        <div className="p-3 flex flex-col gap-2">
          <div className="relative h-48 w-full bg-muted rounded-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {primaryImage ? (
                <PrimaryImage primaryImage={primaryImage} />
              ) : (
                t("no_image_available")
              )}
            </div>
            {isSupplier && !isVersion && (
              <div
                className="absolute p-2 rounded-full top-1 right-1 bg-white hover:bg-gray-200 cursor-pointer"
                onClick={() => openModal("uploadImage")}
              >
                <Camera className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1 w-100">
            {map(range(4), (item) => {
              const secondaryImage = secondaryImages[item];
              const isLastItem = item === 3;
              if (isVersion) {
                if (secondaryImage) {
                  return (
                    <div
                      key={secondaryImage.id}
                      onClick={() => {
                        setSelectedImage(secondaryImage);
                        openModal("previewImage");
                      }}
                    >
                      <SecondaryImage secondaryImage={secondaryImage} />
                    </div>
                  );
                }

                return null;
              }

              if (secondaryImage && !isLastItem) {
                return (
                  <div
                    key={secondaryImage.id}
                    onClick={() => {
                      setSelectedImage(secondaryImage);
                      openModal("previewImage");
                    }}
                  >
                    <SecondaryImage secondaryImage={secondaryImage} />
                  </div>
                );
              }

              return (
                <div
                  key={item}
                  className="flex items-center justify-center p-2 border border-dashed border-gray-200 hover:border-primary rounded-lg aspect-square cursor-pointer transition-colors duration-200"
                  onClick={() => openModal("uploadSecondaryImage")}
                >
                  <Plus className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderProductOverview = (): React.JSX.Element => (
    <div className="lg:col-span-3">
      {renderProductImages()}

      {/* Quick Product Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-card rounded-lg overflow-hidden"
      >
        <div className="p-3 bg-background text-foreground font-medium">
          {t("quick_product_overview")}
        </div>
        <div className="p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("product_name_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {get(productDetailsQuery.data, "name")}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("product_code_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {get(productDetailsQuery.data, "skuCode")}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("version_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {productDetailsQuery.data?.version || "1.0"}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("category_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {productDetailsQuery.data?.category || "—"}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("supplier_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {productDetailsQuery.data?.supplier || "—"}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("variant_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {productDetailsQuery.data?.variant || "—"}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">
                  {t("created_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {formatDate(get(productDetailsQuery.data, "createdAt"))}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground align-top">
                  {t("updated_with_colon")}
                </td>
                <td className="py-2 text-foreground">
                  {formatDate(get(productDetailsQuery.data, "updatedAt"))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {isSupplier &&
          some(get(productDetailsQuery.data, "files"), {
            type: ProductFileTypeEnum.DOCUMENTS,
          }) && (
            <div className="p-4">
              <Button
                label={t("download_original_product_file")}
                variant="link"
                onClick={() => openModal("uploadedFiles")}
              />
            </div>
          )}
      </motion.div>
    </div>
  );

  const renderTabs = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 grid grid-cols-3 md:grid-cols-6 gap-3"
    >
      {tabs.map((tab) => {
        const TabIcon = getTabIcon(tab.id);
        return (
          <Button
            key={tab.id}
            label={
              <>
                <div className="mb-1">
                  <TabIcon className="h-5 w-5" />
                </div>
                <div className="text-xs text-center">{tab.label}</div>
              </>
            }
            className={`flex flex-col items-center justify-center h-20 border ${
              activeTab === tab.id
                ? "border-primary text-foreground bg-card"
                : "border-border text-foreground/80 bg-card"
            }`}
            onClick={() => onChangeTab(tab.id)}
          />
        );
      })}
    </motion.div>
  );

  const renderActions = (): React.JSX.Element => (
    <div className="mt-8 flex justify-end space-x-4">
      <Button
        label={t("cancel")}
        variant="outline"
        onClick={() => router.push("/products")}
      />
      <Button
        label={t("save_changes")}
        icon={<Edit className="h-4 w-4" />}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        loading={updateProductMutation.isPending}
        onClick={onSave}
      />
    </div>
  );

  const showWholesalerProductCode =
    Boolean(get(productDetailsQuery.data, "productConnectId")) &&
    includes(
      [
        ProductConnectStatusEnum.APPROVED,
        ProductConnectStatusEnum.READY_TO_UPDATE,
      ],
      get(productDetailsQuery.data, "productConnectStatus")
    );

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {renderHeader()}

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {renderProductOverview()}

            <div className="lg:col-span-9">
              {renderTabs()}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-card p-6 rounded-lg"
              >
                <ProductInfo
                  control={control}
                  schema={schemaQuery.data}
                  product={productDetailsQuery.data}
                  type={activeTab}
                  readOnly={isVersion}
                  isSupplier={isSupplier}
                  showWholesalerProductCode={showWholesalerProductCode}
                  handleUpdateProductCode={handleUpdateProductCode}
                  handleUpdateWholesalerProductCode={
                    handleUpdateWholesalerProductCode
                  }
                  handleUploadCertification={handleUploadCertification}
                />
                {isSupplier && !isVersion && renderActions()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {modal.confirm.load && (
        <ConfirmDialog
          open={modal.confirm.open}
          title={t("confirm_add_product_title")}
          description={t("confirm_add_product_title")}
          onClose={closeModal("confirm")}
          onConfirm={connectProductMutation.mutateAsync}
        />
      )}
      {modal.publish.load && (
        <ProductVersionDialog
          open={modal.publish.open}
          product={productDetailsQuery.data}
          refetch={productDetailsQuery.refetch}
          onClose={closeModal("publish")}
        />
      )}
      {modal.updateConnectVersion.load && (
        <ConfirmDialog
          open={modal.updateConnectVersion.open}
          title={t("confirm_update_product_version")}
          description={t("confirm_update_product_version")}
          onClose={closeModal("updateConnectVersion")}
          onConfirm={updateConnectVersionMutation.mutateAsync}
        />
      )}
      {modal.exportCSV.load && (
        <ExportCSVDialog
          open={modal.exportCSV.open}
          ids={[isVersion ? productId : productVersionId]}
          onClose={closeModal("exportCSV")}
        />
      )}
      {modal.uploadImage.load && (
        <UploadProductImage
          open={modal.uploadImage.open}
          productId={productId}
          refetch={productDetailsQuery.refetch}
          onClose={closeModal("uploadImage")}
        />
      )}
      {modal.uploadSecondaryImage.load && (
        <UploadProductImage
          open={modal.uploadSecondaryImage.open}
          productId={productId}
          type={ProductFileTypeEnum.SECONDARY_IMAGE}
          refetch={productDetailsQuery.refetch}
          onClose={closeModal("uploadSecondaryImage")}
        />
      )}
      {modal.uploadedFiles.load && (
        <UploadedFilesDialog
          open={modal.uploadedFiles.open}
          files={get(productDetailsQuery.data, "files")}
          onClose={closeModal("uploadedFiles")}
        />
      )}
      {modal.confirmChangeTab.load && (
        <ConfirmDialog
          open={modal.confirmChangeTab.open}
          title={t("confirm")}
          description={t("change_not_saved")}
          onClose={closeModal("confirmChangeTab")}
          onConfirm={() => setActiveTab(changedTab)}
        />
      )}
      {modal.previewImage.load && (
        <PreviewImageDialog
          open={modal.previewImage.open}
          image={selectedImage}
          onClose={closeModal("previewImage")}
        />
      )}
    </Layout>
  );
};

export default ProductDetails;
