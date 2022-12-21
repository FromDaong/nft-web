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
import {Modal} from "..";
import {Button} from "@packages/shared/components/Button";

const SliderRoot = styled(Slider.Root, {
	position: "relative",
	display: "flex",
	alignItems: "center",
	userSelect: "none",
	touchAction: "none",
	width: "100%",
	height: "20px",
});

const SliderTrack = styled(Slider.Track, {
	position: "relative",
	backgroundColor: "$surfaceOnSurface",
	flexGrow: "1",
	borderRadius: "9999px",
	height: "50%",
	marinY: "auto",
});

const SliderRange = styled(Slider.Range, {
	position: "absolute",
	backgroundColor: "$textContrast",
	borderRadius: "9999px",
	height: "100%",
	marinY: "auto",
});

const SliderThumb = styled(Slider.Thumb, {
	display: "block",
	width: "20px",
	height: "20px",
	backgroundColor: "$textContrast",
	boxShadow: "0 2px 10px var(--blackA)",
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

	const save = () => {
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex flex-col gap-4">
				<Container>
					<Heading size="xs">Crop image</Heading>
				</Container>
				<Container className="relative flex flex-col w-full h-full gap-8 min-h-[300px]">
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
				<Container>
					<SliderRoot
						defaultValue={[1]}
						max={100}
						step={1}
						aria-label="Zoom"
						onValueChange={(e) => setZoom(1 + e[0] / 10)}
					>
						<SliderTrack>
							<SliderRange />
						</SliderTrack>
						<SliderThumb />
					</SliderRoot>
				</Container>
				<Container className="flex justify-end gap-8">
					<Button
						appearance={"surface"}
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button onClick={save}>Save</Button>
				</Container>
			</Container>
		</Modal>
	);
}
