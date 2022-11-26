import OptimizedImage from "@packages/shared/components/OptimizedImage";

const BackgroundImage = ({ url, caption }) => {
  return (
    <>
      <OptimizedImage
        objectFit={"cover"}
        alt={caption}
        src={url}
        sizes="100vw"
        fill
      />
    </>
  );
};

export default BackgroundImage;
