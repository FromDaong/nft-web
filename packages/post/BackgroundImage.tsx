import { Container } from "@packages/shared/components/Container";

const BackgroundImage = ({ url }) => {
  return (
    <>
      <Container
        className="absolute top-0 left-0 right-0 bottom-0 h-full w-full"
        css={{
          backgroundColor: "$overlay",
          zIndex: 1,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 bottom-0 h-full w-full"
        style={{
          backgroundImage: `url('${url}')`,
          zIndex: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
        }}
      />
    </>
  );
};

export default BackgroundImage;
