import {ArrowRightIcon, FilterIcon, SearchIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {useState} from "react";
import {Button} from "@packages/shared/components/Button";
import {ImageIcon} from "@radix-ui/react-icons";
import UserAvatar from "core/auth/components/Avatar";
import FilterNFTResultsModal from "@packages/modals/FilterNFTResultsModal";
import {useDisclosure} from "@packages/hooks";

export function ExpandableSearch() {
	const [focused, setFocused] = useState(false);
	const {onOpen, isOpen, onClose} = useDisclosure();

	const toggleFocus = () => {
		setFocused(!focused);
	};

	return (
		<Container className="relative w-full flex justify-center  min-h-[40px]">
			{focused && (
				<Container
					className="fixed top-0 left-0 w-screen h-screen"
					css={{backgroundColor: "#00000052", zIndex: 5000}}
					onClick={toggleFocus}
				/>
			)}
			<Container
				className={`
                        w-full border max-w-md transition-all group duration-150
                        focus-within:border-gray-200/50 shadow-sm
                        focus-within:max-w-xl group-focus-within:max-w-xl absolute overflow-x-hidden divide-y
                    `}
				css={{
					zIndex: focused ? 5500 : 0,
					backgroundColor: "$elementSurface",
					borderRadius: focused ? "12px" : "28px",
				}}
			>
				<Container className="flex items-center justify-between w-full gap-4 px-4 divide-x">
					<Container className="flex items-center justify-between flex-1">
						<input
							className={`flex-1 ${focused ? "px-4 py-2" : "px-0 py-2"}`}
							placeholder="Search"
							onFocus={toggleFocus}
						/>
						<MutedText>
							<SearchIcon
								className="flex-shrink-0"
								height={16}
								width={16}
							/>
						</MutedText>
					</Container>
				</Container>
				{focused && (
					<Container className="flex flex-col gap-1 py-2 divide-y">
						<Container className="flex flex-col gap-2 py-2">
							<Container className="flex justify-between px-8">
								<MutedText>
									<SmallText>Content</SmallText>
								</MutedText>
								<Text>
									<ImportantText>View all</ImportantText>
								</Text>
							</Container>
							<Container className="flex flex-col px-4">
								{[
									"Christmas speci",
									"Christmas specials from TreatDAO",
									"Christmas specials Trit TOTM",
								].map((text, i) => (
									<AutocompleteSearchHit
										text={text}
										key={i}
									/>
								))}
							</Container>
						</Container>
						<Container className="flex flex-col gap-2 py-2">
							<MutedText className="px-8 pt-2">
								<SmallText>I am searching for</SmallText>
							</MutedText>
							<Container className="flex flex-wrap gap-4 px-8">
								<Button
									appearance={"outline"}
									css={{
										borderRadius: "9999px",
										padding: "4px 8px",
										color: "$text",
										borderColor: "$subtleBorder",
									}}
									className="shadow-sm"
								>
									<SmallText>Everything</SmallText>
								</Button>
								<Button
									appearance={"outline"}
									css={{
										borderRadius: "9999px",
										padding: "4px 8px",
										color: "$text",
										borderColor: "$subtleBorder",
									}}
									className="shadow-sm"
								>
									<SmallText>People</SmallText>
								</Button>
								<Button
									appearance={"outline"}
									css={{
										borderRadius: "9999px",
										padding: "4px 8px",
										color: "$text",
										borderColor: "$subtleBorder",
									}}
									className="shadow-sm"
								>
									<SmallText>NFTs</SmallText>
								</Button>
								<Button
									appearance={"outline"}
									css={{
										borderRadius: "9999px",
										padding: "4px 8px",
										color: "$text",
										borderColor: "$subtleBorder",
									}}
									className="shadow-sm"
								>
									<SmallText>Subscription NFTs</SmallText>
								</Button>

								<Button
									appearance={"outline"}
									css={{
										borderRadius: "9999px",
										padding: "4px 8px",
										color: "$text",
										borderColor: "$subtleBorder",
									}}
									className="shadow-sm"
								>
									<SmallText>Free NFTs</SmallText>
								</Button>
							</Container>
						</Container>
						<Container className="flex flex-col gap-2 py-2">
							<Container className="flex flex-col px-4">
								{["Christmas speci", "Christmas specials from TreatDAO"].map(
									(text, i) => (
										<SearchHit
											text={text}
											key={i}
											type={"profile"}
										/>
									)
								)}
							</Container>
						</Container>
					</Container>
				)}
			</Container>
		</Container>
	);
}

const AutocompleteSearchHit = ({text}) => {
	return (
		<Container className="flex justify-between px-4 py-2 rounded-xl hover:bg-gray-100">
			<Text className="line-clamp-1">
				<ImportantText>{text}</ImportantText>
			</Text>
			<Button appearance={"unstyled"}>
				<ArrowRightIcon
					height={16}
					width={16}
				/>
			</Button>
		</Container>
	);
};

const SearchHit = ({text, type}) => {
	return (
		<Container className="flex gap-4 px-4 py-2 rounded-xl hover:bg-gray-100">
			{type === "profile" && (
				<UserAvatar
					size={20}
					username={text}
				/>
			)}

			{type === "nft" && (
				<Button appearance={"unstyled"}>
					<ImageIcon
						height={16}
						width={16}
					/>
				</Button>
			)}

			<Text className="line-clamp-1">
				<ImportantText>{text}</ImportantText>
			</Text>
		</Container>
	);
};
