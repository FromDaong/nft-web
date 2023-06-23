import Hero from "@components/Hero";
import {GiftIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {PlusIcon} from "lucide-react";

import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import useSWR from "swr";
import {useAccount} from "wagmi";

const AdminDashboardWrapper = () => {
	const {isConnected} = useAccount();

	const {data} = useSWR(`/api/admin/is-authed`);

	if (!isConnected || !data) {
		return (
			<div
				style={{
					position: "fixed",
					width: "100%",
					height: "100%",
					display: "flex",
					top: 0,
					left: 0,
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Heading
					size={"xss"}
					style={{
						borderRadius: 5,
						padding: 10,
					}}
				>
					Please make sure your wallet on the Binance Smart Chain is connected.
				</Heading>
				<Spinner
					animation="border"
					role="status"
					style={{marginTop: 5}}
				>
					<span className="sr-only">Loading...</span>
				</Spinner>
			</div>
		);
	} else {
		if (data.failed)
			return (
				<Hero
					title={"You are not authenticated."}
					subtitle={"You are not permitted to use this dashboard"}
					additionalContent={
						<Link href="/admin-dashboard/login">
							<Button className="bg-primary text-white font-bold">
								<b>{"Login to Panel"}</b>
							</Button>
						</Link>
					}
				/>
			);
		return <AdminDashboard />;
	}
};

const AdminDashboard = () => {
	const {data} = useSWR(`/api/admin/get-pending`);

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<div className="py-8 flex flex-col gap-8">
					<Hero
						title={"Admin Dashboard"}
						subtitle={`Approve and reject creator application requests here. Click an application for more info`}
						additionalContent={
							<Container className="flex gap-4 flex-wrap">
								<Link href="/backoffice/create-totm-nfts">
									<a>
										<Button>
											<PlusIcon className="h-5 w-5" />
											Create TOTM NFTs
										</Button>
									</a>
								</Link>
								<Link href="/backoffice/create-melon-nfts">
									<a>
										<Button appearance={"success"}>
											<GiftIcon className="h-5 w-5" />
											Create $Melon NFTs{" "}
										</Button>
									</a>
								</Link>
								<Link href="/api/admin/logout">
									<a>
										<Button appearance={"danger"}>Logout</Button>
									</a>
								</Link>
							</Container>
						}
					/>

					<div className="mt-2 white-tp-container">
						<Heading
							size={"xs"}
							className="mb-3"
						>
							Pending ⌛
						</Heading>
						<Container className="flex flex-col gap-1">
							{data &&
								data.pendingModels.map((m) => (
									<Link
										key={m.username}
										href={`/backoffice/${m.username}`}
									>
										<a>
											<Container
												css={{
													"&:hover": {
														backgroundColor: "$surfaceOnSurface",
													},
												}}
												className="flex p-4 rounded-xl items-center justify-between"
											>
												<Container className="align-center justify-content-center">
													<UserAvatar
														profile_pic={m.profile?.profile_pic}
														username={m.username}
														size={20}
													/>
												</Container>
												<Text>
													<ImportantText>{m.username}</ImportantText>
												</Text>
												<Text>{m.address}</Text>
											</Container>
										</a>
									</Link>
								))}
						</Container>
					</div>

					<div className="mt-4 white-tp-container">
						<Heading
							size={"xs"}
							className="mb-3"
						>
							Approved ✅
						</Heading>
						<Container className="flex flex-col gap-1">
							{data &&
								data.acceptedModels.map((m) => (
									<Link
										key={m.username}
										href={`/backoffice/${m.username}`}
									>
										<a>
											<Container
												css={{
													"&:hover": {
														backgroundColor: "$surfaceOnSurface",
													},
												}}
												className="flex p-4 rounded-xl items-center justify-between"
											>
												<Container className="align-center justify-content-center">
													<UserAvatar
														profile_pic={m.profile?.profile_pic}
														username={m.username}
														size={20}
													/>
												</Container>
												<Text>
													<ImportantText>{m.username}</ImportantText>
												</Text>
												<Text>{m.address}</Text>
											</Container>
										</a>
									</Link>
								))}
						</Container>
					</div>
					<div className="mt-4 white-tp-container">
						<Heading
							size={"xs"}
							className="mb-3"
						>
							Rejected ❌
						</Heading>

						<Container className="flex flex-col gap-1">
							{data &&
								data.rejectedModels.map((m) => (
									<Link
										key={m.username}
										href={`/backoffice/${m.username}`}
									>
										<a>
											<Container
												css={{
													"&:hover": {
														backgroundColor: "$surfaceOnSurface",
													},
												}}
												className="flex p-4 rounded-xl items-center justify-between"
											>
												<Container className="align-center justify-content-center">
													<UserAvatar
														profile_pic={m.profile?.profile_pic}
														username={m.username}
														size={20}
													/>
												</Container>
												<Text>
													<ImportantText>{m.username}</ImportantText>
												</Text>
												<Text>{m.address}</Text>
											</Container>
										</a>
									</Link>
								))}
						</Container>
					</div>
				</div>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

export default AdminDashboardWrapper;
