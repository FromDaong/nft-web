import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";

export default function WalletPreferences() {
	return (
		<Container className="grid grid-cols-3">
			<Container className="col-span-2 gap-12">
				<Container className="flex flex-col gap-8">
					<Container>
						<Heading size="sm">My subscriptions</Heading>
						<Text>Manage your subscriptions to creators.</Text>
					</Container>
					<Container className="flex flex-col divide-y">
						<SubscriptionListItem />
						<SubscriptionListItem />
					</Container>
				</Container>
			</Container>
		</Container>
	);
}

const SubscriptionListItem = () => {
	return (
		<Container
			className="flex items-center justify-between py-2"
			css={{borderColor: "$subtleBorder"}}
		>
			<Container className="flex gap-4">
				<UserAvatar
					value={"c"}
					size={40}
				/>
				<Container>
					<Container className="flex gap-2">
						<Text>Kamfeskaya</Text>
						<MutedText>@kamfeskaya</MutedText>
					</Container>
					<Container className="flex gap-2">
						<Heading size="sm">0.02BNB</Heading>
						<Text>
							next billing on, <ImportantText>Fri, 22 Dec</ImportantText>
						</Text>
					</Container>
				</Container>
			</Container>
			<Container>
				<Button>Cancel subscription</Button>
			</Container>
		</Container>
	);
};
