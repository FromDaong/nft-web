import {useDisclosure} from "@packages/hooks";
import AddTeamMemberModal from "@packages/modals/AddTeamMemberModal";
import ConfirmActionModal from "@packages/modals/ConfirmActionModal";
import {useContracts} from "@packages/post/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useCallback, useState} from "react";
import {pagePropsConnectMongoDB} from "server/helpers/core/pagePropsDB";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";
import {useAccount, useSigner} from "wagmi";

interface Props {
	address: string;
	pending_creators: string;
	team_members: string;
}

const UnAuthed = () => {
	return (
		<Container className="flex min-h-[80vh] flex-col justify-center items-center w-full gap-8 px-4 py-12">
			<Container className="max-w-xl text-center">
				<Heading size={"sm"}>You are not authenticated.</Heading>
				<Text>
					You are not authenticated. Please connect with a whitelisted wallet to
					access this page
				</Text>
			</Container>
		</Container>
	);
};

function PendingCreators(props: {pending_creators}) {
	const {address} = useAccount();
	const creators = props.pending_creators;
	const router = useRouter();
	const {data} = useSigner();
	const {permissionsHelperContract} = useContracts();
	const [loading, setLoading] = useState("");

	const approve = useCallback(
		(creatorAddress) => {
			if (!data) {
				alert("Signer not found");
				return;
			}

			setLoading(creatorAddress);

			permissionsHelperContract
				.addPerformer(creatorAddress, {
					from: address,
					value: 0,
				})
				.then(router.reload)
				.catch((err) => {
					alert(err);
					setLoading(null);
				});
		},
		[data, permissionsHelperContract]
	);

	return (
		<Container
			className="py-12 flex flex-col gap-8 p-4 md:p-8 rounded-xl"
			css={{
				backgroundColor: "$elementOnSurface",
			}}
		>
			<Heading size={"xs"}>Pending creators ({creators.length})</Heading>
			{creators.length > 0 && (
				<Container className="flex flex-col gap-4">
					{creators.map((creator) => (
						<Container
							className="col-span-1 p-4 flex justify-between w-full gap-4 bg-gray-100 rounded-xl shadow"
							key={creator._id}
						>
							<Container className="flex flex-col">
								<Text>
									<ImportantText>{creator.profile.display_name}</ImportantText>
								</Text>
								<Text>@{creator.username}</Text>
							</Container>

							<Container className="grid gap-2">
								<Button
									onClick={() => approve(creator.address)}
									appearance={
										loading === creator.address ? "loading" : "action"
									}
								>
									{loading === creator.address ? <Spinner /> : "Approve"}
								</Button>
							</Container>
						</Container>
					))}
				</Container>
			)}
			{creators.length === 0 && (
				<Container>
					<Text>There are currently pending creators.</Text>
				</Container>
			)}
		</Container>
	);
}

function ManageTeamMembers(props: {team_members}) {
	const [selectedMember, setSelectedMember] = useState(null);
	const router = useRouter();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {
		isOpen: isConfirmOpen,
		onOpen: setConfirmOpen,
		onClose: setConfirmClose,
	} = useDisclosure();

	const removeTeamMember = () => {
		axios
			.post(`${apiEndpoint}/profile/remove-team-badge?_id=${selectedMember}`)
			.then(() => router.reload());
	};

	const closeConfirm = () => {
		setSelectedMember(null);
		setConfirmClose();
	};

	return (
		<Container
			className="flex flex-col gap-8 p-4 md:p-8 rounded-xl"
			css={{backgroundColor: "$elementOnSurface", boxShadow: "$shadow"}}
		>
			{isOpen && (
				<AddTeamMemberModal
					isOpen={isOpen}
					onClose={onClose}
				/>
			)}
			{selectedMember && (
				<ConfirmActionModal
					action_verb="remove this team member"
					action={removeTeamMember}
					isOpen={isConfirmOpen}
					onClose={closeConfirm}
				/>
			)}
			<Container className="flex justify-between items-center">
				<Heading size="xs">Team members ({props.team_members.length})</Heading>
				<Button onClick={onOpen}>Add team member</Button>
			</Container>
			<Container>
				{props.team_members.length === 0 && (
					<Text>There are no current team members.</Text>
				)}
				{props.team_members.length > 0 && (
					<Container className="flex flex-col gap-4">
						{props.team_members.map((profile) => (
							<Container
								className="col-span-1 p-4 flex justify-between w-full gap-4 bg-gray-100 rounded-xl shadow"
								key={profile._id}
							>
								<Container className="flex flex-col">
									<Container className="flex gap-2">
										<Text>
											<ImportantText>{profile.display_name}</ImportantText>
										</Text>
										<Text>
											<SmallText>@{profile.username}</SmallText>
										</Text>
									</Container>
									<Text>
										<SmallText>@{profile.address}</SmallText>
									</Text>
									<Container>
										<Button
											css={{paddingX: "8px", paddingY: "4px"}}
											appearance={"surface"}
										>
											<SmallText>
												{profile.isCouncil && "Council"}
												{profile.isTeam && "Team"}
											</SmallText>
										</Button>
									</Container>
								</Container>

								<Container className="flex flex-col gap-2">
									<Button
										onClick={() => {
											setSelectedMember(profile._id);
											setConfirmOpen();
										}}
										appearance="danger"
									>
										Remove
									</Button>
								</Container>
							</Container>
						))}
					</Container>
				)}
			</Container>
		</Container>
	);
}

const AdminDashboard: NextPage<Props> = (props) => {
	const pending_creators = JSON.parse(
		props.pending_creators ?? "[]"
	) as Array<any>;
	const team_members = JSON.parse(props.team_members ?? "[]") as Array<any>;

	const {address} = useAccount();

	// T-77 add auth
	if (address === "0x8c80F871f91b7E53859cbffebdb35311630B548a") {
		return <UnAuthed />;
	}

	return (
		<ApplicationFrame>
			<Container className="flex flex-col w-full gap-12 px-4 py-12">
				<Container>
					<Heading>Dashboard</Heading>
					<Text>
						Welcome to the admin dashboard. Here you can manage your creators,
						profiles and TOTM NFTs.
					</Text>
				</Container>
				{false && (
					<Container className="flex flex-wrap gap-4">
						<Button>Create TOTM NFTs</Button>
						<Button>Create $Melon NFTs</Button>
					</Container>
				)}
				<PendingCreators pending_creators={pending_creators} />
				<ManageTeamMembers team_members={team_members} />
			</Container>
		</ApplicationFrame>
	);
};

export default AdminDashboard;

export const getServerSideProps = async (ctx) => {
	await pagePropsConnectMongoDB();
	const pending = await MongoModelCreator.find({
		pending: true,
	})
		.populate("profile")
		.exec();

	const team_members = await MongoModelProfile.find({
		$or: [
			{
				isTeam: true,
			},
			{
				isCouncil: true,
			},
		],
	}).exec();

	return {
		props: {
			pending_creators: JSON.stringify(pending),
			team_members: JSON.stringify(team_members),
		},
	};
};
