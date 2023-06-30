import {ConnectWalletButton} from "@components/NFTPage/BuyButton";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import Image from "next/future/image";

export default function Disconnected() {
	return (
		<Container className="flex flex-col items-center justify-center max-w-md gap-4 text-center mx-auto">
			<Image
				src={"/assets/graphics/500.png"}
				alt={"Empty state"}
				width={320}
				height={320}
				className="mb-8"
			/>
			<Heading size={"xss"}>
				Please make sure your wallet on the Binance Smart Chain is connected.
			</Heading>
			<ConnectWalletButton />
		</Container>
	);
}
