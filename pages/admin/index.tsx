import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {NextPage} from "next";
import {useRouter} from "next/router";

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
				<Container
					className="flex flex-col gap-4 p-4 md:p-8 rounded-xl"
					css={{backgroundColor: "$elementOnSurface"}}
				>
					<Heading size="xs">Pending creators</Heading>
					<Container>
						<Text>There are no pending creators.</Text>
					</Container>
				</Container>
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
