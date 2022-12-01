import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Divider} from "@packages/shared/components/Divider";
import {Button, WhiteButton} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";

export default function PersonalInformationForm() {
	return (
		<>
			<Container className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Container className="col-span-1 mt-4 px-1 py-1">
					<p>
						<Heading size="sm">Personal Information</Heading>
					</p>

					<Text>
						<MutedText>Update your personal details</MutedText>
					</Text>
				</Container>
				<Container className="flex flex-col col-span-1 gap-8">
					<Container className="flex flex-col gap-4 border-gray-100 px-4 py-4 rounded-2xl">
						<Container>
							<Text>
								<MutedText>Display name</MutedText>
							</Text>
							<input className="w-full rounded-xl h-12 border-2 border-gray-100" />
						</Container>
						<Container>
							<Text>
								<MutedText>Username</MutedText>
							</Text>
							<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
						</Container>
						<Container>
							<Text>
								<MutedText>Email Address</MutedText>
							</Text>
							<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
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
		<Container className="grid grid-cols-4">
			<Container className="col-span-1 mt-4 px-1 py-1">
				<p>
					<Heading size="sm">Profile</Heading>
				</p>

				<Text>
					<MutedText>Update your portofolio and bio</MutedText>
				</Text>
			</Container>
			<Container className="col-span-3 mt-4 px-1 py-1">
				<Container className="grid grid-cols-2 gap-4 border-gray-100 shadow-md px-4 py-4 rounded-2xl">
					<Container className="mt-2">
						<Text>
							<MutedText>Verify your Profile</MutedText>
						</Text>
					</Container>
					<Container className="mt-2">
						<Text>
							<MutedText>Last Name</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="col-span-2 mt-2">
						<Text>
							<MutedText>Bio</MutedText>
						</Text>
						<textarea
							rows={5}
							className="w-full rounded-2xl border-2 border-gray-100"
						/>
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Add links to your social media profiles</MutedText>
						</Text>
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Website</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Discord</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>YouTube</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Youtube</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Facebook</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Twitch</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>TikTok</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="mt-2 col-span-2">
						<Text>
							<MutedText>Snapchat</MutedText>
						</Text>
						<input className="w-full rounded-2xl h-12 border-2 border-gray-100" />
					</Container>
					<Container className="col-span-2">
						<Divider dir="horizontal" />
					</Container>
					<Container className="flex justify-end col-span-2 gap-2">
						<WhiteButton>Cancel</WhiteButton>
						<Button>Save Changes</Button>
					</Container>
				</Container>
			</Container>
		</Container>
	);
};
