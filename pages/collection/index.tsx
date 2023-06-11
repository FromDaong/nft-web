import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import React from "react";

export default function Collections() {
	return (
		<ApplicationLayout>
			<Container className="py-8 flex flex-col gap-4">
				<ApplicationFrame>
					<Heading size={"sm"}>Collections</Heading>
					<Container className={"flex gap-2 mt-4"}>
						<Button appearance={"action"}>All</Button>
						<Button appearance={"subtle"}>Following</Button>
					</Container>
				</ApplicationFrame>
				<Divider />
				<ApplicationFrame></ApplicationFrame>
			</Container>
		</ApplicationLayout>
	);
}
