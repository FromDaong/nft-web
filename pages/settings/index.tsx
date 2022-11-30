import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import SettingsBanner from "@packages/settings/components/SettingsBanner/settingsBanner";
import Tabs from "@packages/settings/components/SettingsTabs";

// TODO: Use intersection observer to change navbar color.

export default function Index() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SettingsBanner />
				<Tabs />
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
