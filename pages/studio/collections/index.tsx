import NFTCollection from "@components/CreatorDashboard/NFTCollection";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {PlusIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useUser} from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useAccount} from "wagmi";

export default function CollectionsPage() {
	const {isLoading, creator} = useUser();

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="flex flex-col gap-4 px-4 py-4 md:pt-0 lg:px-0"
					css={{borderColor: "$border"}}
				>
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
				</Container>
				<Container className="flex flex-col gap-8 py-8">
					<Container className="flex justify-between">
						<Heading size={"md"}>Collections</Heading>
						<Link href={"/create"}>
							<a>
								<Button>
									<PlusIcon className="w-5 h-5" /> Create new collection
								</Button>
							</a>
						</Link>
					</Container>
					{!isLoading && creator && <CollectionsPresentation />}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const CollectionsPresentation = () => {
	// fetch nfts from /api/v3/marketplace/collections/
	// store them as collections
	// use react-query
	const {creator} = useUser();
	const {
		data: collections,
		isLoading,
		isError,
		error,
	} = TreatCore.useQuery([`collection:${creator._id}`], async () => {
		const {data} = await axios.get(
			`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/marketplace/collection/seller/${creator._id}`
		);
		return data.data.map((item) => ({
			name: item.name,
			cover_image: item.cover_image ?? "/assets/bg.jpg",
			creator: item.creator,
			href: item._id,
		}));
	});
	return (
		<Container className="grid grid-cols-1 gap-8 md:grid-cols-4">
			{!isLoading &&
				!isError &&
				collections.map((item) => (
					<NFTCollection
						item={item}
						key={item.href}
					/>
				))}
		</Container>
	);
};
