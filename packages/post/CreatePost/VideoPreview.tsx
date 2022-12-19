import {Container} from "@packages/shared/components/Container";
import {File} from "filepond";
import {useEffect, useState} from "react";

export default function VideoPreview({file}: {file: File}) {
	const [media, setMedia] = useState<string>(null);

	useEffect(() => {
		const reader = new FileReader();
		reader.readAsDataURL(file.file);

		reader.onload = () => {
			setMedia(reader.result as string);
		};
	}, [file]);

	return (
		<Container
			css={{
				backgroundColor: "$surfaceOnSurface",
			}}
			className="w-full h-full overflow-hidden bg-gray-200 rounded-xl"
		>
			<video
				width="100%"
				autoPlay
				controls
				muted
				loop
				playsInline
				style={{
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					height: "100%",
					width: "100%",
				}}
			>
				<source
					src={media}
					type="video/mp4"
				/>
			</video>
		</Container>
	);
}
