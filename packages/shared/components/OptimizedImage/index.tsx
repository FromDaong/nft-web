import Image from "next/image";

const gumletLoader = ({ src, width, quality }) => {
  return `https://treatnfts.gumlet.io${src}?w=${width}&q=${quality || 75}`;
};

type OptimizedImageProps = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
};

const OptimizedImage = (props: OptimizedImageProps) => {
  return (
    <div className="h-[360px] xl:h-[720px] image-container">
        <Image
            loader={gumletLoader}
            quality={props.quality}
            src={props.src}
            alt={props.alt}
            width={props.height}
            height={props.height}
            className={props.className + " object-cover"}
            layout={props.layout}
        />
    </div>
  );
};

export default OptimizedImage;
