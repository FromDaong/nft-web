// Shows followers and the people you follow
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {PencilIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function CommunityPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="flex flex-col gap-4 px-4 py-4 border-b md:pt-0 lg:px-0"
					css={{borderColor: "$border"}}
				>
					<Container className="flex items-baseline justify-between"></Container>
				</Container>
				<Container className="flex justify-between pt-8 ">
					<Heading size={"md"}>Community</Heading>
				</Container>
				<Divider dir={"horizontal"} />
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
