import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Link from "next/link";
import useSWR from "swr";
import {useState} from "react";
import {useAccount} from "wagmi";
import {Spinner} from "react-bootstrap";
import {Button} from "@packages/shared/components/Button";
import useAddPerformerToMinter from "@packages/chain/hooks/useAddPerformerToMinter";
import useRemovePerformerFromMinter from "@packages/chain/hooks/useRemovePerformerFromMinter";
import useAddReferrerToMinter from "@packages/chain/hooks/useAddReferrerToMinter";
import useGetReferrer from "@packages/chain/hooks/useGetReferrer";
import {BlankModal} from "@components/lankModal";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";

const AdminDashboardWrapper = ({username}) => {
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
				<h5
					style={{
						fontWeight: "bolder",
						background: "white",
						borderRadius: 5,
						padding: 10,
					}}
				>
					Please make sure your wallet on the Binance Smart Chain is connected.
				</h5>
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
							<Button>
								<b>{"Login to Panel"}</b>
							</Button>
						</Link>
					}
				/>
			);
		return <AdminDashboard username={username} />;
	}
};

const AdminDashboard = ({username}) => {
	const {data} = useSWR(`/api/admin/get-info/${username}`);
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

	if (!data)
		return (
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
				<BlankModal
					show={!!showPendingModal}
					handleClose={() => setShowPendingModal(false)}
					title={"Confirming Transaction ⌛ - Don't close this browser window"}
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

				<div className="container my-nft-container">
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

					<div className="mt-2 white-tp-container pb-3">
						<div className="row">
							<h5 className="col-md-6 pb-3">
								<b>Username:</b>
								<br />
								{data.username}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Bio:</b>
								<br />
								{data.profile.bio}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Address:</b>
								<br />
								{data.address}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Submitted at:</b>
								<br />
								{new Date(data.createdAt).toLocaleString()}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Social Profile:</b>
								<br />
								<a href={data.social_account}>{data.social_account}</a>
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Email:</b>
								<br />
								{data.email}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Passbase status:</b>
								<br />
								{!data.identity && "NOT PASSBASE VERIFIED"}
								<br />
								{data.identity_access_key}
								{data.identity && (
									<>
										{data.identity.status && `Status: ${data.identity.status}`}
										<br />
										{data.identity.score &&
											`Passbase Score: ${data.identity.score}`}
										<br />
										{data.identity.owner.firstName &&
											`Name: ${data.identity.owner.firstName} ${data.identity.owner.lastName}`}
									</>
								)}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Pending Treat Admin review:</b>
								<br />
								{data.pending.toString()}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Rejected:</b>
								<br />
								{data.rejected?.toString()}
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Referrer:</b>
								<br />
								{data.referrer_address}
								<br />
								<Button
									onClick={() => addReferrerToMinter()}
									disabled={!!referrerFromContract}
								>
									<b>APPROVE REFERRER</b>
								</Button>
							</h5>
							<h5 className="col-md-6 pb-3">
								<b>Profile Pic:</b>
								<br />
								<img
									src={data.profile.profile_pic}
									style={{width: 350, marginTop: 5}}
									className="rounded"
								/>
							</h5>
						</div>

						<div className="buttons row py-2">
							<div className="col-md-4 mt-2 text-center">
								<Button
									appearance={"success"}
									onClick={() => addPerformerToMinter()}
								>
									<b>APPROVE</b>
								</Button>
							</div>
							<div className="col-md-4  mt-2 text-center">
								<Button
									appearance={"danger"}
									onClick={() => removePerformerRole()}
								>
									<b>REMOVE PERFORMER ROLE</b>
								</Button>
							</div>
							<div className="col-md-4  mt-2 text-center">
								<Button
									appearance={"danger"}
									onClick={() => reject()}
								>
									<b>REJECT</b>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

AdminDashboardWrapper.getInitialProps = async ({query: {username}}) => {
	return {username};
};

export default AdminDashboardWrapper;
