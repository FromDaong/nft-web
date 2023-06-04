import StudioNavigation, {
	TabNavigationLink,
} from "@components/CreatorDashboard/StudioNavigation";
import CreatedNFTsTable from "@components/CreatorDashboard/nfts/CreatedNFTsTable";
import {
	ChatAlt2Icon,
	PaperAirplaneIcon,
	PlusIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {useContracts} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {BoldLink} from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {useAccount} from "wagmi";

const useMyResaleListings = () => {
	const {address} = useAccount();
	const {treatMarketplaceReaderContract} = useContracts();

	console.log({treatMarketplaceReaderContract});
};

export default function ResalePage() {
	const resale = useMyResaleListings();
	return (
		<ApplicationLayout>
			<StudioNavigation />
			<ApplicationFrame>
				<Container className="flex flex-col gap-2 mt-8">
					<Heading size={"sm"}>Resale listings</Heading>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
