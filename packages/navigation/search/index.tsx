// a react component that renders a headless ui modal
// Path: packages\shared\components\Modal.tsx

import {Dialog, Transition} from "@headlessui/react";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {SmallText} from "@packages/shared/components/Typography/Text";
import {Search} from "lucide-react";
import {Fragment, useEffect, useRef} from "react";

import {useOutsideClick} from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import {SearchResultSection} from "./SearchResultSection";

export default function SearchModal({children}) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const ref = useRef();
	useOutsideClick({
		ref,
		handler: onClose,
	});

	// Open with Ctrl + K by using an event listener
	// https://stackoverflow.com/a/42234988/1048518
	useEffect(() => {
		const handler = (event) => {
			if (event.ctrlKey && event.key === "k") {
				event.preventDefault();
				onOpen();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onOpen]);

	return (
		<>
			<Container className="hidden w-full lg:flex">
				<Button
					fullWidth
					appearance={"surface"}
					css={{
						display: "flex",
						alignItems: "center",
						justifyContent: "between",
						gap: "1.5rem",
					}}
					onClick={onOpen}
				>
					<Container className="flex flex-1 gap-2">
						<Search className="w-5 h-5" />
						<span>Search</span>
					</Container>
					<SmallText>⌘ K</SmallText>
				</Button>
			</Container>
			<Container className="flex lg:hidden">
				<Button
					fullWidth
					appearance={"surface"}
					css={{
						padding: "0.5rem",
						borderRadius: "50%",
					}}
					onClick={onOpen}
					className="shadow-sm"
					outlined
				>
					<Search className="w-5 h-5" />
				</Button>
			</Container>
			<Transition
				appear
				show={isOpen}
				as={Fragment}
			>
				<Dialog
					as="div"
					className="fixed inset-0 z-50 overflow-y-auto"
					onClose={onClose}
				>
					<div className="min-h-screen text-center">
						{/* This element is to trick the browser into centering the modal contents. */}

						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Container
								css={{
									borderColor: "$border",
									backgroundColor: "$surface",
								}}
								className="inline-block border w-full max-w-xl p-2 py-8 pt-4 mt-2 overflow-hidden text-left align-middle transition-all transform drop-shadow-2xl rounded-2xl"
								ref={ref}
							>
								<Container className="flex flex-col gap-4">
									{children}
								</Container>
							</Container>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

SearchModal.SearchInput = SearchInput;
SearchModal.ResultSection = SearchResultSection;
