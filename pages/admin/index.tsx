import {useContracts} from "@packages/post/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useCallback, useState} from "react";
import {useAccount, useSigner} from "wagmi";

interface Props {
	address: string;
}

const UnAuthed = (props) => {
	return (
		<Container className="flex flex-col items-center w-full gap-8 px-4 py-12">
			<Container className="max-w-xl text-center">
				<Heading size={"sm"}>You are not authenticated.</Heading>
				<Text>
					You are not authenticated. Please authenticate to access this page.
				</Text>
			</Container>
			<Container className="flex flex-col w-full max-w-xl gap-4">
				<Input
					placeholder="Password"
					name={"password"}
					required
					type={"password"}
				/>
				<Button>Login to Panel</Button>
			</Container>
		</Container>
	);
};

function PendingCreators(props: {pending_creators: string}) {
	const creators = JSON.parse(props.pending_creators ?? "[]") as Array<any>;
	const router = useRouter();
	const {data} = useSigner();
	const {address} = useAccount();
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
			className="py-12 flex flex-col gap-8 px-4"
			css={{
				backgroundColor: "$elementOnSurface",
			}}
		>
			<Heading size={"xs"}>Pending creators ({creators.length})</Heading>
			{creators.length > 0 && (
				<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
					{creators.map((creator) => (
						<Container
							className="col-span-1 p-4 flex flex-col gap-4 bg-gray-100 rounded-xl shadow"
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

const AdminDashboard: NextPage<Props> = ({address}) => {
	const router = useRouter();

	const signInToAdmin = (password) => {
		router.reload();
	};

	return (
		<ApplicationFrame>
			<UnAuthed signInToAdmin={signInToAdmin} />
			<Container className="flex flex-col w-full gap-12 px-4">
				<Container>
					<Heading>Dashboard</Heading>
					<Text>
						Welcome to the admin dashboard. Here you can manage your creators,
						profiles and TOTM NFTs.
					</Text>
				</Container>
				<Container className="flex flex-wrap gap-4">
					<Button>Create TOTM NFTs</Button>
					<Button>Create $Melon NFTs</Button>
					<Button appearance={"surface"}>Sign out</Button>
				</Container>
				<PendingCreators pending_creators="[]" />
				<Container
					className="flex flex-col gap-4 p-4 md:p-8 rounded-xl"
					css={{backgroundColor: "$elementOnSurface"}}
				>
					<Heading size="xs">Team members</Heading>
					<Container>
						<Text>There are current team members.</Text>
					</Container>
				</Container>
			</Container>
		</ApplicationFrame>
	);
};

export default AdminDashboard;
