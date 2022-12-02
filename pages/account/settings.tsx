import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {SEOHead} from "@packages/seo/page";
import {useRouter} from "next/router";
import PersonalInformationForm from "@packages/settings/components/ProfileForms";
import {LinksForm} from "@packages/settings/components/ProfileForms";
import {ProfileDropdown} from "@packages/Dropdowns";
import Avatar, {AvatarGroup} from "@packages/shared/components/AvatarNew";
import {Button} from "@packages/shared/components/Button";
import {
	Container,
	ContextualContainer,
	FluidContainer,
} from "@packages/shared/components/Container";
import {Tab, TabsContainer} from "@packages/shared/components/Tabs";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Bull, JustifiedSpan} from "@packages/shared/components/Typography/Text";
import {styled} from "@styles/theme";
import {ComponentBasicProps} from "core/TreatCore";

// TODO: Use intersection observer to change navbar color.

const followers = [
	{
		name: "kamfeskaya",
		imageSrc:
			"https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
	},
	{
		name: "kamfeskaya",
		imageSrc:
			"https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80",
	},
];

const AvatarContainer = styled("div", {
	borderRadius: "50%",
	height: "128px",
	width: "128px",
	position: "absolute",
	bottom: "0",
	transform: "translate(36px, 36px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
	border: "8px solid $surface",
});

const UserHeader = () => {
	return (
		<div className="w-full">
			<div
				className="w-full"
				style={{
					height: "256px",
					background: "linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)",
				}}
			>
				<FluidContainer className="relative flex h-full">
					<AvatarContainer className="drop-shadow">
						<Avatar
							name="Tatenda Chris"
							imageSrc="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=90"
							size={{width: "128px", height: "128px"}}
						/>
					</AvatarContainer>
				</FluidContainer>
			</div>
		</div>
	);
};

export default function Settings() {
	const router = useRouter();
	const query = router.query;

	const user = {
		username: query.username,
		displayName: "Kamfeskaya",
		bio: "Latino Artist. Author. Producer. Daddy. Hand-drawn 1:1s capturing the energy of a moment. Life is beautiful.",
		followers: 241,
		following: 245,
		earnings: 47.0,
		address: "0x0eEd1d0Aa085a1C41aDf5184FAE07025217bF44c",
	};
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<UserHeader />

				<Container className="flex flex-col gap-12 mt-16">
					<PersonalInformationForm />
					<LinksForm />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
