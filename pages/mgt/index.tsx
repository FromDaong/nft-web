import {useContracts} from "@packages/post/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {useRouter} from "next/router";
import {useCallback, useState} from "react";
import {connectMongoDB} from "server/helpers/core";
import ModelCreator from "server/helpers/models/users/creator";
import {useAccount, useSigner} from "wagmi";

export default function Address(props: {pending_creators: string}) {
	const creators = JSON.parse(props.pending_creators) as Array<any>;
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
		<ApplicationFrame>
			<Container className="py-12 flex flex-col gap-8 px-4">
				<Container>
					<Heading size={"sm"}>Pending creators ({creators.length})</Heading>
					<Text>
						Please use this interface only for the purposes of approving a
						creator. To delete and manage creator applications please use the
						respective dashboard.
					</Text>
				</Container>
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
			</Container>
		</ApplicationFrame>
	);
}

export const getServerSideProps = async (ctx) => {
	await connectMongoDB();
	const pending = await ModelCreator.find({
		pending: true,
	})
		.populate("profile")
		.exec();

	return {
		props: {
			pending_creators: JSON.stringify(pending),
		},
	};
};
