import React from "react";
import {FrostyBackgroundContainer} from "../misc/FrostyBackground";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {EyeOffIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";

export default function ProtectedTag() {
	return (
		<FrostyBackgroundContainer className="px-3 py-1 rounded-full">
			<Container className="flex items-center justify-center gap-2">
				<Text css={{color: "#ffffff"}}>
					<EyeOffIcon
						width={20}
						height={20}
					/>
				</Text>
				<Text css={{color: "#ffffff"}}>
					<ImportantText>Protected</ImportantText>
				</Text>
			</Container>
		</FrostyBackgroundContainer>
	);
}
