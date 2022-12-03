import {Container} from "@packages/shared/components/Container";

export default function ServiceHealth({
	title,
	description,
	status,
}: {
	title: string;
	description: string;
	status: "down" | "up";
}) {
	return <Container></Container>;
}
