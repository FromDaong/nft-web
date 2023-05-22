import NFTCollection from "@components/CreatorDashboard/NFTCollection";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {PlusIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";

export default function CollectionsPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="py-4 md:pt-0 px-4 lg:px-0 flex flex-col gap-4"
					css={{borderColor: "$border"}}
				>
					<Container className="flex justify-between items-baseline">
						<StudioNavigation />
					</Container>
				</Container>
				<Container className="flex flex-col gap-8 py-8">
					<Container className="flex justify-between">
						<Heading size={"md"}>Collections</Heading>
						<Link href={"/create"}>
							<a>
								<Button appearance={"surface"}>
									<PlusIcon className="w-5 h-5" /> Create new collection
								</Button>
							</a>
						</Link>
					</Container>
					<Container className="grid grid-cols-1 md:grid-cols-4 gap-8">
						{[
							{
								name: "TreatDAO Legacy NFTs",
								cover_image: "https://picsum.photos/seed/picsum/720/720",
								creator: "#fhhfj",
								href: "9032932903",
							},
							{
								name: "TreatDAO Legacy NFTs",
								cover_image: "https://picsum.photos/seed/picsum/720/720",
								creator: "#fhhfj",
								href: "90329324903",
							},
							{
								name: "TreatDAO Legacy NFTs",
								cover_image: "https://picsum.photos/seed/picsum/720/720",
								creator: "#fhhfj",
								href: "90329329033",
							},
							{
								name: "TreatDAO Legacy NFTs",
								cover_image: "https://picsum.photos/seed/picsum/720/720",
								creator: "#fhhfj",
								href: "90329329e03",
							},
						].map((item) => (
							<NFTCollection
								item={item}
								key={item.href}
							/>
						))}
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
