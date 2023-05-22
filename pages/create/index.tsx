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
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {Field, Form, Formik} from "formik";
import {useRouter} from "next/router";
import {useState} from "react";
import * as Yup from "yup";

export default function Create() {
	const router = useRouter();
	const [error, setError] = useState("");
	const initialValues = {
		name: "",
	};

	return (
		<ApplicationLayout>
			<SEOHead title="Create a new post" />
			<ApplicationFrame>
				<Container className="flex flex-col items-center gap-8 py-12">
					<Container
						className="flex flex-col max-w-xl gap-8 p-4 border rounded lg:p-8"
						css={{
							background: "$surfaceOnSurface",
							borderRadius: "16px",
							borderColor: "$border",
						}}
					>
						<Container className="flex flex-col gap-2 w-[420px]">
							<Heading size="xs">Create a new collection</Heading>
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
							})}
						>
							{(props) => (
								<Form className="flex flex-col gap-8">
									<Container className="flex flex-col gap-2">
										<Text>
											<ImportantText>Name</ImportantText>
										</Text>
										<Field name="name">
											{({field, meta}) => (
												<Container className="flex flex-col gap-2">
													<Input
														type="text"
														{...field}
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

									<Container className="flex flex-col gap-2">
										<Button
											disabled={props.isSubmitting}
											appearance={props.isSubmitting ? "disabled" : "action"}
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
