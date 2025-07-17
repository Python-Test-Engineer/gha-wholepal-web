"use client";

// import Image from "next/image";

const PreviewImageDialog = lazyload(
  () => import("@/dialog/preview-image-dialog")
);

const PrimaryImage: FunctionComponent<{
  primaryImage: ProductManagement.FileInfo;
}> = ({ primaryImage }) => {
  const { modal, openModal, closeModal } = useModalState(["preview"]);

  return (
    <>
      <img
        src={primaryImage.url}
        alt={primaryImage.name}
        // fill
        className="object-contain cursor-pointer"
        onClick={() => openModal("preview")}
      />
      {modal.preview.load && (
        <PreviewImageDialog
          open={modal.preview.open}
          image={primaryImage}
          onClose={closeModal("preview")}
        />
      )}
    </>
  );
};

export default PrimaryImage;
