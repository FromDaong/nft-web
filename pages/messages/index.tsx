import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ChatPageLayout from "@packages/chat/components/ChatPageLayout";
import {useEffect, useState} from "react";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";

export default function Messages() {
	const [windowLoaded, setWindowLoaded] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setWindowLoaded(true);
		}
	}, []);

	return (
		<ApplicationLayout>
			<SEOHead title="Messages" />
			<ApplicationFrame>
				{windowLoaded && <ChatPageLayout />}{" "}
				{!windowLoaded && (
					<Container className="w-full h-full flex items-center justify-center">
						<Spinner />
					</Container>
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
