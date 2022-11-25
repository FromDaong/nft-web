import BackgroundImage from "./BackgroundImage";
import Blurhash from "./Blurhash";

export const PostMediaContent = (props: {
  imageUrl?: string;
  blurhash?: string;
  overrideText?: string;
}) => {
  return props.imageUrl ? (
    <BackgroundImage url={props.imageUrl} />
  ) : (
    <Blurhash overrideText={props.overrideText} blurhash={props.blurhash} />
  );
};
