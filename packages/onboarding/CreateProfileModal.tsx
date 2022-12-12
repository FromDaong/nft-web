import {Modal} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input, Textarea} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {Field, Form, Formik, FormikProps} from "formik";
import {useRouter} from "next/router";
import * as Yup from "yup";

export default function CreateProfileModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => any;
}) {
	const router = useRouter();
	const initialValues = {
		username: "",
		displayName: "",
		bio: "",
	};
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex flex-col gap-8">
				<Container className="relative flex flex-col gap-1">
					<Heading size="sm">Get started</Heading>
					<Text>
						Welcome to the spicy content platform, let's start by creating your
						profile
					</Text>
				</Container>
				<Formik
					initialValues={initialValues}
					onSubmit={(values, actions) => {
						axios
							.post(`${apiEndpoint}/profile/create`, values)
							.then((res) => {
								const {data} = res.data;
								if (data) {
									router.reload();
								}
							})
							.catch((err) => {
								actions.setSubmitting(false);
								actions.setErrors(err.response.data.message);
							});
					}}
					validationSchema={Yup.object().shape({
						username: Yup.string()
							.min(3, "Username must be at least 3 characters")
							.max(12, "Username must be at most 20 characters")
							.required("Username is required")
							.test(
								"is-unique",
								"Username is already taken. Please try again",
								function (value) {
									return new Promise((resolve) => {
										axios
											.get(`${apiEndpoint}/people/user?username=${value}`)
											.then((res) => {
												if (res.data.data.profile) {
													resolve(false);
												} else {
													resolve(true);
												}
											})
											.catch(() => {
												resolve(false);
											});
									});
								}
							),
						displayName: Yup.string()
							.min(3, "Display name must be at least 3 characters")
							.max(20, "Display name must be at most 20 characters")
							.required("Display name is required"),
						bio: Yup.string()
							.min(3, "Bio must be at least 3 characters")
							.max(100, "Bio must be at most 100 characters")
							.required("Bio is required"),
					})}
				>
					{(props: FormikProps<any>) => (
						<Form>
							<Container className="flex flex-col gap-4">
								<Container className="flex flex-col gap-2">
									<Text>
										<ImportantText>Username</ImportantText>
									</Text>
									<Field name="username">
										{({field, meta}) => (
											<Container className="flex flex-col gap-2">
												<Input
													type="text"
													{...field}
												/>
												{meta.touched && meta.error && (
													<Text appearance={"danger"}>
														<SmallText>{meta.error}</SmallText>
													</Text>
												)}
											</Container>
										)}
									</Field>
								</Container>
								<Container className="gap-1 flex flex-col">
									<Text>
										<ImportantText>Display name</ImportantText>
									</Text>
									<Field name="displayName">
										{({field, meta}) => (
											<Container className="flex flex-col gap-2">
												<Input
													type="text"
													{...field}
												/>
												{meta.touched && meta.error && (
													<Text appearance={"danger"}>
														<SmallText>{meta.error}</SmallText>
													</Text>
												)}
											</Container>
										)}
									</Field>
								</Container>
								<Container className="gap-1 flex flex-col">
									<Text>
										<ImportantText>Bio</ImportantText>
									</Text>
									<Field name="bio">
										{({field, meta}) => (
											<Container className="flex flex-col gap-2">
												<Textarea
													type="text"
													{...field}
												/>
												{meta.touched && meta.error && (
													<Text appearance={"danger"}>
														<SmallText>{meta.error}</SmallText>
													</Text>
												)}
											</Container>
										)}
									</Field>
								</Container>
							</Container>
							<Container className="flex justify-end mt-4">
								<Button
									disabled={props.isSubmitting}
									appearance={props.isSubmitting ? "subtle" : "primary"}
									type="submit"
								>
									{props.isSubmitting ? "Submitting..." : "Create my profile"}
								</Button>
							</Container>
						</Form>
					)}
				</Formik>
			</Container>
		</Modal>
	);
}
