import BackofficeNavigation from "@components/BackofficeNavigation";
import AdminDashboardWrapper from "@components/BackofficeNavigation/BackofficeWrapper";
import Hero from "@components/Hero";
import {LogoutIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {StackIcon} from "@radix-ui/react-icons";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {ArrowRight, CircleSlashIcon, Hourglass, PlusIcon} from "lucide-react";

import Link from "next/link";

const AdminDashboard = () => {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<AdminDashboardWrapper>
					<div className="py-8 flex flex-col gap-8">
						<Hero
							title={"Admin Dashboard"}
							subtitle={`
							Manage creators and create new NFT collections as admin.
						`}
						/>

						<BackofficeNavigation />

						<Container className="flex flex-col gap-8">
							<CreateTOTMNFTsCard />
							<CreateMelonNFTsCard />
							<Container className="flex flex-col gap-4 mt-4">
								<Heading
									size={"xs"}
									className="mb-3"
								>
									Quick navigation
								</Heading>
							</Container>
							<Container className="grid grid-cols-1 lg:grid-cols-3 gap-8">
								<BrowsePendingCreators />
								<BrowseRejectedCreators />
							</Container>
						</Container>
					</div>
				</AdminDashboardWrapper>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

function CreateTOTMNFTsCard() {
	return (
		<Container
			className="grid grid-cols-1 col-span-1 p-8 rounded-xl"
			css={{
				backgroundColor: "$accentBg",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "bottom right",
				backgroundImage: "url('/assets/svg/create-background.svg')",
			}}
		>
			<Container className="flex flex-col col-span-1 gap-8">
				<Container className="flex flex-col gap-4">
					<Container className="flex items-center gap-2">
						<Text>
							<StackIcon className="w-5 h-5" />
						</Text>
						<Text>
							<ImportantText>Create</ImportantText>
						</Text>
					</Container>
					<Container>
						<Heading size={"xs"}>Launch new Treat of the Month NFTs</Heading>
						<Text>Create a new Treat of The Month NFT Collection</Text>
					</Container>
				</Container>

				<Container className="mt-auto">
					<Link href={"/backoffice/create-totm-nfts"}>
						<a>
							<Button
								appearance={"accent"}
								css={{
									borderRadius: "9999px",
								}}
							>
								<PlusIcon className="w-5 h-5" />
								Launch TOTM collection
							</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</Container>
	);
}

function CreateMelonNFTsCard() {
	return (
		<Container
			className="grid grid-cols-1 col-span-1 p-8 rounded-xl"
			css={{
				backgroundColor: "$mint2",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "bottom right",
				backgroundImage: "url('/assets/svg/create-background.svg')",
			}}
		>
			<Container className="flex flex-col col-span-1 gap-8">
				<Container className="flex flex-col gap-4">
					<Container className="flex items-center gap-2">
						<Text>
							<StackIcon className="w-5 h-5" />
						</Text>
						<Text>
							<ImportantText>Create</ImportantText>
						</Text>
					</Container>
					<Container>
						<Heading size={"xs"}>Mint new Melon NFTs</Heading>
						<Text>Add new melon NFTs to the Farmers Market.</Text>
					</Container>
				</Container>

				<Container className="mt-auto">
					<Link href={"/backoffice/create-melon-nfts"}>
						<a>
							<Button
								appearance={"success"}
								css={{
									borderRadius: "9999px",
								}}
							>
								<PlusIcon className="w-5 h-5" />
								Add Melon NFTs
							</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</Container>
	);
}

function BrowseRejectedCreators() {
	return (
		<Container
			css={{
				backgroundColor: "$red2",
			}}
			className="p-4 pt-48 rounded-xl gap-8 flex flex-col justify-end"
		>
			<Container className="flex flex-col gap-4">
				<Text>
					<CircleSlashIcon className="w-6 h-6" />
				</Text>
				<Heading size={"xs"}>Rejected creators</Heading>
				<Text>Creators that have been rejected from the platform.</Text>
			</Container>
			<Container className="flex gap-4">
				<Link href={"/backoffice/rejected"}>
					<a>
						<Button
							appearance={"surface"}
							outlined
						>
							Browse
							<ArrowRight className="w-5 h-5" />
						</Button>
					</a>
				</Link>
			</Container>
		</Container>
	);
}

function BrowsePendingCreators() {
	return (
		<Container
			css={{
				backgroundColor: "$surfaceOnSurface",
			}}
			className="p-4 pt-48 rounded-xl gap-8 flex flex-col justify-end"
		>
			<Container className="flex flex-col gap-4">
				<Text>
					<Hourglass className="w-6 h-6" />
				</Text>
				<Heading size={"xs"}>Pending creators</Heading>
				<Text>
					Creators that have applied to the platform but have not been approved
					yet.
				</Text>
			</Container>
			<Container className="flex gap-4">
				<Link href={"/backoffice/pending"}>
					<a>
						<Button
							appearance={"surface"}
							outlined
						>
							Browse
							<ArrowRight className="w-5 h-5" />
						</Button>
					</a>
				</Link>
			</Container>
		</Container>
	);
}
export default AdminDashboard;
