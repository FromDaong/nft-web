import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {BoldIcon, ItalicIcon, UnderlineIcon} from "lucide-react";

const Tiptap = (props) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: "",
		onUpdate(blurProps) {
			if (blurProps.editor.getText().trim().length === 0)
				props.onError("Description cannot be empty");
			props.onChange(blurProps.editor.getJSON());
		},
	});

	return (
		<Container className="flex flex-col gap-2">
			<Container className="flex flex-row gap-2 rounded-lg">
				<Button
					appearance={"surface"}
					css={{padding: "4px"}}
				>
					<BoldIcon className="w-5 h-5" />
				</Button>
				<Button
					appearance={"surface"}
					css={{padding: "4px"}}
				>
					<ItalicIcon className="w-5 h-5" />
				</Button>
				<Button
					appearance={"surface"}
					css={{padding: "4px"}}
				>
					<UnderlineIcon className="w-5 h-5" />
				</Button>
			</Container>
			<Container
				className="rounded-xl p-2"
				css={{backgroundColor: "$surface"}}
			>
				<EditorContent
					editor={editor}
					onChange={console.log}
					value={props.value}
				/>
			</Container>
		</Container>
	);
};

export default Tiptap;
