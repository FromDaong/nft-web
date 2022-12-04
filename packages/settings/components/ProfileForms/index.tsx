import {Heading} from "@packages/shared/components/Typography/Headings";
import {MutedText, Text} from "@packages/shared/components/Typography/Text";
import {Button, WhiteButton} from "@packages/shared/components/Button";
import {Container, FluidContainer} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {styled} from "@styles/theme";
import Avatar from "@packages/shared/components/AvatarNew";
import {useDisclosure} from "@packages/hooks";
import CropPhotoModal from "../CropPhotoModal/CropPhotoModal";
import {useState, useEffect} from "react";

const AvatarContainer = styled("div", {
	borderRadius: "50%",
	height: "128px",
	width: "128px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
	border: "8px solid $surface",
	zIndex: 0,
});

export default function PersonalInformationForm() {
	const {isOpen, onClose, onOpen} = useDisclosure();
	const [newImage, setNewImage] = useState(null);

	useEffect(() => {
		if (newImage) {
			console.log(newImage);
			onOpen();
		}
	}, [newImage]);

	return (
		<>
			<CropPhotoModal
				isOpen={isOpen}
				onClose={onClose}
				image={newImage}
			/>
			<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
						<Container className="flex flex-col gap-1">
							<Text>
								<MutedText>Profile Photo</MutedText>
							</Text>
							<Container className="flex items-center justify-between">
								<Container className="flex flex-col gap-1">
									<FluidContainer className="relative flex h-full">
										<AvatarContainer className="drop-shadow">
											<Avatar
												name="Tatenda Chris"
												imageSrc="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=90"
												size={{width: "128px", height: "128px"}}
											/>
										</AvatarContainer>
									</FluidContainer>
								</Container>
								<Container className="flex gap-1">
									<Button style={{position: "relative", zIndex: 0}}>
										<input
											type="file"
											style={{
												width: "100px",
												position: "absolute",
												opacity: 0,
											}}
											accept="images/*"
											onChange={(e) =>
												setNewImage(
													window.URL.createObjectURL(e.target.files[0])
												)
											}
										/>
										Update
									</Button>
									<Button appearance={"surface"}>Delete</Button>
								</Container>
							</Container>
						</Container>
						<Container className="flex flex-col gap-1">
							<Text>
								<MutedText>Display name</MutedText>
							</Text>
							<Input />
						</Container>
						<Container className="flex flex-col gap-1">
							<Text>
								<MutedText>Username</MutedText>
							</Text>
							<Input />
						</Container>
						<Container className="flex flex-col gap-1">
							<Text>
								<MutedText>Email Address</MutedText>
							</Text>
							<Input />
						</Container>
					</Container>
					<Container className="flex justify-end gap-2">
						<Button appearance={"subtle"}>Cancel</Button>
						<Button>Save Changes</Button>
					</Container>
				</Container>
			</Container>
		</>
	);
}

export const LinksForm = () => {
	return (
		<Container className="grid grid-cols-2">
			<Container className="col-span-1 px-1 py-1 mt-4">
				<p>
					<Heading size="sm">Social media links</Heading>
				</p>

				<Text>
					<MutedText>Add links to your social media profiles</MutedText>
				</Text>
			</Container>
			<Container className="col-span-1 mt-4">
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
						<WhiteButton>Cancel</WhiteButton>
						<Button>Save Changes</Button>
					</Container>
				</Container>
			</Container>
		</Container>
	);
};
