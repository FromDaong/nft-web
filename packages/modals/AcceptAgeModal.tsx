import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {useEffect} from "react";
import {Modal} from ".";

export default function AcceptAgeModal() {
	const {isOpen, onOpen, onClose} = useDisclosure();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const age = localStorage.getItem("accept18Plus");
			if (age === null) {
				onOpen();
			}
		}
	}, []);

	const cancelModal = () => {
		window.location.href = "https://foundation.app";
	};

	const acceptAge = () => {
		localStorage.setItem("accept18Plus", "true");
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={cancelModal}
		>
			<Container className="flex flex-col w-full gap-8">
				<Container className="flex flex-col gap-2 text-center">
					<Heading size="xs"> Confirm your age.</Heading>
					<Text>You must be 18+ to use TreatDAO.</Text>
				</Container>
				<Container className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
					<Container>
						<Button
							appearance={"surface"}
							onClick={acceptAge}
							fullWidth
						>
							I am over 18
						</Button>
					</Container>
					<Button
						fullWidth
						onClick={cancelModal}
					>
						Take me away
					</Button>
				</Container>
			</Container>
		</Modal>
	);
}
