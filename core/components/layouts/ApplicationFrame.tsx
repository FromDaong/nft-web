import {Container} from "@packages/shared/components/Container";
import {styled} from "@styles/theme";
import {ComponentBasicProps} from "core/TreatCore";
import {useRouter} from "next/router";

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
	overscrollBehaviorY: "contain",
});

const Frame = styled("div", {
	position: "relative",
});

export const FullscreenApplicationFrame = ({children}: ComponentBasicProps) => {
	const router = useRouter();
	const {pathname} = router;
	const isActive = (href) => pathname === href;
	return (
		<Frame className="relative flex w-screen">
			<Main className="flex-1">
				<ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
			</Main>
		</Frame>
	);
};

export default function ApplicationFrame({
	children,
	layout,
}: ComponentBasicProps & {layout?: "normal" | "collapse"}) {
	return (
		<Frame className="container relative flex flex-1 flex-col mx-auto max-w-screen-xl">
			{children}
		</Frame>
	);
}
