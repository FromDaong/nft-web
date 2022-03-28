import Image from "next/image";

const gumletLoader = ({ src }) => {
  return `${src}`;
};

const GumletImage = (props) => {
  return (
    <Image
      {...props}
      loader={gumletLoader}
      layout="fill"
      objectFit="cover"
      unoptimized
    />
  );
};

export default GumletImage;
