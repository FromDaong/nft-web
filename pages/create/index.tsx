import Tiptap from "@components/ui/tiptap";
import {Tag} from "@packages/post/BuyNFTPageViewNFT";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import {useUser} from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {Field, Form, Formik} from "formik";
import {ImageIcon, PlusIcon} from "lucide-react";
import {useRouter} from "next/router";
import {useState} from "react";
import * as Yup from "yup";

export default function Create() {
	const router = useRouter();
	const {profile, isLoading} = useUser();
	const [error, setError] = useState("");
	const initialValues = {
		name: "",
		description: "",
	};

	return (
		<ApplicationLayout>
			<SEOHead title="Create a new post" />
			<ApplicationFrame>
				<Container className="flex flex-col max-w-screen-lg w-full gap-8 py-12 mx-auto">
					<Container>
						<Heading size={"sm"}>Let's create something new</Heading>
						<Text>
							Create a collection where you can add your own NFTs and invite
							your friends to collaborate.
						</Text>
					</Container>
					<Container
						className="flex flex-col w-full gap-8 p-4 rounded lg:p-8"
						css={{
							background: "$surfaceOnSurface",
							borderRadius: "16px",
						}}
					>
						<Container
							css={{
								backgroundImage: `url("https://images.pexels.com/photos/14019500/pexels-photo-14019500.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load")`,
							}}
							className="w-full h-96 rounded-xl bg-cover bg-center flex items-end p-4"
						>
							<Button
								appearance={"action"}
								css={{borderRadius: "8px"}}
							>
								<ImageIcon className="w-5 h-5" />
								Change cover
							</Button>
						</Container>
						<Formik
							initialValues={initialValues}
							onSubmit={(values, actions) => {
								axios
									.post(`${apiEndpoint}/marketplace/collection/create`, values)
									.then((res) => {
										const {data} = res.data;
										if (data) {
											router.push(`/create/${data.id}`);
										}
									})
									.catch((err) => {
										actions.setSubmitting(false);
										setError(err.response.data.message);
									});
							}}
							validationSchema={Yup.object({
								name: Yup.string()
									.required("Required")
									.min(3, "Too short")
									.max(50, "Too long"),
								description: Yup.string(),
							})}
						>
							{(props) => (
								<Form className="flex flex-col gap-8">
									<Container className="flex flex-col gap-4">
										<Text>
											<ImportantText>Collection name</ImportantText>
										</Text>
										<Field name="name">
											{({field, meta}) => (
												<Container className="flex flex-col gap-2 max-w-xl">
													<Input
														type="text"
														{...field}
														appearance={"solid"}
													/>
													{meta.touched && meta.error && (
														<Text css={{color: "$red10"}}>
															<SmallText>{meta.error}</SmallText>
														</Text>
													)}
												</Container>
											)}
										</Field>
									</Container>

									<Container className="flex flex-col gap-4">
										<Text>
											<ImportantText>Description</ImportantText>
										</Text>
										<Field name="description">
											{({field, meta}) => (
												<Container className="flex flex-col gap-2 max-w-xl">
													<Tiptap
														onChange={(e) =>
															props.setFieldValue("description", e.target.value)
														}
														value={field.value}
													/>

													{meta.touched && meta.error && (
														<Text css={{color: "$red10"}}>
															<SmallText>{meta.error}</SmallText>
														</Text>
													)}
												</Container>
											)}
										</Field>
									</Container>

									<Container className="flex flex-col gap-4 w-fit">
										<Text>
											<ImportantText>Collaborators</ImportantText>
										</Text>
										{!isLoading && (
											<Container className="flex flex-row gap-2">
												<Container className="flex gap-4 max-w-xl">
													<Container className="flex gap-4">
														<UserAvatar
															profile_pic={profile.profile_pic}
															username={profile.username}
															size={32}
														/>
														<Container className="flex flex-col">
															<Heading size={"xss"}>{profile.username}</Heading>
															<Text>Creator</Text>
														</Container>
													</Container>
												</Container>
											</Container>
										)}
										<Container className="flex flex-row gap-2 items-center">
											<Button
												disabled
												appearance={"disabled"}
												className="cursor-not-allowed"
											>
												<PlusIcon className="w-5 h-5" />
												Invite collaborators
											</Button>
											<Tag>Coming soon</Tag>
										</Container>
									</Container>

									<Container className="flex flex-col gap-2 w-fit">
										<Button
											disabled={props.isSubmitting}
											appearance={props.isSubmitting ? "disabled" : "default"}
											type="submit"
										>
											{props.isSubmitting ? "Submitting..." : "Continue"}
										</Button>
										{error && <Text css={{color: "$red11"}}>{error}</Text>}
									</Container>
								</Form>
							)}
						</Formik>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
