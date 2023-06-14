/* eslint-disable no-mixed-spaces-and-tabs */
import Tiptap from "@components/ui/tiptap";
import {treatGraphClient} from "@lib/graphClients";
import {useDisclosure} from "@packages/hooks";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {ArrowRightIcon, StackIcon} from "@radix-ui/react-icons";
import {apiEndpoint, timeFromNow} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import {Edit, ExternalLink, EyeOff} from "lucide-react";
import Link from "next/link";
import {useMemo} from "react";
import {Provider, gql, useQuery} from "urql";
import {useAccount} from "wagmi";
import Web3 from "web3";
import {RadioGroup} from "@headlessui/react";
import {Globe} from "lucide-react";
import * as yup from "yup";
import {toast} from "sonner";
import Spinner from "@packages/shared/icons/Spinner";
import {MongoModelNFT} from "server/helpers/models";
import {connectMongoDB} from "server/helpers/core";

const ManageNFTModal = ({nft}) => {
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
				<Container className={"flex flex-col gap-2 my-12"}></Container>
				<form onSubmit={formik.handleSubmit}>
					<Container className="flex flex-col items-center gap-4 w-full">
						<Container className={"flex gap-8 w-full justify-center"}>
							<Container className="w-96 rounded-xl shadow-xl aspect-square overflow-hidden">
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
						<Container className="w-full">
							<Container className="flex justify-center mb-4">
								<Container
									className="p-1 rounded-xl"
									css={{backgroundColor: "$elementOnSurface"}}
								>
									<RadioGroup
										onChange={(selected) =>
											formik.setFieldValue("protected", selected)
										}
										className="flex items-center w-full max-w-full gap-2 py-2 overflow-x-auto flex-nowrap px-2 scroll-smooth whitespace-wrap"
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
											appearance={
												!formik.values.protected ? "action" : "subtle"
											}
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
							<Container className="flex flex-col gap-1 mb-2">
								<Heading size={"xs"}>{formik.values.name}</Heading>
							</Container>
							<Container className="flex flex-col">
								<Heading size={"xss"}>{nft.price} BNB</Heading>
							</Container>
						</Container>
						<Container className="flex flex-col gap-8 w-full">
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
						<Container className="flex justify-end gap-4 w-full mt-4">
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
