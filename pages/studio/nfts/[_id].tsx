/* eslint-disable no-mixed-spaces-and-tabs */
import Tiptap from "@components/ui/tiptap";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import {ChevronLeft, EyeOff} from "lucide-react";
import Link from "next/link";
import {useMemo} from "react";
import {RadioGroup} from "@headlessui/react";
import {Globe} from "lucide-react";
import * as yup from "yup";
import {toast} from "sonner";
import Spinner from "@packages/shared/icons/Spinner";
import {MongoModelNFT} from "server/helpers/models";
import {connectMongoDB} from "server/helpers/core";
import {useRouter} from "next/router";

const ManageNFTModal = ({nft}) => {
	const router = useRouter();
	nft = JSON.parse(nft);
	// if description is plain string convert it to Tiptap

	const mutation = TreatCore.useMutation({
		mutationFn: async (values: {
			name: string;
			description: string;
			price: string;
			protected: boolean;
		}) => {
			const res = await axios.put(
				`${apiEndpoint}/marketplace/nft/${nft._id}/patch`,
				{
					name: values.name,
					description: JSON.stringify(values.description),
					price: values.price,
					isProtected: values.protected,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			return res.data;
		},
		onSuccess: () => {
			TreatCore.queryClient.invalidateQueries(["nft", `${nft.id}`]);
			toast.success("NFT updated successfully");
		},
	});

	const description = useMemo(() => {
		try {
			const parsedDescription = JSON.parse(nft.description ?? "{}");
			return parsedDescription;
		} catch (e) {
			// Create tiptap object with nft.description as one paragraph
			return {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: nft.description,
							},
						],
					},
				],
			};
		}
	}, [nft.description]);

	const formik = useFormik({
		initialValues: {
			name: nft.name,
			description: description,
			price: nft.price,
			protected: nft.protected,
		},
		onSubmit: (values, {setSubmitting}) => {
			setSubmitting(true);
			mutation.mutateAsync(values).then(() => setSubmitting(false));
		},
		validationSchema: yup.object().shape({
			name: yup.string().required("Required"),
			description: yup.object().required("Required"),
			price: yup.string().required("Required"),
		}),
	});

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className={"flex gap-2 my-8 items-center"}>
					<Button
						appearance={"subtle"}
						size={"sm"}
						onClick={router.back}
					>
						<ChevronLeft className="w-5 h-5" />
						Studio
					</Button>
					<Button
						size={"sm"}
						appearance={"surface"}
					>
						/
					</Button>
					<Button
						size={"sm"}
						appearance={"unstyled"}
					>
						<ImportantText css={{color: "$textContrast"}}>
							Manage NFT
						</ImportantText>
					</Button>
				</Container>
				<form
					className="flex justify-between gap-12"
					onSubmit={formik.handleSubmit}
				>
					<Container className="flex flex-col items-center w-full gap-4">
						<Container className="w-full">
							<Container className="flex flex-col gap-1 mb-2">
								<Heading size={"md"}>{formik.values.name}</Heading>
							</Container>
							<Container className="flex flex-col">
								<Heading size={"xss"}>{nft.price} BNB</Heading>
							</Container>
						</Container>
						<Container className="flex flex-col w-full gap-8">
							<Container className="flex flex-col gap-1">
								<label htmlFor={"name"}>
									<Text>
										<ImportantText>Name</ImportantText>
									</Text>
								</label>
								<Input
									name={"name"}
									id={"name"}
									appearance={"solid"}
									value={formik.values.name}
									onChange={formik.handleChange}
									className="w-full"
								/>
							</Container>

							<Container className="flex flex-col gap-1">
								<label>
									<Text>
										<ImportantText>Description</ImportantText>
									</Text>
								</label>
								<Tiptap
									onChange={(json) => {
										formik.setFieldValue("description", json);
									}}
									onError={(error) => {
										formik.setFieldError("description", error);
									}}
									initialValue={formik.values.description}
								/>
							</Container>
						</Container>
						<Container className="flex mb-4">
							<Container
								className="p-1 rounded-xl"
								css={{backgroundColor: "$elementOnSurface"}}
							>
								<RadioGroup
									onChange={(selected) =>
										formik.setFieldValue("protected", selected)
									}
									className="flex items-center gap-2 px-2 py-2 overflow-x-auto flex-nowrap scroll-smooth whitespace-wrap"
									defaultValue={formik.values.protected}
								>
									<RadioGroup.Option
										appearance={formik.values.protected ? "action" : "subtle"}
										className="flex-shrink-0"
										value={true}
										as={Button}
										type={"button"}
									>
										<EyeOff className="w-4 h-4" />
										Blur image
									</RadioGroup.Option>
									<RadioGroup.Option
										as={Button}
										appearance={!formik.values.protected ? "action" : "subtle"}
										className="flex-shrink-0"
										value={false}
										type={"button"}
									>
										<Globe className="w-4 h-4" />
										Show image
									</RadioGroup.Option>
								</RadioGroup>
							</Container>
						</Container>
						<Container className="flex justify-end w-full gap-4 mt-4">
							<Button
								appearance={"subtle"}
								onClick={() => formik.resetForm({values: formik.initialValues})}
								type={"button"}
							>
								Discard changes
							</Button>
							<Button
								disabled={!formik.isValid || formik.isSubmitting}
								appearance={
									formik.isValid || !formik.isSubmitting
										? "default"
										: "disabled"
								}
								type={"submit"}
							>
								{formik.isSubmitting ? (
									<>
										<Spinner />
										Updating...
									</>
								) : (
									"Update"
								)}
							</Button>
						</Container>
					</Container>
					<Container className={"flex flex-col gap-8 justify-center w-96"}>
						<Container className="overflow-hidden shadow-xl w-96 rounded-xl aspect-[12/16] mx-auto">
							<Container
								className={`w-full h-full ${
									formik.values.protected ? "blur-xl" : ""
								}`}
								css={{
									backgroundColor: "$elementOnSurface",
									background: `url("/api/v3/image/nft/${nft._id}/thumbnail")`,
									backgroundSize: "cover",
								}}
							/>
						</Container>
					</Container>
				</form>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

const NavigationBreadCrumb = ({label, href, enabled}) => {
	return (
		<Link href={enabled ? href : ""}>
			<a>
				<Text>
					<ImportantText></ImportantText>
				</Text>
			</a>
		</Link>
	);
};

export const getServerSideProps = async (ctx) => {
	try {
		await connectMongoDB();
		const _id = ctx.params._id;
		const nft = await MongoModelNFT.findOne({_id}).lean().populate({
			path: "creator",
			populate: "profile",
		});

		return {
			props: {
				nft: JSON.stringify(nft),
			},
		};
	} catch (err) {
		return {
			props: {
				error: true,
			},
		};
	}
};

export default ManageNFTModal;
