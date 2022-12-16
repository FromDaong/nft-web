import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {MutedText} from "@packages/shared/components/Typography/Text";
import Avvvatars from "avvvatars-react";

export default function UserAvatar(props: {
	data?: {
		username: string;
		display_name?: string;
		avatar: string;
		bio?: string;
		closeFollowers?: Array<{
			username: string;
		}>;
	};
	size: number;
	value?: string;
}) {
	const {onOpen, isOpen, onClose} = useDisclosure();

	if (!props.data) {
		return (
			<Avvvatars
				border
				shadow
				size={props.size}
				value={props.value}
				style="shape"
			/>
		);
	}

	return (
		<Container className="relative">
			<Container onMouseEnter={onOpen}>
				<Avvvatars
					border
					shadow
					size={props.size}
					value={props.data?.username}
					style="shape"
				/>
			</Container>
			{isOpen && (
				<Container
					onMouseLeave={() => isOpen && onClose()}
					className="absolute top-0 left-0 flex shadow"
					css={{
						backgroundColor: "$elementSurface",
						borderRadius: "16px",
						padding: "16px",
						width: "280px",
						zIndex: 500,
					}}
				>
					<Container className="flex flex-col gap-4">
						<Container className="flex items-center justify-between">
							<Container>
								<Avvvatars
									border
									shadow
									size={props.size}
									value={props.data?.username}
									style="shape"
								/>
							</Container>
							<Container>
								<Button>Follow</Button>
							</Container>
						</Container>
						<Container className="flex flex-col gap-8">
							<Container>
								<Heading size="md">{props.data.display_name}</Heading>
								<Text>
									<MutedText>@{props.data.username}</MutedText>
								</Text>
							</Container>
							{props.data.bio && (
								<Container>
									<Text>{props.data.bio}</Text>
								</Container>
							)}
							<Container>
								{props.data.closeFollowers?.length > 0 ? (
									<></>
								) : (
									<Text>Not followed by anyone you follow.</Text>
								)}
							</Container>
						</Container>
					</Container>
				</Container>
			)}
		</Container>
	);
}

const DefaultAvatar = (props) => {
	return (
		<Container
			className="p-2 border-2 rounded-full shadow"
			css={{borderColor: "$teal9"}}
		>
			<OptimizedImage
				width={props.width ?? 32}
				height={props.height ?? 32}
				alt={props.name}
				src={props.src}
				className={"border-2 border-white rounded-full"}
			/>
		</Container>
	);
};
