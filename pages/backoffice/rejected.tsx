import BackofficeNavigation from "@components/BackofficeNavigation";
import Hero from "@components/Hero";
import {CloudDownloadIcon, LogoutIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {useQuery} from "@tanstack/react-query";
import formatAddress from "@utils/formatAddress";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {ArrowLeft} from "lucide-react";

import Link from "next/link";
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
		[`/api/admin/get-rejected`],
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
							{!isLoading && !isError && data?.rejectedModels.length === 0 && (
								<Container className="flex justify-center py-32">
									<Container className="flex items-center flex-col gap-8 text-center">
										<Container>
											<Heading size={"sm"}>No rejected creators</Heading>
											<Text>There are no rejected creators at the moment.</Text>
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
												An error occurred while fetching rejected creators.
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
											<Text>Please wait while we fetch rejected creators.</Text>
										</Container>
										<Spinner />
									</Container>
								</Container>
							)}
							<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
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
														borderColor: "$subtleBorder",
													}}
													className="flex items-start gap-4 border shadow-sm p-4 rounded-xl col-span-1"
												>
													<Container>
														<UserAvatar
															profile_pic={m.profile?.profile_pic}
															username={m.username}
															size={64}
														/>
													</Container>
													<Container className="flex flex-col gap-4">
														<Heading size={"xss"}>
															{m.profile.display_name}
														</Heading>
														<Container className="flex flex-col gap-2">
															<Container className="flex gap-2">
																<Text>@{m.username}</Text>
																<Text>&bull;</Text>
																<Text>{formatAddress(m.address)}</Text>
															</Container>
															<Text className="line-clamp-2">
																{m.profile.bio}
															</Text>
														</Container>
													</Container>
												</Container>
											</a>
										</Link>
									))}
							</Container>
						</Container>
					</Container>
				</div>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

export default RejectedAdminDashboard;
