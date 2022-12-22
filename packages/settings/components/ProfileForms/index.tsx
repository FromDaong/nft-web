import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Button, WhiteButton} from "@packages/shared/components/Button";
import {Container, FluidContainer} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {styled} from "@styles/theme";
import Avatar from "@packages/shared/components/AvatarNew";
import {useDisclosure} from "@packages/hooks";
import CropPhotoModal from "../../../modals/CropPhotoModal/CropPhotoModal";
import {useState, useEffect} from "react";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import {Field, useFormik} from "formik";
import {useSession} from "next-auth/react";
import DynamicSkeleton from "@packages/skeleton";
import {
	LinksFormSkeleton,
	ProfileFormSkeleton,
} from "@packages/skeleton/config";

registerPlugin(
	FilePondPluginFileValidateType,
	FilePondPluginImagePreview,
	FilePondPluginImageCrop,
	FilePondPluginImageResize,
	FilePondPluginImageTransform
);

export default function PersonalInformationForm() {
	const {isOpen, onClose, onOpen} = useDisclosure();
	const [newImage, setNewImage] = useState(null);
	const {data: session} = useSession();

	const [profile, setProfile] = useState({
		username: "",
		displayName: "",
		email: "",
		profile_pic: "",
		bio: "",
	});

	useEffect(() => {
		if (newImage) {
			onOpen();
		}
	}, [newImage]);

	useEffect(() => {
		if (session) {
			setProfile((session as any).profile);
		}
	}, [session]);

	const closeCropModal = () => {
		setNewImage(null);
		onClose();
	};

	return (
		<>
			<CropPhotoModal
				isOpen={isOpen}
				onClose={closeCropModal}
				image={newImage}
			/>
			<Container className="grid w-full max-w-3xl grid-cols-1 gap-8 mx-auto">
				<Container className="col-span-1 px-1 py-1 mt-4">
					<p>
						<Heading size="sm">Personal Information</Heading>
					</p>

					<Text>
						<MutedText>Update your personal details</MutedText>
					</Text>
				</Container>
				<Container className="flex flex-col col-span-1 gap-10">
					<Container className="flex flex-col gap-6 border-gray-100 rounded-2xl">
						{session ? (
							<PersonalPresentationInformationForm profile={profile} />
						) : (
							<DynamicSkeleton config={ProfileFormSkeleton} />
						)}
					</Container>
				</Container>
			</Container>
		</>
	);
}

export const LinksForm = () => {
	const {data: session} = useSession();
	const profile = (session as unknown as {profile: any})?.profile;

	return (
		<Container className="grid w-full max-w-3xl grid-cols-1 gap-8 mx-auto">
			<Container className="col-span-1 px-1 py-1 mt-4">
				<p>
					<Heading size="sm">Social media links</Heading>
				</p>

				<Text>
					<MutedText>Add links to your social media profiles</MutedText>
				</Text>
			</Container>
			{session ? (
				<LinksFormPresentation links={profile.links ?? []} />
			) : (
				<DynamicSkeleton config={LinksFormSkeleton} />
			)}
		</Container>
	);
};

const PersonalPresentationInformationForm = (props: {
	profile: {
		username: string;
		displayName: string;
		email: string;
		profile_pic: string;
		bio: string;
	};
}) => {
	const personalInformationForm = useFormik({
		initialValues: {
			displayName: props.profile.displayName,
			bio: props.profile.bio,
			email: props.profile.email,
		},
		onSubmit(values, formikHelpers) {
			console.log(values);
		},
	});

	return (
		<>
			<Container className="flex flex-col gap-1">
				<ImportantText>
					<Text>Profile Photo</Text>
				</ImportantText>
				<Container className="flex items-center gap-12">
					<Container className="flex flex-col gap-1">
						<FluidContainer className="relative flex h-full">
							<FilePond
								allowMultiple={false}
								allowImageCrop={true}
								imagePreviewHeight={170}
								imageCropAspectRatio={"1:1"}
								imageResizeTargetWidth={200}
								imageResizeTargetHeight={200}
								stylePanelLayout={"compact circle"}
								styleLoadIndicatorPosition={"center bottom"}
								styleProgressIndicatorPosition={"right bottom"}
								styleButtonRemoveItemPosition={"left bottom"}
								styleButtonProcessItemPosition={"right bottom"}
								acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
							/>
						</FluidContainer>
					</Container>
				</Container>
			</Container>
			<form className="flex flex-col gap-4">
				<Container className="flex flex-col gap-1">
					<ImportantText>
						<Text>Display name</Text>
					</ImportantText>
					<Input
						value={personalInformationForm.values.displayName}
						onChange={personalInformationForm.handleChange}
						onBlur={personalInformationForm.handleBlur}
					/>
				</Container>
				<Container className="flex flex-col gap-1">
					<ImportantText>
						<Text>Bio</Text>
					</ImportantText>
					<Input
						value={personalInformationForm.values.bio}
						onChange={personalInformationForm.handleChange}
						onBlur={personalInformationForm.handleBlur}
					/>
				</Container>
				<Container className="flex flex-col gap-1">
					<ImportantText>
						<Text>Email Address</Text>
					</ImportantText>
					<Input
						value={personalInformationForm.values.email}
						onChange={personalInformationForm.handleChange}
						onBlur={personalInformationForm.handleBlur}
					/>
				</Container>
				<Container className="flex justify-end gap-2">
					<Button
						onClick={personalInformationForm.submitForm}
						appearance={"surface"}
					>
						{personalInformationForm.isSubmitting
							? "Loading..."
							: "Save Changes"}
					</Button>
				</Container>
			</form>
		</>
	);
};

const LinksFormPresentation = (props: {
	links: [
		{
			label: string;
			value: string;
		}
	];
}) => {
	const [links] = useState(props.links);

	const linksInformationForm = useFormik({
		initialValues: {links},
		onSubmit(values, formikHelpers) {
			console.log(values);
		},
	});
	return (
		<Container className="col-span-1">
			<Container className="grid grid-cols-1 gap-8 py-4 ">
				<Container className="flex flex-col gap-4">
					<Container>
						<Text>
							<MutedText>Website</MutedText>
						</Text>
						<Input />
					</Container>
					<Container>
						<Text>
							<MutedText>YouTube</MutedText>
						</Text>
						<Input />
					</Container>
					<Container>
						<Text>
							<MutedText>TikTok</MutedText>
						</Text>
						<Input />
					</Container>
				</Container>
				<Container className="flex justify-end gap-2">
					<Button appearance={"surface"}>Save Changes</Button>
				</Container>
			</Container>
		</Container>
	);
};
