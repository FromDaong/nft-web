import {Container} from "@packages/shared/components/Container";
import {styled} from "@styles/theme";
import {ComponentBasicProps} from "core/TreatCore";

const ApplicationChildrenContainer = styled("div", {
	marginBottom: "56px",
	width: "100%",
	display: "grid",
});

const Main = styled(Container, {
	maxWidth: "100%",
	width: "100%",
	gap: "4%",
	marginBottom: "56px",
	height: "100%",
	overflowY: "auto",
	overscrollBehaviorY: "contain",
	minHeight: "100vh",
});

const Frame = styled("div", {
	position: "relative",
});

export default function ApplicationFrame({
	children,
}: ComponentBasicProps & {layout?: "normal" | "collapse"}) {
	return (
		<Frame className="relative flex flex-col container mx-auto">
			<Main>
				<ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
			</Main>
		</Frame>
	);
}
