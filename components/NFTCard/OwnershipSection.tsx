import {CalendarIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import React from "react";

export default function OwnershipSection(props: {
	balance: number;
	totalActiveListings: number;
}) {
	return (
		<Container className="flex gap-4 mt-4">
			<Container className="flex items-center gap-2">
				<RectangleStack className="w-5 h-5" />
				<Text className="truncate line-clamp-1 text-ellipsis">
					<ImportantText>{props.balance} owned</ImportantText>
				</Text>
			</Container>
			<Text>&bull;</Text>
			<Container className="flex items-center flex-1 gap-2">
				<CalendarIcon className="w-5 h-5" />
				<Text>
					<ImportantText>{props.totalActiveListings} listings</ImportantText>
				</Text>
			</Container>
		</Container>
	);
}
