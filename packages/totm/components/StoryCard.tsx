import { styled } from "@styles/theme";

const Circle = styled("div", {
  position: "relative",
  overflow: "hidden",
  height: "72px",
  width: "72px",
  borderRadius: "9999px",
});

export default function StoryPreview() {
  return <Circle className="bg-gray-100"></Circle>;
}
