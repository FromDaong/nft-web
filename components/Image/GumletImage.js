import Image from "next/image";

const gumletLoader = ({ src }) => {
  return `https://treatdao.gumlet.io${src}`;
};

const GumletImage = (props) => {
  return (
    <Image
      loader={gumletLoader}
      src={props.src}
      alt={props.alt}
      layout="fill"
      objectFit="cover"
    />
  );
};

export default GumletImage;
