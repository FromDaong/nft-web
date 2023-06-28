/* eslint-disable no-mixed-spaces-and-tabs */
import Tiptap from "@components/ui/tiptap";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
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
import UserAvatar from "core/auth/components/Avatar";

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
				<Container className={"flex my-8 items-center"}>
					<Link href={`/studio/`}>
						<a className="hidden lg:flex">
							<Button
								appearance={"subtle"}
								size={"sm"}
							>
								<ChevronLeft className="w-5 h-5" />
								Studio
							</Button>
						</a>
					</Link>
					<Container className="hidden lg:flex">
						<Button
							size={"sm"}
							appearance={"unstyled"}
						>
							/
						</Button>
					</Container>
					<Link href={`/studio/nfts/`}>
						<a>
							<Button
								appearance={"subtle"}
								size={"sm"}
								className="line-clamp-1"
							>
								<Text
									className="line-clamp-1"
									css={{fontWeight: "600"}}
								>
									Sweetshop NFTs
								</Text>
							</Button>
						</a>
					</Link>
					<Button
						size={"sm"}
						appearance={"unstyled"}
					>
						/
					</Button>
					<Button
						size={"sm"}
						appearance={"unstyled"}
					>
						<ImportantText css={{color: "$textContrast"}}>
							{nft.name}
						</ImportantText>
					</Button>
				</Container>
				<form
					className="flex flex-col-reverse lg:flex-row justify-between gap-12 mt-8"
					onSubmit={formik.handleSubmit}
				>
					<Container className="flex flex-col items-center w-full gap-8">
						<Container className="w-full">
							<Container className="flex flex-col gap-1 mb-2">
								<Heading size={"sm"}>{formik.values.name}</Heading>
							</Container>

							<Container className="flex gap-4 items-center">
								<Container className="flex gap-2 items-center">
									<UserAvatar
										profile_pic={nft.creator.profile.profile_pic}
										size={24}
										username={nft.creator.username}
									/>
									<Text>
										<ImportantText>
											{nft.creator.profile.display_name}
										</ImportantText>
									</Text>
								</Container>
								<Text>&bull;</Text>
								<Text>
									<ImportantText>{nft.price} BNB</ImportantText>
								</Text>
							</Container>
						</Container>
						<Container className="flex flex-col w-full gap-8 mt-8">
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
						<Container className="flex flex-col mb-4 justify-start w-full">
							<Container className="flex flex-col gap-1">
								<Text>
									<ImportantText>Privacy</ImportantText>
								</Text>
							</Container>

							<RadioGroup
								onChange={(selected) =>
									formik.setFieldValue("protected", selected)
								}
								className="flex items-center gap-2 py-2 overflow-x-auto flex-nowrap scroll-smooth whitespace-wrap"
								defaultValue={formik.values.protected}
							>
								<RadioGroup.Option
									appearance={formik.values.protected ? "action" : "subtle"}
									className="flex-shrink-0"
									value={true}
									as={Button}
									type={"button"}
									outlined
									size={"sm"}
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
									outlined
									size={"sm"}
								>
									<Globe className="w-4 h-4" />
									Show image
								</RadioGroup.Option>
							</RadioGroup>
							<MutedText>
								Blurring your image will make sure that only the owner of the
								NFT can see the image.
							</MutedText>
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
					<Container
						className={
							"flex flex-col gap-8 justify-center items-center lg:w-96"
						}
					>
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
