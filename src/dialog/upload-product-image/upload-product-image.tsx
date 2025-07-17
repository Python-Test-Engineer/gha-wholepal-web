"use client";

import { Cropper } from "react-cropper";
import { toast } from "react-hot-toast";
import FileUpload from "@/components/form-ui/file-upload";
import Button from "@/components/form-ui/button";
import { uploadImage } from "@/api/product";
import BaseDialog from "@/dialog/base-dialog";
import { Loader2 } from "lucide-react";
import { ACCEPT_FILE } from "@/config/constants";
import { MediaFileTypeEnum } from "@/enums/media";
import { ProductFileTypeEnum } from "@/enums/product";
import { cn } from "@/lib/utils";
import type { ReactCropperElement } from "react-cropper";
import { convertCanvasToFile } from "@/utils/helpers";

const UploadProductImage: FunctionComponent<{
  open: boolean;
  productId: string;
  type?: ProductFileTypeEnum;
  onClose: () => void;
  refetch?: () => void;
}> = ({
  open,
  productId,
  type = ProductFileTypeEnum.PRIMARY_IMAGE,
  onClose,
  refetch = () => null,
}) => {
  const t = useTranslations();
  const {
    control,
    formState: { isDirty },
    watch,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: { images: [] },
  });

  const images = watch("images");
  const previewImage = head(images);
  const cropperRef = useRef<ReactCropperElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (data: ProductManagement.UploadImageData) =>
      uploadImage(productId, data),
    onSuccess: () => {
      toast.success(t("successfully_uploaded"));
      refetch();
      onClose();
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const previewImageUrl = useMemo(
    () => previewImage && URL.createObjectURL(previewImage),
    [previewImage]
  );

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const onSubmit = handleSubmit(async () => {
    const canvas = cropperRef.current.cropper.getCroppedCanvas({
      fillColor: "#fff",
      imageSmoothingQuality: "high",
    });
    const croppedFile = await convertCanvasToFile(canvas);
    uploadMutation.mutate({ image: croppedFile, type });
  });

  const renderFooter = (): React.JSX.Element => (
    <div
      className={cn(
        "flex gap-2 w-full",
        Boolean(previewImage) ? "justify-between" : "justify-end"
      )}
    >
      {previewImage && (
        <Button
          label={t("select_another_image")}
          variant="outline"
          onClick={() => reset()}
        />
      )}
      <div className="flex gap-2">
        <Button
          label={t("cancel")}
          variant="outline"
          disabled={uploadMutation.isPending}
          onClick={onClose}
        />
        <Button
          label={t("upload")}
          disabled={!isDirty}
          loading={uploadMutation.isPending}
          onClick={onSubmit}
        />
      </div>
    </div>
  );

  return (
    <BaseDialog
      open={open}
      title={t("upload_product_image")}
      contentClassname="sm:max-w-[600px]"
      footer={renderFooter()}
      onClose={onClose}
    >
      {previewImageUrl ? (
        <Cropper
          center
          responsive
          initialAspectRatio={1}
          dragMode="move"
          ref={cropperRef}
          src={previewImageUrl}
          background={false}
          minCropBoxWidth={20}
          minCropBoxHeight={20}
          className="w-[100%] h-[400px]"
        />
      ) : (
        <FileUpload
          control={control}
          name="images"
          acceptFile={ACCEPT_FILE.IMAGE}
          fileType={MediaFileTypeEnum.IMAGE}
          enableDragAndDrop
        />
      )}
    </BaseDialog>
  );
};

export default UploadProductImage;
