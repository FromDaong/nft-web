import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import TreatCore from "core/TreatCore";
import Link from "next/link";

type Trend = {
	topic: string;
	channel?: string;
	totalPosts: number;
};

export default function PromotedSection(props: {data: Array<Trend>}) {
	return (
		<Container
			css={{backgroundColor: "$elementOnSurface", borderRadius: "16px"}}
			className="grid grid-cols-1 gap-4"
		>
			<Container className="p-2">
				<Text>
					<MutedText>Currently trending</MutedText>
				</Text>
			</Container>
			{props.data.map((trend) => (
				<TrendingItem
					key={trend.topic}
					{...trend}
				/>
			))}
		</Container>
	);
}

const TrendingItem = (props: Trend) => {
	return (
        (<Link href={""}>

            <Container className="py-2 px-4 w-full">
                <p>
                    <MutedText>
                        <SmallText>{props.channel}</SmallText>
                    </MutedText>
                </p>
                <p>
                    <Heading size="xs">{props.topic}</Heading>
                </p>
                <p>
                    <MutedText>
                        <SmallText>
                            {TreatCore.getFormattedNumber(props.totalPosts)} Trits
                        </SmallText>
                    </MutedText>
                </p>
            </Container>

        </Link>)
    );
};
