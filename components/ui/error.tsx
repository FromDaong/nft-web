import {Container} from "@packages/shared/components/Container";
import {useRouter} from "next/router";
import {EmptyStateImage} from "./empty";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {ExclamationCircleIcon} from "@heroicons/react/outline";

export default function ErrorOccurred({description, err}) {
	const router = useRouter();
	return (
		<Container className="flex justify-center gap-8 py-12 items-center">
			<Container className="text-center flex flex-col items-center max-w-xl">
				<EmptyStateImage />
				<Heading size={"xs"}>An error occurred</Heading>
				<Text className="mt-2">{description}</Text>
				<Container className="flex justify-center gap-8 mt-4">
					<Button
						appearance={"action"}
						onClick={() => router.reload()}
					>
						Reload
					</Button>
				</Container>
			</Container>
		</Container>
	);
}
