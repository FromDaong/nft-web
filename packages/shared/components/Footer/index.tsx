import {styled} from "@styles/theme";
import {ReactNode} from "react";
import {Heading} from "../Typography/Headings";
import {BoldLink} from "../Typography/Text";

const Ul = styled("ul", {
	display: "flex",
	flexDirection: "column",
	gap: "8px",
});

const ListLinkItem = ({
	href,
	children,
	...rest
}: {
	href: string;
	children: ReactNode;
	target?: string;
	rel?: string;
}) => (
	<li>
		<a
			{...rest}
			href={href}
		>
			{children}
		</a>
	</li>
);

const FooterComponent = styled("footer", {
	borderTop: "1px solid $subtleBorder",
});

export default function Footer() {
	return (
		<FooterComponent className="w-full px-4 pt-16 border-t md:px-8 ">
			<div className="grid container grid-cols-1 gap-8 mx-auto md:grid-cols-4">
				<div className="col-span-1">
					<img
						src={"/assets/hero-logo.png"}
						alt=""
						className="logo w-100"
						style={{maxWidth: 150}}
					/>
				</div>
				<div className="col-span-1 flex flex-col gap-4">
					<Heading
						size="xs"
						className="mb-2 md:mb-4"
					>
						$TREAT
					</Heading>
					<Ul className="gap-2 list-unstyled text-small">
						<ListLinkItem
							target="_blank"
							rel="noreferrer"
							href="https://docs.google.com/gview?url=https://github.com/TreatDAO/litepaper/raw/main/TreatPaperFinal.pdf&embedded=true"
						>
							<BoldLink css={{color: "$text"}}>Litepaper</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							target="_blank"
							rel="noreferrer"
							href="https://pancakeswap.finance/swap?inputCurrency=0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f"
						>
							<BoldLink css={{color: "$text"}}>Swap Tokens</BoldLink>
						</ListLinkItem>
						<ListLinkItem href={"/sweetshop"}>
							<BoldLink css={{color: "$text"}}>Purchase NFTs</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							href="https://www.coingecko.com/en/coins/treatdao-v2"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>CoinGecko</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							target="_blank"
							rel="noreferrer"
							href="https://coinmarketcap.com/en/currencies/treat-dao-new/"
						>
							<BoldLink css={{color: "$text"}}>CoinMarketCap</BoldLink>
						</ListLinkItem>
					</Ul>
				</div>
				<div className="col-span-1 flex flex-col gap-4">
					<Heading
						size="xs"
						className="mb-2 md:mb-4"
					>
						Social Media
					</Heading>
					<Ul className="list-unstyled text-small">
						<ListLinkItem
							href="https://t.me/TreatDAO"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>Telegram</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							href="https://twitter.com/treatdao"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>Twitter</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							href="https://www.instagram.com/treat.dao/"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>Instagram</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							href="https://www.tiktok.com/@treatdao"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>TikTok</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							href="https://treatdao.medium.com/"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>Medium</BoldLink>
						</ListLinkItem>
					</Ul>
				</div>
				<div className="col-span-1 flex flex-col gap-4">
					<Heading
						size="xs"
						className="mb-2 md:mb-4"
					>
						Resources
					</Heading>
					<Ul className="list-unstyled text-small">
						<ListLinkItem
							href="https://help.treatdao.com/"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>Help Center</BoldLink>
						</ListLinkItem>
						<ListLinkItem
							href="https://www.bonfire.com/store/treatdao-merch/"
							target="_blank"
							rel="noreferrer"
						>
							<BoldLink css={{color: "$text"}}>Merch Store</BoldLink>
						</ListLinkItem>
						<ListLinkItem href="https://treatdao.com">
							<BoldLink css={{color: "$text"}}>About</BoldLink>
						</ListLinkItem>
						<ListLinkItem href="/privacy">
							<BoldLink css={{color: "$text"}}>Privacy Policy</BoldLink>
						</ListLinkItem>
						<ListLinkItem href="/tos">
							<BoldLink css={{color: "$text"}}>Terms of Service</BoldLink>
						</ListLinkItem>
					</Ul>
				</div>
			</div>
		</FooterComponent>
	);
}
