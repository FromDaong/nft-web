import {Container} from "@packages/shared/components/Container";
import ExploreTabsButton from "../components/nav/ExploreTabsButton";

export default function Discover() {
	return (
		<Container className="flex flex-col py-8">
			<Container className="flex justify-center">
				<ExploreTabsButton />
			</Container>
		</Container>
	);
}
