import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import Card from "@packages/shared/components/Card";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import Link from "next/link";

const cards_info = [
	{
		label: "Instant Withdrawals",
		icon: "",
		text: "Unlike other platforms, we don’t hold your money: forget about “pending funds” and withdrawal delays!",
	},
	{
		label: "Help Build Your Platform",
		text: "Hold $TREAT and make decisions about the direction of the platform: features, updates, rules, etc.",
		icon: "",
	},
	{
		label: "Uncapped Earning Potential",
		icon: "",
		text: "No maximum limit on how much you can earn or charge. Take control of your content and audience.",
	},
];

export default function About() {
	return (
		<div className="mx-auto container">
			<SEOHead title={"Treat - About Us"} />
			<div className="max-w-4xl p-4 mx-auto lg:p-0">
				<div className="flex flex-col max-w-3xl py-16 mx-auto">
					<h6 className="mb-1 text-sm font-medium text-gray-600">Legal copy</h6>
					<h1 className="mt-0 mb-1 text-3xl font-medium tracking-tight">
						About the Treat Platform and TreatDAO
					</h1>
					<p className="mt-0 text-gray-500">
						Your privacy is important to us at Treat. We respect your privacy
						regarding any information we may collect from you across our
						website.
					</p>
				</div>
			</div>
			<div className="max-w-3xl p-4 mx-auto lg:p-0 h-[360px] relative">
				<OptimizedImage
					layout="fill"
					alt="About TreatDAO"
					src="/assets/models_about.webp"
				/>
			</div>
			<div className="flex flex-col items-center gap-16 py-12 lg:gap-24">
				<p className="max-w-3xl">
					Welcome to TreatDAO - a place where you can mint and sell your
					private, limited NFTs. Create SFW and NSFW content tailored to your
					community with our simplified tools. Get paid for your initial sales
					and enjoy recurring revenue with secondary market sales. Every time
					your content gets sold or exchanged between collectors on our
					platform; you earn a share of that sale!
				</p>
				<div className="grid grid-cols-3 gap-8">
					{cards_info.map((card) => (
						<Card
							key={card.label}
							className="col-span-3 p-4 border lg:col-span-1"
						>
							<h3 className="mb-2 text-xl font-medium tracking-tight text-slate-900">
								{card.label}
							</h3>
							<p>{card.text}</p>
						</Card>
					))}
				</div>
				<div className="max-w-3xl">
					<h3 className="mb-2 text-3xl font-medium tracking-tight text-gray-900">
						The DAO
					</h3>
					<p>
						Now you know about the treats, but what about The DAO? DAO stands
						for Decentralized Autonomous Organization - we don’t have board
						members or a central office. What we do have is a community of
						like-minded people who are working together to make TreatDAO
						possible. The only requirement to be a part of the community is to
						hold $TREAT tokens. Once you hold our token you get to have a voice
						when it comes to making major decisions, introducing new features,
						or choosing new partnerships.
					</p>
				</div>
				<div className="max-w-3xl">
					<h3 className="mb-2 text-3xl font-medium tracking-tight text-gray-900">
						$TREAT Token
					</h3>
					<p>
						TreatDAO is the first platform that allows creators and consumers to
						have a voice when it comes to the platform development, terms of
						service, and all other decisions. This has been made possible thanks
						to the introduction of $TREAT token which can be used to make
						governing decisions. The more tokens you own, the more voting power
						you get. $TREAT was fairly distributed to the initial community
						members to avoid exploits and level out the playing field. To
						purchase $TREAT tokens, you can use one of the following DEXes and
						exchanges:
					</p>
					<div className="mt-8">
						<Link href={"/dex/ramp"}>
							<a>
								<Button className="flex gap-4 border border-gray-600">
									Buy Crypto
									<ArrowRightIcon className="w-5 h-5" />
								</Button>
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
