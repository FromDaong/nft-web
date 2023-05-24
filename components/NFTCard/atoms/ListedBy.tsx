import {Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";

export const ListedBy = (props: {username: string}) => (
	<Link href={`/${props.username}`}>
		<a>
			<Text>Listed by @{props.username}</Text>
		</a>
	</Link>
);
