// Import the editor default configuration
import {createDefaultImageWriter, getEditorDefaults} from "pintura/pintura";
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
			imageWriter={createDefaultImageWriter({quality: 1})}
		></PinturaEditor>
	);
}

export default PicEdtor;
