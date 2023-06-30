import {Transition} from "@headlessui/react";
import {Modal} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {
	CopyCheck,
	CopyIcon,
	FacebookIcon,
	SendIcon,
	TwitterIcon,
} from "lucide-react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function ShareModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [copied, setCopied] = useState(false);
	const router = useRouter();
	const url = `${process.env.NEXT_PUBLIC_HOSTNAME}${router.asPath}`;
	const [value, copy] = useCopyToClipboard();

	const copyToClipboard = () => {
		copy(url);
		setCopied(true);
	};

	const shareToOptions = [
		{
			name: "Twitter",
			icon: <TwitterIcon className="w-8 h-8" />,
			link: `https://twitter.com/intent/tweet?url=${url}`,
		},
		{
			name: "Facebook",
			icon: <FacebookIcon className="w-8 h-8" />,
			link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
		},
		{
			name: "Telegram",
			icon: <SendIcon className="w-8 h-8" />,
			link: `https://t.me/share/url?url=${url}`,
		},
	];

	useEffect(() => {
		if (copied) {
			const t = setTimeout(() => {
				setCopied(false);
			}, 2000);
			return () => clearTimeout(t);
		}
	}, [copied]);

	return (
		<Modal
			onClose={onClose}
			isOpen={isOpen}
		>
			<Container className="flex flex-col gap-8 items-center justify-center w-full h-full max-w-96 p-8">
				<Heading size={"xs"}>Share</Heading>
				<Container className="flex gap-4">
					{shareToOptions.map((option) => (
						<a
							href={option.link}
							key={option.name}
							target="_blank"
							rel="noreferrer"
						>
							<Container
								css={{
									backgroundColor: "$elementOnSurface",
								}}
								className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl"
							>
								<Container className="flex items-center justify-center">
									<Text>{option.icon}</Text>
								</Container>
								<Container>
									<Text>
										<ImportantText>{option.name}</ImportantText>
									</Text>
								</Container>
							</Container>
						</a>
					))}
				</Container>
				<Container className="relative w-full flex flex-col">
					{
						//Copy icon
						<Button
							appearance={"subtle"}
							onClick={copyToClipboard}
							className="absolute top-1 right-2"
							css={{
								top: "50%",
								transform: "translateY(-50%)",
								color: copied ? "$mint11" : "$text",
							}}
						>
							{copied ? (
								<Transition
									show={true}
									enterFrom="opacity-0"
									enterTo="opacity-100"
								>
									<CopyCheck className="w-5 h-5" />
								</Transition>
							) : (
								<Transition
									show={true}
									enterFrom="opacity-0"
									enterTo="opacity-100"
								>
									<CopyIcon className="w-5 h-5" />
								</Transition>
							)}
						</Button>
					}
					<Input
						value={url}
						onChange={() => url}
						disabled
						appearance={"solid"}
					/>
				</Container>
			</Container>
		</Modal>
	);
}
