import { styled } from "@styles/theme";

export const PostCardContainer = styled("div", {
  flexShrink: "0",
  borderBottom: "1px solid $subtleBorder",
});

export const LiveMediaPostContainer = styled("div", {
  width: "100%",
  height: "80vh",
  position: "relative",
});

export const PostMediaContainer = styled("div", {
  height: "max-content",
  overflow: "hidden",
  position: "relative",
});

export const PostVisualMediaWrapper = styled("div", {
  width: "360px",
  height: "520px",
  position: "relative",
});

export const PostCardCreatorInfoContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  columnGap: "12px",
  justifyContent: "space-between",
});

export const PostCardMetaContainer = styled("div", {
  padding: "4px 0",
  display: "flex",
  flexDirection: "column",
});

export const PostCardAction = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 2px",
});

export const PostCardCollectorsContainer = styled("div", {
  marginTop: "12px",
  display: "flex",
  position: "relative",
  columnGap: "12px",
  alignItems: "center",
});
