import {
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogTitle,
} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Text} from "@packages/shared/components/Typography/Text";
import {Dialog, Transition} from "@headlessui/react";
import {styled} from "@styles/theme";
import dynamic from "next/dynamic";
import {Fragment, useEffect} from "react";

const VerifyButton = dynamic(() => import("@passbase/button/react"), {
	ssr: false,
});

export default function BecomeCreatorModal({isOpen, onClose}) {
	const handleVerificationFinish = (returned) => {
		// Post to DB and toggle profile status from "general" to "pending"
	};

	return (
		<Transition
			as={Fragment}
			show={isOpen}
		>
			<Dialog
				open={isOpen}
				onClose={onClose}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogOverlay />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogContent>
						<Container className="flex flex-col gap-1">
							<Container className="flex justify-between">
								<Heading size="sm">Upgrade to a creator profile</Heading>
							</Container>
							<DialogDescription>
								Securely verify your identity to upgrade to a creator profile. A
								creator profile allows you to create subscriptions and nfts.
							</DialogDescription>
						</Container>
						<Container className="flex flex-col gap-8">
							<VerifyButton
								apiKey="DsPgHGsJXFzqRNFtSAL6aUkSaSYCWVHtwGKTqII6aiWma9GgMogUsxoTAFzoObi5"
								onStart={() => null}
								onError={() => null}
								onFinish={handleVerificationFinish}
							/>
						</Container>
					</DialogContent>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
}
