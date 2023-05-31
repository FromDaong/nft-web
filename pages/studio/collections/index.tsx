import {StudioCollectionsPresentation} from "@components/Collections/CollectionsPresentation/CollectionsForStudio";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {PlusIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {useUser} from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";

export default function CollectionsPage() {
	const {isLoading, creator} = useUser();

	return (
		<ApplicationLayout>
			<StudioNavigation />
			<ApplicationFrame>
				<Container className="flex flex-col gap-8 py-8">
					<Container className="flex flex-col gap-4 md:flex-row justify-between">
						<Heading size={"md"}>Collections</Heading>
						<Link href={"/create"}>
							<a>
								<Button>
									<PlusIcon className="w-5 h-5" /> Create new collection
								</Button>
							</a>
						</Link>
					</Container>
					{!isLoading && creator && <StudioCollectionsPresentation />}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
