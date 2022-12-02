import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import ThemeSwitcherModal from "@packages/theme/ThemeSwitcherModal";

export default function SettingsAndPrivacy() {
	const {isOpen, onClose, onOpen} = useDisclosure();

	return (
		<Container className="grid grid-cols-3">
			<ThemeSwitcherModal
				isOpen={isOpen}
				onClose={onClose}
			/>

			<Container className="flex flex-col col-span-2 gap-12">
				<Container className="flex flex-col gap-4">
					<Container>
						<Heading size="sm">Theme</Heading>
						<Text>
							Choose a theme you like from one of 3 options, "Light", "Dark" and
							"OG Pink".
						</Text>
					</Container>
					<Container>
						<Button
							onClick={onOpen}
							appearance={"surface"}
						>
							Choose theme
						</Button>
					</Container>
				</Container>
				<Container className="flex flex-col gap-4">
					<Container>
						<Heading size="sm">Deactivate my account</Heading>
						<Text>
							Temporarily disable my account. You will need to talk to support
							to reactivate your account.
						</Text>
					</Container>
					<Container>
						<Button css={{backgroundColor: "$red10", text: "$elementSurface"}}>
							Deactivate account
						</Button>
					</Container>
				</Container>
				<Container className="flex flex-col gap-4">
					<Container>
						<Heading size="sm">Delete my account</Heading>
						<Text>
							Permanently delete my account. This action is irreversible and all
							your data will be lost
						</Text>
					</Container>
					<Container>
						<Button css={{backgroundColor: "$red10", text: "$elementSurface"}}>
							Delete my account
						</Button>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
