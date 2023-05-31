// a react component that renders a headless ui modal
// Path: packages\shared\components\Modal.tsx

import {Dialog, Transition} from "@headlessui/react";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {SmallText} from "@packages/shared/components/Typography/Text";
import {Search} from "lucide-react";
import {Fragment, useRef} from "react";

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
					className="fixed inset-0 z-40 overflow-y-auto"
					onClose={onClose}
				>
					<div className="min-h-screen text-center">
						<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

						{/* This element is to trick the browser into centering the modal contents. */}
						<span
							className="inline-block h-screen align-middle"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div
								className="inline-block w-full max-w-md p-6 py-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
								ref={ref}
							>
								<Container className="flex flex-col gap-4">
									{children}
								</Container>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

SearchModal.SearchInput = SearchInput;
SearchModal.ResultSection = SearchResultSection;
