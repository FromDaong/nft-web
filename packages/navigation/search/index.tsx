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
import {FormikProvider, useFormik} from "formik";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {apiEndpoint} from "@utils/index";
import CreatorCard from "@packages/feed/components/CreatorCard";
import {useRouter} from "next/router";

export default function SearchModal() {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const ref = useRef();
	const router = useRouter();
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
	}, []);

	useEffect(() => {
		const handler = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isOpen]);

	useEffect(() => {
		onClose();
	}, [router.pathname]);

	return (
		<>
			<Container className="hidden w-96 lg:flex">
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
			{isOpen && (
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
									className="inline-block border md:w-full w-[95vw] md:max-w-xl mt-2 overflow-hidden text-left align-middle transition-all transform drop-shadow-2xl rounded-2xl"
									ref={ref}
								>
									<Container className="flex flex-col gap-4 pt-2">
										<SearchBar />
									</Container>
								</Container>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition>
			)}
		</>
	);
}

function SearchBar() {
	// create formik provider
	// create formik search input
	// debounce value then searcj

	const formik = useFormik({
		initialValues: {
			search: "",
			entity: "people",
		},
		onSubmit: (values) => {
			console.log(values);
		},
	});

	const {isLoading, data, isError} = TreatCore.useQuery(
		[formik.values.search, formik.values.entity],
		async () => {
			const res = await axios.get(
				`${apiEndpoint}/search?q=${formik.values.search}&entity=${formik.values.entity}`
			);
			return res.data.data;
		},
		{
			enabled: formik.values.search.length > 1,
		}
	);

	console.log(data);

	return (
		<div className="flex w-full h-full">
			<FormikProvider value={formik}>
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col w-full"
				>
					<SearchModal.SearchInput />
					<>
						<SearchModal.ResultSection heading={formik.values.entity}>
							{!isLoading && !isError && (
								<>
									{formik.values.entity === "people" && (
										<Container className="flex-shrink-0">
											{data[formik.values.entity].map((item) => (
												<CreatorCard
													key={item._id}
													{...{...item, avatar: item.profile_pic}}
													variant={"compact"}
												/>
											))}
										</Container>
									)}
								</>
							)}
						</SearchModal.ResultSection>
					</>
				</form>
			</FormikProvider>
		</div>
	);
}

SearchModal.SearchInput = SearchInput;
SearchModal.ResultSection = SearchResultSection;
