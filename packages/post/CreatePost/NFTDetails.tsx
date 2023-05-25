import {Container} from "@packages/shared/components/Container";
import {Input, Textarea} from "@packages/shared/components/Input";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Field, FieldArray, Form, Formik, useFormik} from "formik";
import {useState} from "react";
import useSWR from "swr";
import {useAccount, useWaitForTransaction} from "wagmi";
import * as Yup from "yup";
import ImagePreviewWitEditor from "./ImagePreview";
import * as Switch from "@radix-ui/react-switch";
import {Button} from "@packages/shared/components/Button";
import {useContracts} from "../hooks";
import {useStorageService} from "@packages/shared/hooks";
import {File} from "filepond";
import VideoPreview from "./VideoPreview";
import Tiptap from "@components/ui/tiptap";
import {PencilIcon} from "@heroicons/react/outline";
import {UploadIcon} from "lucide-react";

const AddNFTDetails = ({
	prev,
	nft_data,
	onSubmit,
}: {
	prev: any;
	nft_data: Array<{
		file: File;
		type: "image" | "video";
	}>;
	onSubmit: (values: any, actions: any) => Promise<void>;
}) => {
	const {data: bnbPrice, error: bnbError} = useSWR(
		`https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`
	);

	return (
		<Formik
			validationSchema={Yup.object().shape({
				nfts: Yup.array().of(
					Yup.object().shape({
						name: Yup.string().required("Name is required"),
						description: Yup.object().required("Description is required"),
						price: Yup.number().required("Price is required"),
						maxSupply: Yup.number()
							.required("Max Supply is required")
							.min(1, "Max Supply must be greater than 0"),
						file: Yup.mixed().required("File is required"),
						type: Yup.string().required("Type is required"),
						protected: Yup.boolean().required("Protected is required"),
					})
				),
			})}
			initialValues={{
				nfts: nft_data.map((file) => ({
					name: "",
					description: "",
					file: file.file,
					type: file.type,
					price: "0.00",
					maxSupply: "1",
					protected: false,
				})),
			}}
			validateOnBlur={true}
			validateOnChange={false}
			onSubmit={onSubmit}
		>
			{(props) => (
				<Form>
					<Container className="grid grid-cols-1 gap-8">
						<FieldArray name="nfts">
							{({form}) => {
								return props.values.nfts.map((temp_file, index) => {
									return (
										<Container
											key={temp_file.file.id}
											className="flex gap-8 flex-col-reverse xl:flex-row"
										>
											<Container
												className="flex flex-col gap-4 p-4 flex-1"
												css={{
													background: "$surfaceOnSurface",
													borderRadius: "16px",
												}}
											>
												<Container className="col-span-1 lg:col-span-2">
													<Container className="grid grid-cols-2 gap-4">
														<Container className="flex flex-col col-span-2 gap-1">
															<Text>
																<ImportantText>Name</ImportantText>
															</Text>
															<Field name={`nfts.${index}.name`}>
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
															<Field name={`nfts.${index}.description`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Tiptap
																			onChange={(json) => {
																				form.setFieldValue(field.name, json);
																			}}
																			onError={(error) => {
																				console.log({error});
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
															<Field name={`nfts.${index}.price`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Input
																			type="number"
																			step={0.01}
																			min={0.0}
																			defaultValue={0.02}
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
														<Container className="flex flex-col col-span-1 gap-1">
															<Text>
																<ImportantText>Maximum supply</ImportantText>
															</Text>
															<Field name={`nfts.${index}.maxSupply`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Input
																			type="number"
																			step={1}
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
																	<ImportantText>
																		Protected content
																	</ImportantText>
																</Text>
																<Text>
																	<MutedText>
																		Only owners of this NFT can view its
																		content.
																	</MutedText>
																</Text>
															</Container>
															<Container>
																<Switch.Root
																	className="SwitchRoot"
																	id="airplane-mode"
																	onCheckedChange={(e) =>
																		form.setFieldValue(
																			`nfts.${index}.protected`,
																			e
																		)
																	}
																>
																	<Switch.Thumb className="SwitchThumb" />
																</Switch.Root>
															</Container>
														</Container>
													</Container>
												</Container>
											</Container>
											<Container className="col-span-1 w-full xl:w-96 self-start flex flex-col gap-4">
												<Container className="aspect-square w-full">
													{temp_file.type === "image" ? (
														<ImagePreviewWitEditor
															image={temp_file.file}
															save={(image) => console.log({image})}
														/>
													) : (
														<VideoPreview file={temp_file.file} />
													)}
												</Container>
												<Container className="flex gap-4">
													<Button
														size={"sm"}
														appearance={"surface"}
													>
														<PencilIcon className="w-5 h-5" /> Edit image
													</Button>
													<Button
														size={"sm"}
														appearance={"surface"}
													>
														<UploadIcon className="w-5 h-5" /> Upload image
													</Button>
												</Container>
											</Container>
										</Container>
									);
								});
							}}
						</FieldArray>
						<Container className="flex justify-start gap-8 py-8">
							<Button
								appearance={"unstyled"}
								onClick={prev}
							>
								Previous
							</Button>
							<Button
								disabled={(props.dirty && !props.isValid) || props.isSubmitting}
								appearance={
									(props.dirty && !props.isValid) || props.isSubmitting
										? "disabled"
										: "primary"
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
