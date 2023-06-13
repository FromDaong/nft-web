import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {BoldIcon, ItalicIcon} from "lucide-react";

const Tiptap = (props: {
	onError: (error: string) => void;
	onChange: (value: any) => void;
	initialValue?: object;
}) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: props.initialValue ?? {},
		onUpdate(blurProps) {
			if (blurProps.editor.getText().trim().length === 0)
				props.onError("Description cannot be empty");
			props.onChange(blurProps.editor.getJSON());
		},
	});

	if (!editor) return null;

	return (
		<Container
			css={{backgroundColor: "$surfaceOnSurface"}}
			className="flex flex-col gap-2 rounded-xl p-2 w-full"
		>
			<Container className="flex flex-row gap-2 rounded-lg">
				<Button
					appearance={editor.isActive("bold") ? "action" : "subtle"}
					css={{padding: "4px"}}
					type={"button"}
					onClick={() => {
						editor.chain().focus().toggleBold().run();
					}}
				>
					<BoldIcon className="w-5 h-5" />
				</Button>
				<Button
					appearance={editor.isActive("italic") ? "action" : "subtle"}
					css={{padding: "4px"}}
					type={"button"}
					onClick={() => {
						editor.chain().focus().toggleItalic().run();
					}}
				>
					<ItalicIcon className="w-5 h-5" />
				</Button>
			</Container>
			<Container
				className="rounded-xl p-4"
				css={{backgroundColor: "$surface"}}
			>
				<EditorContent
					editor={editor}
					onChange={console.log}
					className="min-h-32"
				/>
			</Container>
		</Container>
	);
};

export const TiptapPreview = (props: {value: object}) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: props.value,
		editable: false,
	});

	if (!editor) return null;

	return (
		<Container>
			<EditorContent
				editor={editor}
				disabled
				className="h-fit"
			/>
		</Container>
	);
};

export default Tiptap;
