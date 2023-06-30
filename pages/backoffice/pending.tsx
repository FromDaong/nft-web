import BackofficeNavigation from "@components/BackofficeNavigation";
import Hero from "@components/Hero";
import {CloudDownloadIcon, LogoutIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {ArrowLeft} from "lucide-react";

import Link from "next/link";
import useSWR from "swr";
import {useAccount} from "wagmi";

const PendingAdminDashboard = () => {
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
				<Spinner />
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
	const {data, isLoading, isError, refetch} = TreatCore.useQuery(
		[`/api/admin/get-pending`],
		async () => {
			const res = await axios.get(`/api/admin/get-pending`);
			return res.data;
		}
	);

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<div className="py-8 flex flex-col gap-8">
					<Hero
						title={"Admin Dashboard"}
						subtitle={`
							Manage creators and create new NFT collections as admin.
						`}
					/>

					<BackofficeNavigation />

					<Container className="flex flex-col gap-4">
						<Container className="flex flex-col gap-1">
							{!isLoading && !isError && data?.pendingModels.length === 0 && (
								<Container className="flex justify-center py-32">
									<Container className="flex items-center flex-col gap-8 text-center">
										<Container>
											<Heading size={"sm"}>No pending creators</Heading>
											<Text>There are no pending creators at the moment.</Text>
										</Container>
										<Link href={"/backoffice"}>
											<a>
												<Button appearance={"action"}>
													<ArrowLeft className="w-4 h-4" />
													Back to dashboard
												</Button>
											</a>
										</Link>
									</Container>
								</Container>
							)}
							{isError && (
								<Container className="flex justify-center py-32">
									<Container className="flex items-center flex-col gap-8 text-center">
										<Container>
											<Heading size={"sm"}>An error occurred</Heading>
											<Text>
												An error occurred while fetching pending creators.
											</Text>
										</Container>
										<Button
											onClick={() => refetch()}
											appearance={"action"}
										>
											<CloudDownloadIcon className="w-4 h-4" />
											Try again
										</Button>
									</Container>
								</Container>
							)}
							{isLoading && (
								<Container className="flex justify-center py-32">
									<Container className="flex items-center flex-col gap-8 text-center">
										<Container>
											<Heading size={"sm"}>Please wait</Heading>
											<Text>Please wait while we fetch pending creators.</Text>
										</Container>
										<Spinner />
									</Container>
								</Container>
							)}
							{data &&
								data?.pendingModels.map((m) => (
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

export default PendingAdminDashboard;
