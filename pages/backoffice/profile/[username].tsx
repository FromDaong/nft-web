import Hero from "@components/Hero";
import Link from "next/link";
import {useState} from "react";
import {Button} from "@packages/shared/components/Button";
import useAddPerformerToMinter from "@packages/chain/hooks/useAddPerformerToMinter";
import useRemovePerformerFromMinter from "@packages/chain/hooks/useRemovePerformerFromMinter";
import useAddReferrerToMinter from "@packages/chain/hooks/useAddReferrerToMinter";
import useGetReferrer from "@packages/chain/hooks/useGetReferrer";
import {BlankModal} from "@components/lankModal";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import AdminDashboardWrapper from "@components/BackofficeNavigation/BackofficeWrapper";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {useRouter} from "next/router";
import {AlertTriangle, AtSign, CircleSlash, Verified} from "lucide-react";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {CalendarIcon, FingerPrintIcon} from "@heroicons/react/outline";
import {Divider} from "@packages/shared/components/Divider";
import {Tag} from "@packages/post/BuyNFTPageViewNFT";

const AdminDashboard = () => {
	const router = useRouter();
	const {username} = router.query;
	const {data, isLoading} = TreatCore.useQuery(
		[`admin-${username}`],
		async () => {
			const res = await axios.get(`/api/admin/get-info/${username}`);
			const json = await res.data;
			return json;
		}
	);
	const [showPendingModal, setShowPendingModal] = useState(null);
	const [showCompleteModal, setShowCompleteModal] = useState(null);
	const {onAddPerformerToMinter} = useAddPerformerToMinter(
		data && data.address
	);
	const {onRemovePerformerFromMinter} = useRemovePerformerFromMinter(
		data && data.address
	);
	const {onAddReferrerToMinter} = useAddReferrerToMinter(
		data && data.address,
		data && data.referrer_address
	);
	const referrerFromContract = useGetReferrer(data && data.address);

	if (isLoading || !data)
		return (
			<ApplicationLayout>
				<ApplicationFrame>
					<Hero
						title={`Loading: ${username}'s application...`}
						additionalContent={
							<Link href="/admin-dashboard">
								<Button>
									<b>{"Back to admin panel"}</b>
								</Button>
							</Link>
						}
						titleClass={""}
					/>
				</ApplicationFrame>
			</ApplicationLayout>
		);

	const addReferrerToMinter = async () => {
		setShowPendingModal(true);
		const referrer = await onAddReferrerToMinter();
		if (referrer) {
			setShowCompleteModal(true);
		}
		setShowPendingModal(false);
	};

	const addPerformerToMinter = async () => {
		setShowPendingModal(true);
		const performer = await onAddPerformerToMinter();
		if (performer) {
			await fetch(`/api/admin/${username}/approve`);
			setShowCompleteModal(true);
		}
		setShowPendingModal(false);
	};

	const removePerformerRole = async () => {
		setShowPendingModal(true);
		const performer = await onRemovePerformerFromMinter();
		setShowPendingModal(false);
		if (performer) setShowCompleteModal(true);
	};

	const reject = async () => {
		const res = await fetch(`/api/admin/${username}/reject`);
		if (res) setShowCompleteModal(true);
	};

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<>
					<AdminDashboardWrapper>
						<BlankModal
							show={!!showPendingModal}
							handleClose={() => setShowPendingModal(false)}
							title={
								"Confirming Transaction ⌛ - Don't close this browser window"
							}
							subtitle={
								"Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm. Do not close this browser window!"
							}
							noButton={true}
						/>
						<BlankModal
							show={!!showCompleteModal}
							handleClose={() => setShowCompleteModal(false)}
							title="Success!"
							subtitle="The transaction has been confirmed!"
						/>

						<div className="flex flex-col gap-12">
							<Hero
								title={`Reviewing: ${username}'s application`}
								subtitle={`Be super careful when approving and rejecting creators`}
								additionalContent={
									<Link href="/backoffice">
										<Button>
											<b>{"Back to admin panel"}</b>
										</Button>
									</Link>
								}
								titleClass={""}
							/>

							<Container className="flex gap-8">
								<img
									src={data.profile.profile_pic}
									className="rounded-xl h-48 aspect-square object-cover object-top"
								/>
								<Container className="flex flex-col gap-4">
									<Container className="flex gap-2 items-center">
										<Heading size={"xss"}>{data.profile.display_name}</Heading>{" "}
										<Text>@{data.username}</Text>
									</Container>

									<Container className="flex flex-col gap-2">
										<Container className="flex items-center gap-2">
											<Text>
												<AtSign className="h-5 w-5" />
											</Text>
											<Text>
												<ImportantText>{data.profile.email}</ImportantText>
											</Text>
										</Container>
										<Container className="flex items-center gap-2">
											<Text>
												<FingerPrintIcon className="h-5 w-5" />
											</Text>
											<Text>
												<ImportantText>{data.address}</ImportantText>
											</Text>
										</Container>
										<Container className="flex items-center gap-2">
											<Text>
												<CalendarIcon className="h-5 w-5" />
											</Text>
											<Text>
												<ImportantText>
													{new Date(data.createdAt).toLocaleString()}
												</ImportantText>
											</Text>
										</Container>
									</Container>
								</Container>
							</Container>
							<Container>
								<Heading size={"xss"}>Bio</Heading>
								<Text>{data.profile.bio}</Text>
							</Container>
							<Divider />
							<Container className="flex gap-12">
								<Container className="flex flex-col gap-2">
									<Heading size={"xss"}>Pending review</Heading>
									{data.pending ? (
										<Button
											size={"sm"}
											appearance={"subtle"}
											outlined
										>
											PENDING
										</Button>
									) : (
										<Button
											appearance={"success"}
											size={"sm"}
										>
											APPROVED
										</Button>
									)}
								</Container>
								<Container className="flex flex-col gap-2">
									<Heading size={"xss"}>Rejected</Heading>
									{data.rejected ? (
										<Button
											appearance={"danger"}
											size={"sm"}
										>
											YES
										</Button>
									) : (
										<Button
											size={"sm"}
											appearance={"subtle"}
											outlined
										>
											FALSE
										</Button>
									)}
								</Container>
							</Container>
							<Container className="flex flex-col gap-4">
								<Heading size={"xss"}>Manage creator application</Heading>
								<Container className="flex gap-4">
									<div className="col-md-4 mt-2 text-center">
										<Button
											appearance={"success"}
											onClick={() => addPerformerToMinter()}
										>
											<Verified className="h-5 w-5" />
											Approve application
										</Button>
									</div>

									<div className="col-md-4  mt-2 text-center">
										<Button
											appearance={"danger"}
											onClick={() => reject()}
										>
											<CircleSlash className="h-5 w-5" />
											Reject application
										</Button>
									</div>
								</Container>
							</Container>
							<Divider />

							<Container className="flex flex-col gap-4">
								<Heading size={"xss"}>Enforcement actions</Heading>
								<Container>
									<div className="col-md-4 text-center">
										<Button
											appearance={"danger"}
											onClick={() => removePerformerRole()}
										>
											<AlertTriangle className="h-5 w-5" />
											Ban minting
										</Button>
									</div>
								</Container>
							</Container>
						</div>
					</AdminDashboardWrapper>
				</>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

export default AdminDashboard;
