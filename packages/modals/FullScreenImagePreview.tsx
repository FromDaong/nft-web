import {XIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Fragment} from "react";
import {Transition} from "@headlessui/react";

export default function FullScreenImagePreview(props: {
	imageUrl: string;
	isOpen: boolean;
	onClose: () => void;
	alt: string;
}) {
	return (
		<Transition
			as={Fragment}
			show={props.isOpen}
		>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-out duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<Container
					className={`${
						props.isOpen ? "" : "hidden"
					} fixed h-screen w-screen top-0 left-0 right-0 bottom-0 overflow-hidden`}
					css={{backgroundColor: "$elementSurface", zIndex: 1000}}
				>
					<Container className="relative flex-1 w-full h-full px-4 py-32">
						<Button
							className="absolute p-2 top-2 left-2"
							appearance={"unstyled"}
						>
							<XIcon
								onClick={props.onClose}
								width={24}
								height={24}
							/>
						</Button>
						<Container className="relative w-full h-full">
							<OptimizedImage
								src={props.imageUrl}
								className="cursor-zoom-in"
								sizes="100vw"
								fill
								objectFit="contain"
								alt={props.alt}
							/>
						</Container>
					</Container>
				</Container>
			</Transition.Child>
		</Transition>
	);
}
