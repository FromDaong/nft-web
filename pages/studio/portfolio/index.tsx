import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {PaperAirplaneIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import ListForSaleIcon from "@packages/shared/icons/ListForSale";
import Spinner from "@packages/shared/icons/Spinner";
import {ABI} from "@packages/treat/lib/abi";
import {treatNFTMinterContract} from "@packages/treat/lib/contract-defs";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {apiEndpoint} from "@utils/index";
import web3 from "@utils/web3";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useUser} from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useEffect} from "react";
import {useAccount} from "wagmi";

export default function PortfolioPage() {
	//const balances = treatNFTMinterContract.functions.balanceOfBatch([""], [""]);
	const {profile} = useUser();

	return (
		<ApplicationLayout>
			<StudioNavigation />
			<ApplicationFrame>
				<Container
					css={{borderColor: "$border"}}
					className="flex justify-between gap-4 mt-8 flex-col md:flex-row"
				>
					<Heading size={"sm"}>Portfolio</Heading>
					<Container className={"flex gap-2"}>
						<Button appearance={"surface"}>
							Send
							<PaperAirplaneIcon className="w-5 h-5 rotate-90" />
						</Button>
						<Button appearance={"surface"}>
							<ListForSaleIcon className="w-5 h-5" />
							List for resale
						</Button>
					</Container>
				</Container>
				<Container className="flex items-center justify-center">
					{!profile && <Spinner />}
					{profile && <PortfolioNFTsPresenter username={profile.username} />}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const PortfolioNFTsPresenter = ({username}) => {
	const {address} = useAccount();
	return <Container className="grid grid-cols-4 gap-8 mt-8"></Container>;
};
