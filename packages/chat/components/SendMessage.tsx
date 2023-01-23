import {EmojiHappyIcon} from "@heroicons/react/outline";
import {PaperAirplaneIcon} from "@heroicons/react/solid";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {useRef, useState} from "react";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {styled} from "@styles/theme";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {useApplicationTheme} from "@packages/theme/provider";

const PopoverContent = styled(DropdownMenu.Content, {
	backgroundColor: "$surface",
	boxShadow: "$shadow",
	zIndex: 500,
});
const PopoverDemo = ({addEmoji}) => {
	const {theme} = useApplicationTheme();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<EmojiHappyIcon
					height={24}
					width={24}
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal className="relative z-50">
				<PopoverContent>
					<Picker
						data={data}
						theme={theme === "dark" ? "dark" : "light"}
						onEmojiSelect={addEmoji}
						previewPosition={"none"}
					/>
				</PopoverContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default function SendMessage({
	sendMessage,
}: {
	sendMessage: (text) => void;
}) {
	const messageInputRef = useRef(null);

	const [text, setText] = useState("");

	const submit = () => {
		setText("");
		sendMessage(text);
	};

	const addEmoji = (emoji) => {
		const cursor = messageInputRef.current.selectionStart;
		setText(`${text.slice(0, cursor)}${emoji.native}${text.slice(cursor)}`);

		const newCursor = cursor + emoji.length;
		setTimeout(
			() => messageInputRef.current.setSelectionRange(newCursor, newCursor),
			10
		);
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
				className="relative flex items-center w-full gap-4 p-4"
			>
				<Input
					className="w-full"
					placeholder="Send a message"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
					}}
					css={{padding: 0}}
					ref={messageInputRef}
				/>
				<PopoverDemo addEmoji={addEmoji} />
			</Container>
			<Container className="flex items-center justify-center flex-1 h-full">
				<Button
					onClick={submit}
					css={{borderRadius: "9999px", padding: "12px"}}
					appearance={text ? "surface" : "disabled"}
					disabled={!text}
					type="submit"
					className="relative transition-opacity duration-200"
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
