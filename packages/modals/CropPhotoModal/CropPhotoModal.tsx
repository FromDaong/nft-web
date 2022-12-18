import {XIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {styled} from "@styles/theme";
import {useUpdateTheme} from "@packages/theme";
import DarkTheme from "../../../../public/assets/svg/DarkTheme.svg";
import LightTheme from "../../../../public/assets/svg/LightTheme.svg";
import PinkTheme from "../../../../public/assets/svg/PinkTheme.svg";
import Image from "next/image";
import {ApplicationTheme} from "@packages/theme";
import {useContext, useState} from "react";
import Cropper from "react-easy-crop";
import {useCallback} from "react";
import {SliderIcon} from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";

const SliderRoot = styled(Slider.Root, {
	position: "relative",
	display: "flex",
	alignItems: "center",
	userSelect: "none",
	touchAction: "none",
	width: "100%",
	height: "200px",
});

const SliderTrack = styled(Slider.Track, {
	backgroundColor: "var(--blackA10)",
	position: "relative",
	flexGrow: "1",
	borderRadius: "9999px",
});

const SliderRange = styled(Slider.Range, {
	position: "absolute",
	backgroundColor: "white",
	borderRadius: "9999px",
	height: "100%",
});

const SliderThumb = styled(Slider.Thumb, {
	display: "block",
	width: "20px",
	height: "20px",
	backgroundColor: "white",
	boxShadow: "0 2px 10px var(--blackA7)",
	borderRadius: "10px",
});

export default function CropPhotoModal({isOpen, onClose, image}) {
	const [crop, setCrop] = useState({x: 0, y: 0});
	const [zoom, setZoom] = useState(1);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		console.log(croppedArea, croppedAreaPixels);
	}, []);

	if (!isOpen) {
		return null;
	}
	return (
		<Container
			css={{zIndex: 9999}}
			className="fixed top-0 left-0 w-screen h-screen"
		>
			<Container
				className="fixed w-1/2 p-8 divide-y shadow-xl h-1/2 rounded-xl"
				css={{
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 1500,
					backgroundColor: "$surface",
					borderRadius: "16px",
				}}
			>
				<Container className="flex justify-center">
					<Container className="flex flex-col gap-1"></Container>
				</Container>
				<Container
					className="flex flex-col w-full h-full gap-8"
					style={{
						position: "relative",
					}}
				>
					<Container className="flex">
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={1 / 1}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
						/>
					</Container>
				</Container>
				<Container>
					<SliderRoot
						defaultValue={[1]}
						max={100}
						step={1}
						aria-label="Zoom"
					>
						<SliderTrack>
							<SliderRange />
						</SliderTrack>
						<SliderThumb />
					</SliderRoot>
				</Container>
			</Container>
		</Container>
	);
}
