import {PencilIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import PicEdtor from "@packages/shared/PicEditor";
import {useEffect, useState} from "react";

export default function ImagePreviewWitEditor(props: {
	image: string;
	save: (image: string) => void;
}) {
	const [editorOpen, setEditorOpen] = useState(false);
	const [editor, setEditor] = useState<any>(null);
	const [editorLoading, setEditorLoading] = useState(true);

	const openEditor = () => setEditorOpen(true);

	const saveAndCloseEditor = (value) => {
		const file = value;
		console.log({value});
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

	return (
		<Container className="w-full h-full">
			<Container
				css={{
					backgroundImage: `url("${props.image}")`,
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
						<Container className="h-full w-full container mx-auto  items-center justify-center">
							{editorLoading && (
								<Container
									className="h-screen w-screen flex items-center justify-center"
									css={{backgroundColor: "$surface", zIndex: 2500}}
								>
									<Container className="flex flex-col items-center text-center gap-2">
										<Container>
											<Spinner />
										</Container>
										<Text>Please wait, editor is loading...</Text>
									</Container>
								</Container>
							)}
							<PicEdtor
								handleProcess={saveAndCloseEditor}
								src={props.image}
								spyEditor={spyEditor}
							/>
						</Container>
					</Container>
				)}
				<Container
					css={{
						backgroundImage: `url("${props.image}")`,
						backgroundPosition: "center",
						backgroundSize: "cover",
						backgroundColor: "$surfaceOnSurface",
					}}
					className="flex items-center justify-center w-full h-full bg-gray-200 rounded-xl"
				>
					<Text
						className="rounded-full shadow"
						css={{
							color: "$surface",
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
