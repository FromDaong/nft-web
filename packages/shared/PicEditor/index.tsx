// Import the editor default configuration
import {getEditorDefaults} from "pintura/pintura";
import {useEffect, useRef} from "react";

// Import the editor component from `react-pintura`
import {PinturaEditor} from "react-pintura";

function PicEdtor(props: {
	src?: string;
	image?: any;
	handleProcess;
	spyEditor: (_editor: any) => void;
}) {
	// get default properties
	const editorConfig = getEditorDefaults();
	const componentRef = useRef(null);

	const handleUndo = () => {
		const {editor} = componentRef.current;

		// run history.undo()
		editor.history.undo();
	};

	useEffect(() => {
		if (props.spyEditor && componentRef.current) {
			props.spyEditor(componentRef.current.editor);
		}
	}, [props.spyEditor, componentRef]);

	return (
		<PinturaEditor
			{...editorConfig}
			src={props.src}
			ref={componentRef}
			onProcess={props.handleProcess}
		></PinturaEditor>
	);
}

export default PicEdtor;
