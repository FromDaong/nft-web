import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {useDisclosure} from "@packages/hooks";
import CropPhotoModal from "../../../modals/CropPhotoModal/CropPhotoModal";
import {useState, useEffect, useLayoutEffect} from "react";
import {useFormik} from "formik";
import {useSession} from "next-auth/react";
import DynamicSkeleton from "@packages/skeleton";
import {
	LinksFormSkeleton,
	ProfileFormSkeleton,
} from "@packages/skeleton/config";
import {PencilAltIcon} from "@heroicons/react/outline";
import {cdnUploadFileAndReturnURL} from "@utils/uploadcare";
import axios from "axios";
import {apiEndpoint} from "@utils/index";
import Spinner from "@packages/shared/icons/Spinner";

import * as Yup from "yup";
import Toast from "@packages/shared/components/Toast";

export default function PersonalInformationForm() {
	const {isOpen, onClose, onOpen} = useDisclosure();
	const [newImage, setNewImage] = useState(null);
	const {data: session} = useSession();
	const profile = (session as unknown as any)?.profile;

	useEffect(() => {
		if (newImage) {
			onOpen();
		}
	}, [newImage]);

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
						{profile ? (
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
	const profile = (session as unknown as any)?.profile;

	return (
		<Container className="grid w-full max-w-3xl grid-cols-1 gap-12 mx-auto">
			<Container className="col-span-1 px-1 py-1 mt-4">
				<p>
					<Heading size="sm">Social media links</Heading>
				</p>

				<Text>
					<MutedText>Add links to your social media profiles</MutedText>
				</Text>
			</Container>
			{profile ? (
				<LinksFormPresentation links={profile?.links ?? []} />
			) : (
				<DynamicSkeleton config={LinksFormSkeleton} />
			)}
		</Container>
	);
};

const PersonalPresentationInformationForm = (props: {
	profile: {
		username: string;
		display_name: string;
		email: string;
		profile_pic: string;
		banner_pic: string;
		bio: string;
	};
}) => {
	const {profile} = props;
	const [bannerUrl, setBannerURL] = useState("");
	const [profilePicUrl, setProfilePicURL] = useState("");
	const [updatingBanner, setUpdatingBanner] = useState(false);
	const [updatingProfilePic, setUpdatingProfilePic] = useState(false);
	const [updateBannerError, setUpdateBannerError] = useState("");
	const [updateProfilePicError, setUpdateProfilePicError] = useState("");
	const [updateProfileError, setUpdateProfileError] = useState("");
	const [toastMessage, setToastMessage] = useState({title: "", content: ""});

	const {isOpen, onOpen, onClose} = useDisclosure();

	const [profileData, setUpdateProfile] = useState({
		email: "",
		display_name: "",
		bio: "",
	});

	const personalInformationForm = useFormik({
		initialValues: {
			...profileData,
		},
		validationSchema: Yup.object({
			display_name: Yup.string()
				.min(3, "Must be at least 3 characters")
				.max(50, "Must be 20 characters or less")
				.required("Required"),
			email: Yup.string().required("Email is required"),
			bio: Yup.string()
				.min(3, "Must be at least 3 characters")
				.max(100, "Must be 100 characters or less"),
		}),

		onSubmit(values, formikHelpers) {
			setUpdateProfileError("");
			axios
				.post(`${apiEndpoint}/profile/methods/patch`, values)
				.then(() => setUpdateProfile(values))
				.then(() => formikHelpers.setSubmitting(false))
				.then(() =>
					setToastMessage({title: "Success", content: "Profile updated"})
				)
				.catch((err) => {
					setUpdateProfileError(err.message);
					formikHelpers.setSubmitting(false);
					setToastMessage({title: "Error", content: err.message});
				});
		},
	});

	console.log({personalInformationForm});

	const onSelectBannerPic = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files[0];
		setUpdatingBanner(true);
		setUpdateBannerError("");
		cdnUploadFileAndReturnURL(file)
			.then((url) => {
				axios
					.post(`${apiEndpoint}/profile/methods/patch`, {banner_pic: url})
					.then(() => setBannerURL(url));
			})
			.then(() => setUpdatingBanner(false))
			.then(() =>
				setToastMessage({title: "Success", content: "Banner updated"})
			)
			.catch((err) => {
				setUpdateBannerError(err.message);
				setUpdatingBanner(false);
				setToastMessage({title: "Error", content: err.message});
			});
	};

	const onSelectProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files[0];
		setUpdatingProfilePic(true);
		setUpdateProfilePicError("");
		cdnUploadFileAndReturnURL(file)
			.then((url) => {
				axios
					.post(`${apiEndpoint}/profile/methods/patch`, {profile_pic: url})
					.then(() => setProfilePicURL(url));
			})
			.then(() => setUpdatingProfilePic(false))
			.then(() =>
				setToastMessage({title: "Success", content: "Profile picture updated"})
			)
			.catch((err) => {
				setUpdateProfilePicError(err.message);
				setUpdatingProfilePic(false);
				setToastMessage({title: "Error", content: err.message});
			});
	};

	useEffect(() => {
		if (toastMessage.title) {
			onOpen();
		}
	}, [toastMessage]);

	useLayoutEffect(() => {
		setProfilePicURL(profile.profile_pic);
		setBannerURL(profile.banner_pic);

		personalInformationForm.setValues({
			email: profile.email,
			display_name: profile.display_name,
			bio: profile.bio,
		});
	}, [profile]);

	return (
		<>
			<Toast
				isOpen={isOpen}
				onClose={onClose}
				title={toastMessage.title}
				content={toastMessage.content}
			/>
			<Container className="flex flex-col gap-2">
				<ImportantText css={{color: "$textContrast"}}>
					Banner Photo
				</ImportantText>
				<Container className="flex items-center gap-12">
					<Container
						css={{
							backgroundColor: "$surfaceOnSurface",
							backgroundImage: `url(${
								bannerUrl ||
								"https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP"
							})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						className="relative overflow-hidden w-full h-[200px] rounded-xl group flex items-center justify-center"
					>
						{!updatingBanner && (
							<Container className="flex items-center justify-center w-full h-full duration-200 rounded-full hover:transition-opacity">
								<label
									htmlFor="banner_pic"
									className="flex items-center justify-center w-full h-full"
								>
									<Text
										css={{backgroundColor: "$surfaceOnSurface"}}
										className="relative p-2 rounded-full"
									>
										<PencilAltIcon
											height={20}
											width={20}
										/>
									</Text>
									<input
										id="banner_pic"
										name="banner_pic"
										className="hidden"
										type="file"
										onChange={onSelectBannerPic}
									/>
								</label>
							</Container>
						)}
						{updatingBanner && <Spinner />}
					</Container>
				</Container>
				<SmallText>Click in the box to update your banner picture.</SmallText>
			</Container>
			<Container className="flex flex-col gap-2">
				<ImportantText css={{color: "$textContrast"}}>
					Profile Photo
				</ImportantText>
				<Container className="flex items-center gap-12">
					<Container
						css={{
							backgroundColor: "$surfaceOnSurface",
							backgroundImage: `url(${
								profilePicUrl ||
								"https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP"
							})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						className="relative overflow-hidden w-[120px] h-[120px] rounded-full group flex items-center justify-center"
					>
						{!updatingProfilePic && (
							<Container className="items-center justify-center w-full h-full duration-200 rounded-full hover:transition-opacity">
								<label
									htmlFor="profile_pic"
									className="flex items-center justify-center w-full h-full"
								>
									<Text
										css={{backgroundColor: "$surfaceOnSurface"}}
										className="relative p-2 rounded-full shadow"
									>
										<PencilAltIcon
											height={20}
											width={20}
										/>
									</Text>
									<input
										id="profile_pic"
										name="profile_pic"
										className="hidden"
										type="file"
										onChange={onSelectProfilePic}
									/>
								</label>
							</Container>
						)}
						{updatingProfilePic && <Spinner />}
					</Container>
				</Container>
			</Container>
			<form className="flex flex-col gap-8">
				<Container className="flex flex-col gap-2">
					<ImportantText css={{color: "$textContrast"}}>
						Display name
					</ImportantText>
					<Input
						value={personalInformationForm.values.display_name}
						onChange={personalInformationForm.handleChange}
						onBlur={personalInformationForm.handleBlur}
						name="display_name"
						required
					/>
				</Container>
				<Container className="flex flex-col gap-2">
					<ImportantText css={{color: "$textContrast"}}>
						Email address
					</ImportantText>
					<Input
						value={personalInformationForm.values.email}
						onChange={personalInformationForm.handleChange}
						onBlur={personalInformationForm.handleBlur}
						name="email_address"
						type={"email"}
						required
					/>
				</Container>
				<Container className="flex flex-col gap-2">
					<ImportantText css={{color: "$textContrast"}}>Bio</ImportantText>
					<Input
						value={personalInformationForm.values.bio}
						onChange={personalInformationForm.handleChange}
						onBlur={personalInformationForm.handleBlur}
						name="bio"
						required
					/>
				</Container>
				{false && (
					<Container className="flex flex-col gap-2">
						<ImportantText css={{color: "$textContrast"}}>
							Email Address
						</ImportantText>
						<Input
							value={personalInformationForm.values.email}
							onChange={personalInformationForm.handleChange}
							onBlur={personalInformationForm.handleBlur}
							name="email"
						/>
					</Container>
				)}
				<Container className="flex justify-end gap-2">
					<Button
						onClick={personalInformationForm.submitForm}
						appearance={
							personalInformationForm.isSubmitting ||
							!personalInformationForm.isValid
								? "disabled"
								: "action"
						}
						disabled={
							personalInformationForm.isSubmitting ||
							!personalInformationForm.isValid ||
							!personalInformationForm.dirty
						}
					>
						{personalInformationForm.isSubmitting && <Spinner />}
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
