// @ts-nocheck

import ActivityItem from "@components/CreatorDashboard/Activity/Item";
import NFTCollection from "@components/CreatorDashboard/NFTCollection";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {FilmIcon} from "@heroicons/react/solid";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {
	ArrowRightIcon,
	ExternalLinkIcon,
	PlusIcon,
	StackIcon,
} from "@radix-ui/react-icons";
import Avvvatars from "avvvatars-react";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";

export default function TreatCreatorStudio() {
	return (
		<ApplicationLayout>
			<StudioNavigation />

			<ApplicationFrame>
				<Container className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
					<Container
						className="grid grid-cols-1 md:grid-cols-2 col-span-1 p-8 shadow-sm border rounded-xl"
						css={{
							background: "$surfaceOnSurface",
							borderColor: "$border",
							backgroundRepeat: "no-repeat",
							backgroundSize: "contain",
							backgroundPosition: "bottom right",
						}}
					>
						<Container className="flex flex-col col-span-1 gap-8">
							<Container className="flex items-center gap-2">
								<Heading size={"xss"}>
									<StackIcon className="w-8 h-8" />
								</Heading>
								<Heading size={"xss"}>Collections</Heading>
							</Container>
							<Heading
								size={"md"}
								className={"lg:max-w-[320px]"}
							>
								Sell your NFTs on the sweetshop.
							</Heading>

							<Container className="mt-auto">
								<Link href={"/create"}>
									<a>
										<Button css={{borderRadius: "9999px"}}>
											Create a new collection <ArrowRightIcon />
										</Button>
									</a>
								</Link>
							</Container>
						</Container>
						<Container></Container>
					</Container>
					<Container
						className="flex flex-col col-span-1 gap-8 p-8 rounded-xl border"
						css={{background: "$surfaceOnSurface", borderColor: "$border"}}
					>
						<Heading size={"xs"}>Analytics</Heading>
						<Container className="flex flex-col gap-2">
							<Text>
								<ImportantText>Total sales</ImportantText>
							</Text>
							<Heading size={"sm"}>$480.20</Heading>
							<SmallText>
								<ImportantText>1.0922 BNB</ImportantText>
							</SmallText>
						</Container>
						<Divider dir={"horizontal"} />
						<Container className="flex flex-col gap-2">
							<Heading size={"xss"}>Summary</Heading>
							<table className="table-fixed">
								<tbody>
									<tr>
										<td>
											<Text>Revenue</Text>
										</td>
										<td>
											<Text>
												<ImportantText>
													${Intl.NumberFormat().format(3621)}
												</ImportantText>
											</Text>
										</td>
									</tr>
									<tr>
										<td>
											<Text>Followers</Text>
										</td>
										<td>
											<Text>
												<ImportantText>
													{Intl.NumberFormat().format(2354)}
												</ImportantText>
											</Text>
										</td>
									</tr>
									<tr>
										<td>
											<Text>Views</Text>
										</td>
										<td>
											<Text>
												<ImportantText>
													{Intl.NumberFormat().format(744543)}
												</ImportantText>
											</Text>
										</td>
									</tr>
								</tbody>
							</table>
						</Container>
					</Container>
					<Container
						className="flex flex-col col-span-1 gap-8 p-8 rounded-xl border"
						css={{background: "$surfaceOnSurface", borderColor: "$border"}}
					>
						<Container className={"flex justify-between"}>
							<Heading size={"xs"}>Sales</Heading>
							<Link href={"/studio/sales"}>
								<a>
									<ImportantText
										css={{color: "$accentText", display: "flex"}}
										className={"items-center gap-2"}
									>
										View all <ArrowRightIcon />
									</ImportantText>
								</a>
							</Link>
						</Container>
						<Container className={"flex flex-col gap-4"}>
							<SalesItem />
							<SalesItem />
							<SalesItem />
							<SalesItem />
						</Container>
					</Container>
					<Container
						className="flex flex-col col-span-1 gap-8 p-8 rounded-xl border"
						css={{background: "$surfaceOnSurface", borderColor: "$border"}}
					>
						<Container className={"flex justify-between"}>
							<Heading size={"xs"}>Activity</Heading>
							<Link href={"/studio/activity"}>
								<a>
									<ImportantText
										css={{color: "$accentText", display: "flex"}}
										className={"items-center gap-2"}
									>
										View all <ArrowRightIcon />
									</ImportantText>
								</a>
							</Link>
						</Container>
						<Container>
							{[
								{
									id: "123",
									verb: "sale",
									actor: {
										display_name: "0x009...0383",
										username: "0x009...938",
									},
									subject: {
										name: "So cool are the Waves",
										href: "0x0290328390280",
										id: "0x0290328390280",
										price: 1.082,
									},
									timestamp: new Date().getTime(),
								},
								{
									id: "1223",
									verb: "like",
									actor: {
										display_name: "0x009...0383",
										username: "0x009...938",
									},
									subject: {
										name: "Halfstack",
										href: "0x0290328390280",
										id: "0x0290328390280",
									},
									timestamp: new Date().getTime(),
								},
								{
									id: "12423",
									verb: "sale",
									actor: {
										display_name: "0x009...0383",
										username: "0x009...938",
									},
									subject: {
										name: "So cool are the Waves",
										href: "0x0290328390280",
										id: "0x0290328390280",
										price: 1.082,
									},
									timestamp: new Date().getTime(),
								},
								{
									id: "13223",
									verb: "sale",
									actor: {
										display_name: "Halfstack Developer",
										username: "0x009...938",
									},
									subject: {
										name: "Lady of The East",
										href: "0x0290328390280",
										id: "0x0290328390280",
										price: 1.082,
									},
									timestamp: new Date().getTime(),
								},
							].map((item) => (
								<ActivityItem
									key={item.id}
									{...item}
								/>
							))}
						</Container>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

function SalesItem() {
	return (
		<Container className="flex flex-col gap-2">
			<Container className={"flex justify-between"}>
				<Container className={"flex gap-4"}>
					<Avvvatars
						style="shape"
						value={"chris"}
						size={32}
						radius={6}
					/>
					<Container>
						<Heading size={"xss"}>Mother of Beauty</Heading>
						<Text>0x093721 &bull; 28 days ago</Text>
						<Button
							appearance={"surface"}
							size={"sm"}
							className="mt-2"
						>
							View on Bscscan <ExternalLinkIcon />
						</Button>
					</Container>
				</Container>
				<Container className={"flex gap-1"}>
					<Heading size={"xss"}>1.028 BNB</Heading>
				</Container>
			</Container>
		</Container>
	);
}
