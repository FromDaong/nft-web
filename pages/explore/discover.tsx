import Discover from "@packages/explore/pages/Discover";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";

export default function DiscoverPage() {
	return (
		<Container>
			<SEOHead title={"Discover"} />
			<ApplicationFrame>
				<Discover />
			</ApplicationFrame>
		</Container>
	);
}
