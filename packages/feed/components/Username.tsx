import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {Verified} from "lucide-react";

export default function Username({
	username,
	verified,
}: {
	username: string;
	verified?: boolean;
}) {
	return (
		<Text className="flex items-center gap-2">
			<ImportantText>{username}</ImportantText>
			{verified && <Verified className="w-4 h-4" />}
		</Text>
	);
}
