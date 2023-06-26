/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Field, FieldArray, Form, Formik} from "formik";
import {useMemo, useState} from "react";
import useSWR from "swr";
import * as Yup from "yup";
import ImagePreviewWithEditor from "./ImagePreview";
import * as Switch from "@radix-ui/react-switch";
import {Button} from "@packages/shared/components/Button";
import {File as FilepondFile} from "filepond";
import Tiptap from "@components/ui/tiptap";
import UploadMedia from "@packages/form/actions/UploadFiles";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {useUser} from "core/auth/useUser";
import {Heading} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";

export type MediaData = {
	file: FilepondFile;
	type: "image" | "video";
};

const AddNFTDetails = ({
	onSubmit,
}: {
	onSubmit: (values: any, actions: any, image: File) => Promise<void>;
}) => {
	const [mediaData, setMediaData] = useState<MediaData | null>(null);
	const [finalImage, setFinalImage] = useState(null);
	const {data: bnbPrice, error: bnbError} = TreatCore.useQuery(
		["bnbPrice1"],
		async () => {
			const data = await axios.get(
				"https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
			);

			return data.data.binancecoin.usd;
		}
	);

	return (
		<Formik
			validationSchema={Yup.object().shape({
				name: Yup.string().required("Name is required"),
				description: Yup.object().required("Description is required"),
				price: Yup.number().required("Price is required"),
				maxSupply: Yup.number()
					.required("Max Supply is required")
					.min(1, "Max Supply must be greater than 0"),
				type: Yup.string().required("Type is required"),
				protected: Yup.boolean().required("Protected is required"),
			})}
			initialValues={{
				name: "",
				description: "",
				type: "image",
				price: "0.00",
				maxSupply: "1",
				protected: false,
			}}
			validateOnBlur={true}
			validateOnChange={false}
			onSubmit={(values, actions) => onSubmit(values, actions, finalImage)}
		>
			{(props) => (
				<Form>
					<Container className="grid grid-cols-1 gap-8">
						<FieldArray name="nfts">
							{({form}) => {
								return (
									<Container className="flex flex-col-reverse gap-8 xl:flex-row">
										<Container
											className="flex flex-col flex-1 gap-4 p-4"
											css={{
												background: "$elementOnSurface",
												borderRadius: "16px",
											}}
										>
											<Container className="col-span-1 lg:col-span-2">
												<Container className="grid grid-cols-2 gap-4">
													<Container className="flex flex-col col-span-2 gap-1">
														<Text>
															<ImportantText>Name</ImportantText>
														</Text>
														<Field name={`name`}>
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
													<Container className="flex flex-col col-span-2 gap-1">
														<Text>
															<ImportantText>Description</ImportantText>
														</Text>
														<Field name={`description`}>
															{({field, meta}) => (
																<Container className="flex flex-col gap-2">
																	<Tiptap
																		onChange={(json) => {
																			form.setFieldValue(field.name, json);
																		}}
																		onError={(error) => {
																			form.setFieldError(field.name, error);
																		}}
																	/>
																	{meta.error && (
																		<Text appearance={"danger"}>
																			<SmallText>{meta.error}</SmallText>
																		</Text>
																	)}
																</Container>
															)}
														</Field>
													</Container>
													<Container className="flex flex-col col-span-1 gap-1">
														<Text>
															<ImportantText>Price in BNB</ImportantText>
														</Text>
														<Field name={`price`}>
															{({field, meta}) => (
																<Container className="flex flex-col gap-2">
																	<Input
																		type="number"
																		step={0.001}
																		min={0}
																		defaultValue={0.02}
																		{...field}
																	/>
																	<Text>
																		<MutedText>
																			{bnbPrice
																				? `~$${(
																						parseFloat(bnbPrice) *
																						parseFloat(field.value)
																				  ).toFixed(2)}`
																				: "Loading..."}
																		</MutedText>
																	</Text>
																	{meta.touched && meta.error && (
																		<Text appearance={"danger"}>
																			<SmallText>{meta.error}</SmallText>
																		</Text>
																	)}
																</Container>
															)}
														</Field>
													</Container>
													<Container className="flex flex-col col-span-1 gap-1">
														<Text>
															<ImportantText>Maximum supply</ImportantText>
														</Text>
														<Field name={`maxSupply`}>
															{({field, meta}) => (
																<Container className="flex flex-col gap-2">
																	<Input
																		type="number"
																		min={1}
																		defaultValue={10}
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
													<Container className="flex items-center justify-between col-span-2 gap-8">
														<Container className="flex flex-col">
															<Text>
																<ImportantText>Protected content</ImportantText>
															</Text>
															<Text>
																<MutedText>
																	Only owners of this NFT can view its content.
																</MutedText>
															</Text>
														</Container>
														<Container>
															<Switch.Root
																className="SwitchRoot"
																id="airplane-mode"
																onCheckedChange={(e) =>
																	form.setFieldValue(`protected`, e)
																}
															>
																<Switch.Thumb className="SwitchThumb" />
															</Switch.Root>
														</Container>
													</Container>
												</Container>
											</Container>
										</Container>
										<Container
											css={{
												background: "$surfaceOnSurface",
												borderRadius: "16px",
											}}
											className="flex flex-col self-start w-full col-span-1 gap-4 p-2 shadow xl:w-96"
										>
											{mediaData && (
												<ImagePreview
													temp_file={mediaData}
													reset={() => setMediaData(null)}
													save={setFinalImage}
												/>
											)}
											{!mediaData && <UploadMedia setFile={setMediaData} />}
										</Container>
									</Container>
								);
							}}
						</FieldArray>
						<Container className="flex justify-start gap-8 py-8">
							<Button
								disabled={(props.dirty && !props.isValid) || props.isSubmitting}
								appearance={
									(props.dirty && !props.isValid) || props.isSubmitting
										? "disabled"
										: "default"
								}
								type="submit"
							>
								{props.isSubmitting ? "Creating your NFT..." : "Publish"}
							</Button>
						</Container>
					</Container>
				</Form>
			)}
		</Formik>
	);
};

export default AddNFTDetails;

function ImagePreview({
	temp_file,
	reset,
	save,
}: {
	temp_file: MediaData;
	reset: () => void;
	save: (image: File) => void;
}) {
	const {profile} = useUser();
	const sellerProfile = useMemo(() => profile ?? {}, [profile]);

	return (
		<Container className="w-full">
			<Container className="flex items-center gap-2 p-2">
				<UserAvatar
					profile_pic={sellerProfile.profile_pic}
					size={32}
					username={sellerProfile.username}
				/>
				<Container className={"flex flex-col"}>
					<Text
						css={{
							color: "$textContrast",
						}}
					>
						<ImportantText>{sellerProfile.display_name}</ImportantText>
					</Text>
					<SmallText>@{sellerProfile.username}</SmallText>
				</Container>
			</Container>
			<ImagePreviewWithEditor
				image={temp_file}
				save={save}
				reset={reset}
			/>
		</Container>
	);
}
