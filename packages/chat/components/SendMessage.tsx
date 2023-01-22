import {EmojiHappyIcon} from "@heroicons/react/outline";
import {PaperAirplaneIcon} from "@heroicons/react/solid";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {useState} from "react";
import * as Popover from "@radix-ui/react-popover";
import {styled} from "@styles/theme";

const PopoverContent = styled(Popover.Content, {
	padding: "8px",
	backgroundColor: "$surface",
	boxShadow: "$shadow",
});
const PopoverDemo = () => (
	<Popover.Root>
		<Popover.Trigger>
			<EmojiHappyIcon
				height={24}
				width={24}
			/>
		</Popover.Trigger>
		<Popover.Portal>
			<PopoverContent>Some more info…</PopoverContent>
		</Popover.Portal>
	</Popover.Root>
);

export default function SendMessage({
	sendMessage,
}: {
	sendMessage: (text) => void;
}) {
	const [text, setText] = useState("");
	const submit = () => {
		setText("");
		sendMessage(text);
	};
	return (
		<form className="flex items-center w-full gap-4">
			<Container
				css={{
					backgroundColor: "$inputSurface",
					color: "$textContrast",
					width: "100%",
					borderRadius: "8px",
				}}
				className="relative flex w-full gap-4 items-center p-4"
			>
				<Input
					className="w-full"
					placeholder="Send a message"
					value={text}
					onChange={(e) => setText(e.target.value)}
					css={{padding: 0}}
				/>
				<PopoverDemo />
			</Container>
			<Container className="flex items-center justify-center flex-1 h-full">
				<Button
					onClick={submit}
					css={{borderRadius: "9999px", padding: "12px"}}
					appearance={text ? "surface" : "disabled"}
					disabled={!text}
					type="submit"
					className="transition-opacity duration-200"
				>
					<PaperAirplaneIcon
						height={20}
						width={20}
						style={{
							transform: "rotate(45deg)",
						}}
					/>
				</Button>
			</Container>
		</form>
	);
}
