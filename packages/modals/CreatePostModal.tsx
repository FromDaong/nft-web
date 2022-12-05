import {XIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Textarea} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {styled} from "@styles/theme";
import UserAvatar from "core/auth/components/Avatar";
import Image from "next/image";
import Modal from ".";
import {useState} from "react";

const MediaDropZone = styled(Container, {
	backgroundColor: "$elementOnSurface",
	padding: "16px",
	borderRadius: "16px",
	position: "relative",
});

export default function CreatePostModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => any;
}) {
	const [mediaContent, setMediaContent] = useState(null);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex flex-col w-full gap-8">
				<Container className="flex flex-col gap-4">
					<Container className="flex flex-col gap-2">
						<UserAvatar
							size={40}
							value={"christopher"}
						/>
						<Container className="flex gap-2">
							<Text>My timeline</Text>
							<Text>Everyone can view</Text>
						</Container>
					</Container>
					<Container>
						<Textarea
							css={{
								minHeight: "120px",
								maxHeight: "180px",
								height: "auto",
							}}
							placeholder="Caption for your content"
						/>
					</Container>
				</Container>
				<Container
					className="overflow-hidden rounded-2xl"
					style={{maxHeight: "300px"}}
				>
					{mediaContent ? (
						<Container className="flex flex-col items-center justify-center h-full overflow-hidden rounded-2xl">
							<img
								src={mediaContent}
								className=" rounded-2xl max-h-fit max-w-fit"
							/>
						</Container>
					) : (
						<Container>
							<MediaDropZone>
								<Container className="flex flex-col items-center justify-center w-full h-full gap-2 p-4">
									<Text>Drag & Drop your Image or Video</Text>
									<SmallText>
										<MutedText>Accepts only Image & Video files</MutedText>
									</SmallText>
									<input
										onChange={(e) =>
											setMediaContent(
												window.URL.createObjectURL(e.target.files[0])
											)
										}
										type={"file"}
										style={{position: "absolute", opacity: 0, width: "100%"}}
									/>
								</Container>
							</MediaDropZone>
						</Container>
					)}
				</Container>
				<Container className="flex justify-end w-full">
					<Button>Create</Button>
				</Container>
			</Container>
		</Modal>
	);
}
