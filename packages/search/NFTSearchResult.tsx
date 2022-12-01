import {Blurhash as NativeBlurhash} from "react-blurhash";
import {Container} from "@packages/shared/components/Container";
import Link from "next/link";
import {MutedText, Text} from "@packages/shared/components/Typography/Text";

export type NFTSearchResultProps = {
	blurhash: string;
	post_id: string;
	collection_name: string;
	minted: number;
	totalSupply: number;
	price: {
		value: number;
		currency: string;
	};
};

export default function NFTSearchResult(props: NFTSearchResultProps) {
	return (
		<Link href={`/post/${props.post_id}`}>
			<a>
				<Container className="w-full flex justify-between items-center gap-8">
					<Container className="flex gap-4">
						<Container
							css={{
								height: "48px",
								width: "48px",
								borderRadius: "16px",
								overflow: "hidden",
							}}
						>
							<NativeBlurhash
								resolutionX={32}
								punch={1}
								resolutionY={32}
								height={"100%"}
								width={"100%"}
								hash={props.blurhash}
								style={{zIndex: 0}}
							/>
						</Container>
						<Container className="gap-2 flex-col">
							<Text>{props.collection_name}</Text>
							<Text>
								<MutedText>
									{props.minted}/{props.totalSupply} remaining
								</MutedText>
							</Text>
						</Container>
					</Container>
					<Container>
						<Text>
							{props.price.value} {props.price.currency}
						</Text>
					</Container>
				</Container>
			</a>
		</Link>
	);
}
