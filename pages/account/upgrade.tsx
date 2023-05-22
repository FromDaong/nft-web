import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/outline";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input, Textarea} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import DynamicSkeleton from "@packages/skeleton";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {useUser} from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import dynamic from "next/dynamic";
import Link from "next/link";
import {Suspense, useEffect, useState} from "react";
import {useAccount} from "wagmi";
import * as Yup from "yup";

const VerifyButton = dynamic(() => import("@passbase/button/react"), {
	ssr: false,
});

export default function Upgrade() {
	const {address} = useAccount();
	const {profile} = useUser();
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
			subscription_price: Yup.number(),
			subscription_description: Yup.string(),
		}),
	});

	const handleVerificationFinish = (identityAccessKey) => {
		// Post to DB and toggle profile status from "general" to "pending"
		if (!identityAccessKey) {
			setStage("error");
		}
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
				<Container className="flex flex-col max-w-xl gap-12 py-12 mx-auto">
					<Container
						className="flex flex-col gap-8 p-8 border shadow-sm"
						css={{
							borderRadius: "16px",
							backgroundColor: "$surfaceOnSurface",
							borderColor: "$border",
						}}
					>
						{stage !== "success" && stage !== "error" && (
							<Container className="flex flex-col gap-2">
								<Heading size="sm">Upgrade to a creator profile</Heading>
								<Text>
									<MutedText>
										Securely verify your identity to upgrade to a creator
										profile. A creator profile allows you to create
										subscriptions and nfts.
									</MutedText>
								</Text>
							</Container>
						)}
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
									{false && (
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
											/>
											{upgradeForm.errors.subscription_price && (
												<Text appearance={"danger"}>
													<SmallText>
														{upgradeForm.errors.subscription_price}
													</SmallText>
												</Text>
											)}
											<Text>
												<MutedText>
													Price is in BNB and charged monthly
												</MutedText>
											</Text>
										</Container>
									)}
									{false && (
										<Container className="flex flex-col gap-1">
											<label htmlFor="subscription_description">
												<Text>
													<ImportantText>
														Subscription description
													</ImportantText>
												</Text>
											</label>
											<Textarea
												name="subscription_description"
												value={upgradeForm.values.subscription_description}
												onChange={upgradeForm.handleChange}
												onBlur={upgradeForm.handleBlur}
											/>
										</Container>
									)}
									<Container className="flex items-center gap-4">
										<input
											id="tos"
											type="checkbox"
											required
										/>
										<label htmlFor="tos">
											<Text>
												Accept our Terms of Service.{" "}
												<ImportantText css={{color: "$accentText"}}>
													<Link href={"/tos"}>
														<a>You can read them here</a>
													</Link>
												</ImportantText>
											</Text>
										</label>
									</Container>
									<Button
										className="mt-4"
										appearance={
											upgradeForm.isSubmitting ||
											!upgradeForm.isValid ||
											!upgradeForm.dirty
												? "disabled"
												: "action"
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
								<Container className="flex flex-col items-center gap-4">
									<Spinner />
									<Text>
										<ImportantText>
											Please wait. Submitting your creator application.
										</ImportantText>
									</Text>
								</Container>
							)}

							{stage === "success" && (
								<Container className="flex flex-col items-center gap-4">
									<Text css={{color: "$teal9"}}>
										<CheckCircleIcon
											width={40}
											height={40}
										/>
									</Text>
									<Container className="flex flex-col items-center w-full gap-2 text-center">
										<Text>
											<ImportantText>
												Congratulations. You are now a creator
											</ImportantText>
										</Text>
										<Text>
											Welcome to the TreatDAO creator community. To celebrate
											this, you can start by creating a new NFT.
										</Text>
									</Container>
									<a href={`/create`}>
										<Button appearance={"surface"}>Create NFT</Button>
									</a>
								</Container>
							)}

							{stage === "error" && (
								<Container className="flex flex-col items-center gap-4">
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
	const [stage] = useState<
		| "creating_subscription"
		| "verify_identity"
		| "initializing"
		| "insufficient_balance"
		| "error"
	>("verify_identity");

	return (
		<Container>
			{stage === "verify_identity" && (
				<Container className="flex flex-col w-full gap-2">
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
