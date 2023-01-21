import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ChatContainer from "@packages/chat/components/ChatContainer";
import ChatPageLayout from "@packages/chat/components/ChatPageLayout";

export default function Chat() {
	return (
		<ApplicationLayout>
			<SEOHead title="Messages" />
			<ApplicationFrame>
				<ChatPageLayout hideListInMobile>
					<ChatContainer />
				</ChatPageLayout>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
