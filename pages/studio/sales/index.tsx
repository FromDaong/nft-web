import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {Container} from "@packages/shared/components/Container";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function AnalyticsPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="py-4 md:pt-0 px-4 lg:px-0 flex flex-col gap-4 border-b"
					css={{borderColor: "$border"}}
				>
					<Container className="flex justify-between items-baseline">
						<StudioNavigation />
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
