// Import the editor default configuration
import {getEditorDefaults} from "pintura/pintura";
import {useRef} from "react";

// Import the editor component from `react-pintura`
import {PinturaEditor} from "react-pintura";

function PicEdtor(props: {src?: string; image?: any}) {
	// get default properties
	const editorConfig = getEditorDefaults();
	const componentRef = useRef(null);

	const handleUndo = () => {
		// get reference to editor instance
		const {editor} = componentRef.current;

		// run history.undo()
		editor.history.undo();
	};

	return (
		<div
			className="App"
			style={{height: "600px"}}
		>
			<PinturaEditor
				{...editorConfig}
				src={props.src}
				imageCropAspectRatio={1}
				ref={componentRef}
			></PinturaEditor>
		</div>
	);
}

export default PicEdtor;
