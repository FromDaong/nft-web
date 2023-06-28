import BackofficeNavigation from "@components/BackofficeNavigation";
import Hero from "@components/Hero";
import {LogoutIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {useQuery} from "@tanstack/react-query";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import useSWR from "swr";
import {useAccount} from "wagmi";

const RejectedAdminDashboard = () => {
	const {isConnected} = useAccount();

	const fetcher = async () => {
		const res = await fetch("/api/admin/is-authed");
		const json = await res.json();
		return json;
	};

	const {data, isLoading, isError} = useQuery(["is-authed"], fetcher);
	if (isLoading) {
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
					Loading...
				</Heading>
			</div>
		);
	}
	if (!isConnected || isError || !data) {
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
						subtitle={`
							Manage creators and create new NFT collections as admin.
						`}
						additionalContent={
							<Container className="flex gap-4 flex-wrap">
								<Link href="/api/admin/logout">
									<a>
										<Button appearance={"danger"}>
											<LogoutIcon className="h-5 w-5" />
											Logout
										</Button>
									</a>
								</Link>
							</Container>
						}
					/>

					<BackofficeNavigation />

					<Container className="flex flex-col gap-4">
						<Container className="flex flex-col gap-4">
							<Heading
								size={"xss"}
								className="mb-3"
							>
								Rejected creators
							</Heading>
						</Container>
						<Container className="flex flex-col gap-1">
							{data &&
								data?.rejectedModels.map((m) => (
									<Link
										key={m.username}
										href={`/backoffice/profile/${m.username}`}
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
					</Container>
				</div>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

export default RejectedAdminDashboard;
