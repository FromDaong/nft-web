import * as Tabs from "@radix-ui/react-tabs";
import PersonalInformationForm, {LinksForm} from "../ProfileForms";
import {Divider} from "@packages/shared/components/Divider";
import CollectedItems from "../collectedItems";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {Heading} from "@packages/shared/components/Typography/Headings";
import NotificationPreferences from "../NotificationsPreferences";
import SettingsAndPrivacy from "../SettingsAndPrivacy";
import WalletPreferences from "../WalletPreferences";
import {useState} from "react";

export default function ProfileTabs() {
	const [selected, setSelected] = useState("personal");
	return (
		<Container>
			<Tabs.Root
				className="TabsRoot"
				defaultValue="personal"
				onValueChange={(value) => setSelected(value)}
			>
				<Tabs.TabsList className="flex gap-8">
					<Tabs.Trigger value="personal">
						<Text
							css={{color: selected === "personal" ? "$textContrast" : "$text"}}
						>
							<ImportantText>Profile</ImportantText>
						</Text>
					</Tabs.Trigger>
					<Tabs.Trigger value="wallet">
						<Text
							css={{color: selected === "wallet" ? "$textContrast" : "$text"}}
						>
							<ImportantText>Wallet & Subscriptions</ImportantText>
						</Text>
					</Tabs.Trigger>
					<Tabs.Trigger value="notifications">
						<Text
							css={{
								color: selected === "notifications" ? "$textContrast" : "$text",
							}}
						>
							<ImportantText>Notifications</ImportantText>
						</Text>
					</Tabs.Trigger>
					<Tabs.Trigger value="security">
						<Text
							css={{color: selected === "security" ? "$textContrast" : "$text"}}
						>
							<ImportantText>Security</ImportantText>
						</Text>
					</Tabs.Trigger>
				</Tabs.TabsList>
				<Divider dir="horizontal" />
				<Container className="pt-8">
					<Tabs.Content value="personal">
						<Container className="flex flex-col gap-12">
							<PersonalInformationForm />
							<LinksForm />
						</Container>
					</Tabs.Content>
					<Tabs.Content value="wallet">
						<Container className="flex flex-col gap-12">
							<WalletPreferences />
						</Container>
					</Tabs.Content>
					<Tabs.Content value="notifications">
						<Container className="flex flex-col gap-12">
							<NotificationPreferences />
						</Container>
					</Tabs.Content>
					<Tabs.Content value="security">
						<Container className="flex flex-col gap-12">
							<SettingsAndPrivacy />
						</Container>
					</Tabs.Content>
				</Container>
			</Tabs.Root>
		</Container>
	);
}
