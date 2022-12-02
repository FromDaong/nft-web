import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import * as Switch from "@radix-ui/react-switch";

export default function NotificationPreferences() {
	return (
		<Container className="grid grid-cols-2">
			<Container className="flex flex-col col-span-1 gap-12">
				<Container className="flex items-center justify-between gap-8">
					<Container>
						<Heading size="sm">Comments</Heading>
						<Text>Notify me when someone comments on my posts.</Text>
					</Container>
					<Container>
						<Switch.Root
							className="SwitchRoot"
							id="airplane-mode"
						>
							<Switch.Thumb className="SwitchThumb" />
						</Switch.Root>
					</Container>
				</Container>
				<Container className="flex items-center justify-between gap-8">
					<Container>
						<Heading size="sm">Offers</Heading>
						<Text>Notify me when someone offers to buy my trit.</Text>
					</Container>
					<Container>
						<Switch.Root
							className="SwitchRoot"
							id="airplane-mode"
						>
							<Switch.Thumb className="SwitchThumb" />
						</Switch.Root>
					</Container>
				</Container>
				<Container className="flex items-center justify-between gap-8">
					<Container>
						<Heading size="sm">Subscribed livestreams</Heading>
						<Text>
							Notify me when a subscribed creator starts a livestream.
						</Text>
					</Container>
					<Container>
						<Switch.Root
							className="SwitchRoot"
							id="airplane-mode"
						>
							<Switch.Thumb className="SwitchThumb" />
						</Switch.Root>
					</Container>
				</Container>
				<Container className="flex items-center justify-between gap-8">
					<Container>
						<Heading size="sm">Subscribed posts</Heading>
						<Text>
							Notify me when a subscribed creator uploads something new.
						</Text>
					</Container>
					<Container>
						<Switch.Root
							className="SwitchRoot"
							id="airplane-mode"
						>
							<Switch.Thumb className="SwitchThumb" />
						</Switch.Root>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
