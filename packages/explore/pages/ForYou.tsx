import {Container} from "@packages/shared/components/Container";
import {NextPage} from "next";
import ExploreTabsButton from "../components/nav/ExploreTabsButton";

interface Props {}

const ForYou: NextPage<Props> = (props) => {
	return (
		<Container className="flex flex-col py-8">
			<Container className="flex justify-center">
				<ExploreTabsButton />
			</Container>
		</Container>
	);
};

export default ForYou;
