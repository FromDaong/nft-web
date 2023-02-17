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
						className="flex flex-col max-w-xl gap-8 p-4 border rounded shadow lg:p-8"
						css={{background: "$elementSurface", borderRadius: "16px"}}
					>
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Create new NFTs</Heading>
							<Text>
								Deploy a standard NFT contract that you can mint to at anytime.
								The following details are used to create your own smart
								contract.{" "}
							</Text>
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
											<ImportantText>Collection name</ImportantText>
										</Text>
										<Field name="name">
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

									<Container className="flex flex-col gap-2">
										<Button
											disabled={props.isSubmitting}
											appearance={props.isSubmitting ? "subtle" : "primary"}
											type="submit"
										>
											{props.isSubmitting ? "Submitting..." : "Continue"}
										</Button>
										{error && (
											<Text appearance={"danger"}>
												<SmallText>{error}</SmallText>
											</Text>
										)}
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
