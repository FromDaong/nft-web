import {Button} from "@packages/shared/components/Button";
import {
	Container,
	ContextualContainer,
} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {
	ContextualHeading,
	Text,
} from "@packages/shared/components/Typography/Headings";
import {ReactNode} from "react";

export const CreatePostLayout = ({
	children,
	heading,
	description,
	nextActionString,
	nextAction,
}: {
	children: ReactNode;
	heading: string;
	description?: string;
	nextActionString?: string;
	nextAction?: () => any;
}) => {
	return (
		<Container>
			<ContextualContainer className="max-w-xl">
				<ContextualHeading>{heading}</ContextualHeading>
				<Text>{description}</Text>
			</ContextualContainer>
			<Divider dir={"horizontal"} />
			<Container className="py-4">{children}</Container>
			<Container
				className="fixed bottom-0 left-0 w-screen"
				css={{
					zIndex: 700,
					borderTop: "1px solid $subtleBorder",
					backgroundColor: "$surface",
				}}
			>
				<Container className="flex w-full justify-end gap-8 px-12 xl:px-0 py-4 max-w-7xl mx-auto">
					<Button appearance={"subtle"}>Cancel</Button>
					<Button onClick={nextAction}>{nextActionString ?? "Next"}</Button>
				</Container>
			</Container>
		</Container>
	);
};
