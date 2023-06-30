import * as Yup from "yup";

import {Form} from "react-bootstrap";

import Hero from "@components/Hero";
import Link from "next/link";
import {useFormik} from "formik";
import {useRouter} from "next/router";
import {useState} from "react";
import {Button} from "@packages/shared/components/Button";
import {Input} from "@packages/shared/components/Input";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {Container} from "@packages/shared/components/Container";
import {toast} from "sonner";
import Spinner from "@packages/shared/icons/Spinner";

const CreateNFT = () => {
	const router = useRouter();
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			external_url: "https://treatdao.com/",
			master_password: "",
			code: "",
		},
		validateOnChange: false,
		validateOnBlur: false,
		validationSchema: Yup.object().shape({
			master_password: Yup.string().required("Please add the master password"),
		}),
		onSubmit: (values) => {
			setLoading(true);
			SubmitToServer();
		},
	});

	const SubmitToServer = async () => {
		try {
			const res = await fetch(`/api/admin/login`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formik.values),
			});
			const resJSON = await res.json();

			if (resJSON.error && resJSON.error.errors) {
				console.error(resJSON.error);
				const ogErrors = Object.assign({}, resJSON.error.errors);
				Object.keys(ogErrors).map((e) => {
					ogErrors[e] = resJSON.error.errors[e].message;
				});
				formik.setErrors(ogErrors);
				formik.setSubmitting(false);
				setLoading(false);
			} else if (resJSON.error && !resJSON.error.errors) {
				toast.error(resJSON.error);
				setLoading(false);
			}

			if (resJSON.success) {
				setSuccess(true);
				router.push("/backoffice");
			}
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	if (success) return <div></div>;

	return (
		<ApplicationLayout>
			<Container className="flex flex-col items-center justify-center py-8">
				<Container
					css={{backgroundColor: "$surfaceOnSurface"}}
					className="p-12 rounded-xl shadow-xl"
				>
					{success && (
						<Hero
							title={"Successfully authenticated"}
							subtitle={"Welcome back, Sir / Madame."}
							additionalContent={
								<Link href="/backoffice">
									<Button className="bg-primary text-white font-bold">
										<b>{"Back to admin panel"}</b>
									</Button>
								</Link>
							}
						/>
					)}
					{!success && (
						<>
							<Hero
								title={"Login to Admin Dashboard"}
								subtitle={"For use for limited number of individuals"}
							/>
							<div
								className="container mt-5 pb-5 py-4 white-tp-container"
								style={{borderRadius: 10}}
							>
								<Form
									className="flex flex-col gap-4"
									onSubmit={formik.handleSubmit}
								>
									<div className="pb-4 flex flex-col gap-2">
										<label>Master Password</label>
										<Input
											appearance={"solid"}
											type="password"
											placeholder="Ask a friend"
											name="master_password"
											value={formik.values.master_password}
											onChange={formik.handleChange}
										/>
									</div>
									<Button
										appearance={"action"}
										type="submit"
									>
										{loading ? <Spinner /> : "Sign in"}
									</Button>
									<Form.Control.Feedback
										type="invalid"
										className="d-block"
										style={{marginTop: -10}}
									>
										{formik.errors.code}
									</Form.Control.Feedback>
								</Form>
							</div>
						</>
					)}
				</Container>
			</Container>
		</ApplicationLayout>
	);
};

export default CreateNFT;
