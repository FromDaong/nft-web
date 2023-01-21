import {PaperAirplaneIcon} from "@heroicons/react/solid";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Text} from "@packages/shared/components/Typography/Text";
import {sub} from "date-fns";
import {useState} from "react";

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
			<Input
				className="w-full px-4"
				placeholder="Send a message"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<Container className="flex items-center justify-center flex-1 h-full">
				<Button
					onClick={submit}
					css={{borderRadius: "9999px", padding: "12px"}}
					appearance={text ? "surface" : "disabled"}
					disabled={!text}
					type="submit"
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
