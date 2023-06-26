import {PencilIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import PicEdtor from "@packages/shared/PicEditor";
import {dataURLtoFile} from "@utils/index";
import {TrashIcon} from "lucide-react";
import {useEffect, useState} from "react";

export default function ImagePreviewWithEditor(props: {
	image: any;
	save: (image: File) => void;
	reset: () => void;
}) {
	const [editorOpen, setEditorOpen] = useState(false);
	const [editor, setEditor] = useState<any>(null);
	const [editorLoading, setEditorLoading] = useState(true);
	const [image, setImage] = useState("");

	const openEditor = () => setEditorOpen(true);

	const saveAndCloseEditor = (value) => {
		const file = value;
		const reader = new FileReader();
		reader.readAsDataURL(file.dest);

		reader.onload = () => {
			setImage(reader.result as string);
		};

		setEditorOpen(false);
	};

	const spyEditor = (_editor: any) => {
		setEditor(_editor);
	};

	useEffect(() => {
		setEditorLoading(true);
		if (editor) {
			setEditorLoading(false);
		}
	}, [editorOpen, editor]);

	useEffect(() => {
		if (editorOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [editorOpen]);

	useEffect(() => {
		const reader = new FileReader();
		reader.readAsDataURL(props.image.file);

		reader.onload = () => {
			setImage(reader.result as string);
		};
	}, [props.image]);

	useEffect(() => {
		if (image) {
			const file = dataURLtoFile(image, props.image.file.name);
			props.save(file);
		}
	}, [image]);

	return (
		<Container className="flex flex-col w-full h-full gap-4">
			<Container
				css={{
					backgroundImage: `url("${image}")`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundColor: "$surfaceOnSurface",
				}}
				className="flex items-center justify-center aspect-square max-h-[80vh] lg:max-h-[60vh] w-full bg-gray-200 rounded-xl"
			>
				{editorOpen && (
					<Container
						className="fixed top-0 left-0 w-screen h-screen"
						css={{zIndex: 2000, padding: "16px", backgroundColor: "$surface"}}
					>
						<Container className="container items-center justify-center w-full h-full mx-auto">
							{editorLoading && (
								<Container
									className="flex items-center justify-center w-screen h-screen"
									css={{backgroundColor: "$surface", zIndex: 2500}}
								>
									<Container className="flex flex-col items-center gap-2 text-center">
										<Container>
											<Spinner />
										</Container>
										<Text>Please wait, editor is loading...</Text>
									</Container>
								</Container>
							)}
							<PicEdtor
								handleProcess={saveAndCloseEditor}
								src={props.image.source as string}
								spyEditor={spyEditor}
							/>
						</Container>
					</Container>
				)}
			</Container>
			<Container className="flex max-w-full gap-4">
				<Button
					size={"sm"}
					appearance={"action"}
					onClick={openEditor}
					type="button"
				>
					<PencilIcon className="w-5 h-5" /> Edit image
				</Button>
				<Button
					size={"sm"}
					appearance={"danger"}
					onClick={() => props.reset()}
					type="button"
				>
					<TrashIcon className="w-5 h-5" /> Discard
				</Button>
			</Container>
		</Container>
	);
}
