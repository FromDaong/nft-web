import {PencilIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import PicEdtor from "@packages/shared/PicEditor";
import {File} from "filepond";
import {useEffect, useState} from "react";

export default function ImagePreviewWitEditor(props: {
	image: File;
	save: (image: string) => void;
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

	return (
		<Container className="w-full h-full">
			<Container
				css={{
					backgroundImage: `url("${image}")`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundColor: "$surfaceOnSurface",
				}}
				className="flex items-center justify-center w-full h-full bg-gray-200 rounded-xl"
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
				<Container
					css={{
						backgroundPosition: "center",
						backgroundSize: "cover",
					}}
					className="flex items-center justify-center w-full h-full rounded-xl"
				>
					<Text
						className="rounded-full shadow"
						css={{
							color: "$surface",
							backgroundColor: "$text",
							padding: "8px",
						}}
					>
						<PencilIcon
							width={24}
							height={24}
							onClick={openEditor}
						/>
					</Text>
				</Container>
			</Container>
		</Container>
	);
}
