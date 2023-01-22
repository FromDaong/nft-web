import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ChatContainer from "@packages/chat/components/ChatContainer";
import ChatPageLayout from "@packages/chat/components/ChatPageLayout";
import {NextPageContext} from "next";

export default function Chat({username, contact}) {
	return (
		<ApplicationLayout>
			<SEOHead title="Messages" />
			<ApplicationFrame>
				<ChatPageLayout hideListInMobile>
					<ChatContainer
						username={username}
						contact={contact}
					/>
				</ChatPageLayout>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	console.log(ctx.query);
	return {
		props: {
			username: ctx.query.chat_id.split("-")[0],
			contact: ctx.query.chat_id.split("-")[1],
		},
	};
};
