"use client";

// import Image from "next/image";

const SecondaryImage: FunctionComponent<{
  secondaryImage: ProductManagement.FileInfo;
}> = ({ secondaryImage }) => {
  return (
    <div className="relative p-1 bg-muted rounded-lg aspect-square">
      <img
        src={get(secondaryImage, "url")}
        alt={secondaryImage.name}
        // fill
        className="absolute inset-0 object-contain cursor-pointer"
      />
    </div>
  );
};

export default SecondaryImage;
