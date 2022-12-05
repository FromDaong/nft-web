import {
	ChatAltIcon,
	HomeIcon,
	MapIcon,
	UserGroupIcon,
	UserIcon,
	VideoCameraIcon,
} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {
	BoldLink,
	SmallText,
	Username,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {styled} from "@styles/theme";
import {ComponentBasicProps} from "core/TreatCore";
import Link from "next/link";
import {useRouter} from "next/router";
import FeaturedFrame from "./FeaturedFrame";
import Avatar, {LivestreamingAvatar} from "@packages/shared/components/Avatar";
import {ImageIcon} from "@radix-ui/react-icons";
import {CashIcon} from "@heroicons/react/solid";

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

const CollapsedSidebar = styled("div", {
	width: "64px",
	gap: "20px",
	height: "100vh",
	marginTop: "-128px",
	overflowY: "auto",
	overscrollBehaviorY: "contain",
	minHeight: "100%",
	paddingTop: "64px",
});

export const FullscreenApplicationFrame = ({children}: ComponentBasicProps) => {
	const router = useRouter();
	const {pathname} = router;
	const isActive = (href) => pathname === href;
	return (
		<Frame className="relative flex w-screen">
			<CollapsedSidebar></CollapsedSidebar>
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
		<Frame className="relative flex flex-col max-w-7xl mx-auto">
			<Main>
				<ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
			</Main>
		</Frame>
	);
}
