import * as Tabs from "@radix-ui/react-tabs";
import PersonalInformationForm, {LinksForm} from "../ProfileForms";
import {Divider} from "@packages/shared/components/Divider";
import CollectedItems from "../collectedItems";
import {Container} from "@packages/shared/components/Container";

export default function ProfileTabs() {
	return (
		<Container>
			<Tabs.Root
				className="TabsRoot"
				defaultValue="settingsTab"
			>
				<Tabs.TabsList>
					<Tabs.Trigger
						className="px-4"
						value="settingsTab"
					>
						Settings
					</Tabs.Trigger>
					<Tabs.Trigger
						className="px-4"
						value="collected"
					>
						Collected
					</Tabs.Trigger>
				</Tabs.TabsList>
				<Divider dir="horizontal" />
				<Tabs.Content value="settingsTab">
					<Container className="flex flex-col gap-12">
						<PersonalInformationForm />
						<LinksForm />
					</Container>
				</Tabs.Content>
				<Tabs.Content value="collected">
					<CollectedItems />
				</Tabs.Content>
			</Tabs.Root>
		</Container>
	);
}
