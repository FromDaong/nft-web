import {Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";

export const ListedBy = (props: {username: string}) => (
	<Link href={`/${props.username}`}>
		<a>
			<Text className="max-w-64 truncate text-ellipsis">
				Listed by @{props.username}
			</Text>
		</a>
	</Link>
);
