import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/outline";
import {useContracts} from "@packages/post/hooks";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input, Textarea} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import DynamicSkeleton from "@packages/skeleton";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import dynamic from "next/dynamic";
import {Suspense, useCallback, useEffect, useState} from "react";
import {useAccount, useBalance, useWaitForTransaction} from "wagmi";
import Web3 from "web3";
import * as Yup from "yup";

const VerifyButton = dynamic(() => import("@passbase/button/react"), {
	ssr: false,
});

export default function Upgrade() {
	const {address} = useAccount();
	const [identity_acess_key, setIdentityAccessKey] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		subscription_price: 0.001,
		subscription_description: "",
	});
	const [stage, setStage] = useState<
		"form" | "passbase" | "submitting" | "success" | "error"
	>("form");

	const upgradeForm = useFormik({
		initialValues: {
			email: "",
			subscription_price: 0.0,
			subscription_description: "",
		},
		onSubmit: (values, formikHelpers) => {
			// T-64 Post to DB and toggle profile status from "general" to "pending"
			formikHelpers.setSubmitting(true);
			setFormData({
				...values,
			});
			setStage("passbase");
			formikHelpers.setSubmitting(false);
		},
		validationSchema: Yup.object({
			email: Yup.string().email("Invalid email address").required("Required"),
			subscription_price: Yup.number().required("Required"),
			subscription_description: Yup.string().required("Required"),
		}),
	});

	const handleVerificationFinish = (identityAccessKey) => {
		// Post to DB and toggle profile status from "general" to "pending"
		setIdentityAccessKey(identityAccessKey);
	};

	useEffect(() => {
		if (identity_acess_key) {
			setStage("submitting");
			upgradeToCreator();
		}
	}, [identity_acess_key]);

	const upgradeToCreator = () => {
		// T-64 Post to DB and toggle profile status from "general" to "pending"
		setStage("submitting");
		axios
			.post(`${apiEndpoint}/creator/create`, {
				...formData,
				identity_access_key: identity_acess_key,
			})
			.then(() => setStage("success"))
			.catch(() => setStage("error"));
	};

	return (
		<ApplicationLayout>
			<SEOHead title="Become a Creator" />
			<ApplicationFrame>
				<Container className="flex flex-col gap-12 py-12 max-w-xl mx-auto">
					<Container
						className="flex flex-col gap-8 p-8 shadow"
						css={{borderRadius: "16px"}}
					>
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Upgrade to a creator profile</Heading>
							<Text>
								<MutedText>
									Securely verify your identity to upgrade to a creator profile.
									A creator profile allows you to create subscriptions and
									trits.
								</MutedText>
							</Text>
						</Container>
						<Container>
							{stage === "form" && (
								<form
									onSubmit={upgradeForm.handleSubmit}
									className="flex flex-col gap-4"
								>
									<Container className="flex flex-col gap-1">
										<label htmlFor="name">
											<Text>
												<ImportantText>Email address</ImportantText>
											</Text>
										</label>
										<Input
											type="email"
											name="email"
											value={upgradeForm.values.email}
											onChange={upgradeForm.handleChange}
											onBlur={upgradeForm.handleBlur}
										/>
									</Container>
									<Container className="flex flex-col gap-1">
										<label htmlFor="subscription_price">
											<Text>
												<ImportantText>Subscription price</ImportantText>
											</Text>
										</label>
										<Input
											type="number"
											name="subscription_price"
											value={upgradeForm.values.subscription_price}
											onChange={upgradeForm.handleChange}
											onBlur={upgradeForm.handleBlur}
											step="0.001"
											min="0.0001"
										/>
									</Container>
									<Container className="flex flex-col gap-1">
										<label htmlFor="subscription_description">
											<Text>
												<ImportantText>Subscription description</ImportantText>
											</Text>
										</label>
										<Textarea
											name="subscription_description"
											value={upgradeForm.values.subscription_description}
											onChange={upgradeForm.handleChange}
											onBlur={upgradeForm.handleBlur}
										/>
									</Container>
									<Button
										className="mt-4"
										appearance={
											upgradeForm.isSubmitting ||
											!upgradeForm.isValid ||
											!upgradeForm.dirty
												? "disabled"
												: "primary"
										}
										type="submit"
									>
										{
											<>
												{upgradeForm.isSubmitting ? (
													<Spinner />
												) : (
													"Verify identity"
												)}
											</>
										}
									</Button>
								</form>
							)}
							{stage === "passbase" && (
								<VerifyIdentity
									subscription_price={formData.subscription_price}
									address={address}
									callback={handleVerificationFinish}
								/>
							)}

							{stage === "submitting" && (
								<Container className="flex flex-col gap-4 items-center">
									<Spinner />
									<Text>
										<ImportantText>
											Please wait. Submitting your creator application.
										</ImportantText>
									</Text>
								</Container>
							)}

							{stage === "success" && (
								<Container className="flex flex-col gap-4 items-center">
									<Text css={{color: "$teal9"}}>
										<CheckCircleIcon
											width={40}
											height={40}
										/>
									</Text>
									<Container className="flex flex-col w-full gap-2 items-center text-center">
										<Text>
											<ImportantText>
												Your creator application has been submitted.
											</ImportantText>
										</Text>
										<Text>
											We will notify you as soon as your creator profile has
											been approved
										</Text>
									</Container>
									<Button appearance={"surface"}>Go to your profile</Button>
								</Container>
							)}

							{stage === "error" && (
								<Container className="flex flex-col gap-4 items-center">
									<Text appearance={"danger"}>
										<XCircleIcon
											width={40}
											height={40}
										/>
									</Text>
									<Text>
										<ImportantText>
											An error occurred while submitting your creator
											application.
										</ImportantText>
									</Text>
									<Button onClick={upgradeToCreator}>Try again</Button>
								</Container>
							)}
						</Container>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const VerifyIdentity = (props: {
	subscription_price: number;
	address: string;
	callback: (returned) => void;
}) => {
	const [stage, setStage] = useState<
		| "creating_subscription"
		| "verify_identity"
		| "initializing"
		| "insufficient_balance"
		| "error"
	>("initializing");
	const {treatSubscriptionsContract, signer} = useContracts();
	// wait for transaction by hash
	const [txHash, setTxHash] = useState<string>("");
	const {isSuccess, isError} = useWaitForTransaction({
		hash: txHash,
	});
	const {data} = useBalance({
		addressOrName: props.address,
	});

	const setSubscriptionCost = useCallback(
		async (subscription_price: number) => {
			if (signer) {
				try {
					const tx = await treatSubscriptionsContract.setSubscriptionCost(
						Web3.utils.toWei(subscription_price.toString()),
						{
							from: props.address,
							value: 0,
						}
					);
					setTxHash(tx.hash);
				} catch (err) {
					setStage("error");
				}
			}
		},
		[signer, treatSubscriptionsContract, props.address]
	);

	useEffect(() => {
		if (signer && data) {
			if (Number(data.formatted.toString()) < 0.0005) {
				setStage("insufficient_balance");
			} else {
				setStage("creating_subscription");
			}
		}
	}, [signer, data]);

	useEffect(() => {
		// Create subscription on chain and toggle to verify_identity
		if (stage === "creating_subscription" && signer) {
			setSubscriptionCost(props.subscription_price);
		}
	}, [signer, stage]);

	useEffect(() => {
		if (isSuccess) {
			setStage("verify_identity");
		}
	}, [isSuccess, isError]);

	return (
		<Container>
			{stage === "initializing" && (
				<Container className="flex flex-col gap-2 items-center w-full">
					<Spinner />
					<Text>
						<ImportantText>Please wait, initializing...</ImportantText>
					</Text>
				</Container>
			)}
			{stage === "insufficient_balance" && (
				<Container className="flex flex-col gap-2 items-center w-full">
					<Text appearance={"danger"}>
						<XCircleIcon
							width={40}
							height={40}
						/>
					</Text>
					<Text>
						<ImportantText>
							Insufficient balance to create subscription.
						</ImportantText>
					</Text>
				</Container>
			)}

			{stage === "error" && (
				<Container className="flex flex-col gap-2 items-center w-full">
					<Text appearance={"danger"}>
						<XCircleIcon
							width={40}
							height={40}
						/>
					</Text>
					<Text>
						<ImportantText>
							An error occurred while creating subscription.
						</ImportantText>
					</Text>
				</Container>
			)}
			{stage === "creating_subscription" && (
				<Container className="flex w-full">
					{!isError && !isSuccess && (
						<Container className="flex flex-col gap-2 items-center w-full">
							<Spinner />
							<Text>
								<ImportantText>
									Please wait, creating subscription...
								</ImportantText>
							</Text>
						</Container>
					)}
					{isError && (
						<Container className="flex flex-col gap-2 items-center w-full">
							<Text appearance={"danger"}>
								<ImportantText>
									Something went wrong creating subscription
								</ImportantText>
							</Text>
							<Button
								onClick={() => setSubscriptionCost(props.subscription_price)}
							>
								Try again
							</Button>
						</Container>
					)}
				</Container>
			)}
			{stage === "verify_identity" && (
				<Container className="w-full flex flex-col gap-2">
					<Text>
						<ImportantText>
							Securely verify your identity with Passbase
						</ImportantText>
					</Text>
					<Suspense
						fallback={
							<DynamicSkeleton
								config={[
									{
										type: "row",
										height: 3,
										repeat: 1,
										columns: [
											{
												length: 1,
												start: 1,
												radius: 8,
											},
										],
									},
								]}
							/>
						}
					>
						<VerifyButton
							apiKey="DsPgHGsJXFzqRNFtSAL6aUkSaSYCWVHtwGKTqII6aiWma9GgMogUsxoTAFzoObi5"
							onStart={() => null}
							onError={() => null}
							onFinish={props.callback}
						/>
					</Suspense>
				</Container>
			)}
		</Container>
	);
};
