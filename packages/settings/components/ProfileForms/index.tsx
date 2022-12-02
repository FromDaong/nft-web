import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Divider} from "@packages/shared/components/Divider";
import {Button, WhiteButton} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";

export default function PersonalInformationForm() {
	return (
		<>
			<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<Container className="col-span-1 px-1 py-1 mt-4">
					<p>
						<Heading size="sm">Personal Information</Heading>
					</p>

					<Text>
						<MutedText>Update your personal details</MutedText>
					</Text>
				</Container>
				<Container className="flex flex-col col-span-1 gap-8">
					<Container className="flex flex-col gap-4 border-gray-100 rounded-2xl">
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
