import BackgroundImage from "./BackgroundImage";
import Blurhash from "./Blurhash";

export const PostMediaContent = (props: {
  imageUrl?: string;
  blurhash?: string;
  overrideText?: string;
  caption: string;
}) => {
  return props.imageUrl ? (
    <BackgroundImage url={props.imageUrl} caption={props.caption} />
  ) : (
    <Blurhash overrideText={props.overrideText} blurhash={props.blurhash} />
  );
};
