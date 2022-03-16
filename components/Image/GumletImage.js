import Image from "next/image";

const GumletImage = (props) => {
  return (
    <Image src={props.src} alt={props.alt} layout="fill" objectFit="cover" />
  );
};

export default GumletImage;
