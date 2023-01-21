import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ChatPageLayout from "@packages/chat/components/ChatPageLayout";

export default function Messages() {
	return (
		<ApplicationLayout>
			<SEOHead title="Messages" />
			<ApplicationFrame>
				<ChatPageLayout />
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
