import Image from "next/image";

const gumletLoader = ({ src, width, quality }) => {
  return `https://treatdao.gumlet.io/${src}?q=${quality || 75}`;
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
