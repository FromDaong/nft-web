import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";

function NFTCollection({item}) {
	return (
		<Link
			href={`/studio/collections/${item.href}`}
			key={item.href}
		>
			<a>
				<Container
					className="rounded-xl relative shadow col-span-1 overflow-hidden h-96 md:h-[320px] xl:h-[420px]"
					key={item.name}
					css={{
						background: `url("${item.cover_image}")`,
						backgroundSize: "cover",
					}}
				>
					<Container
						className={"p-8 flex flex-col justify-end w-full h-full"}
						css={{
							backgroundColor: "$overlay",
						}}
					>
						<Heading
							size={"md"}
							css={{
								color: "$white",
							}}
							className="mb-8"
						>
							{item.name}
						</Heading>
						<Divider dir={"horizontal"} />
						<Container className="flex gap-4 items-center">
							<Container className={"flex"}>
								<Container
									css={{
										background:
											"url('https://picsum.photos/seed/picsum/100/100')",
									}}
									className="h-8 aspect-square border-2 rounded-xl"
								/>
								<Container
									css={{
										background:
											"url('https://picsum.photos/seed/picsum/100/100')",
									}}
									className="h-8 aspect-square border-2 rounded-xl -ml-2"
								/>
								<Container
									css={{
										background:
											"url('https://picsum.photos/seed/picsum/100/100')",
									}}
									className="h-8 aspect-square border-2 rounded-xl -ml-2"
								/>
								<Container
									css={{
										background:
											"url('https://picsum.photos/seed/picsum/100/100')",
									}}
									className="h-8 aspect-square border-2 rounded-xl -ml-3"
								/>
							</Container>

							<Heading
								size={"xss"}
								css={{
									color: "$white",
								}}
							>
								12 NFTs
							</Heading>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
}

export default NFTCollection;
