import {styled} from "@styles/theme";

export const PostCardContainer = styled("div", {
	flexShrink: "0",
});

export const LiveMediaPostContainer = styled("div", {
	width: "fit-content",
	height: "80vh",
	position: "relative",
});

export const PostMediaContainer = styled("div", {
	height: "fit-content",
	overflow: "hidden",
	position: "relative",
	width: "100%",
});

export const PostVisualMediaWrapper = styled("div", {
	width: "100%",
	height: "auto",
	position: "relative",
});

export const PostCardCreatorInfoContainer = styled("div", {
	display: "flex",
	alignItems: "center",
	columnGap: "12px",
	justifyContent: "space-between",
});

export const PostCardMetaContainer = styled("div", {
	marginBottom: "16px",
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
