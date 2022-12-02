import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import SettingsBanner from "packages/settings/components/SettingsBanner/settingsBanner";
import Tabs from "packages/settings/components/SettingsTabs";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";

// TODO: Use intersection observer to change navbar color.

export default function Index() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="grid grid-cols-1 gap-8 pt-8">
					<Tabs />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
