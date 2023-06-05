import {Container} from "@packages/shared/components/Container";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {RadioGroup} from "@headlessui/react";
import {Button} from "@packages/shared/components/Button";

export default function SweetshopTabs() {
	const [selectedTab, setSelectedTab] = useState("verified");
	const router = useRouter();

	useEffect(() => {
		// update query to include selectedTab
		router.push({
			query: {
				...router.query,
				tab: selectedTab,
			},
		});
	}, [selectedTab]);

	return (
		<Container
			css={{
				backgroundColor: "$surface",
				borderColor: "$border",
			}}
			className="sticky top-0 z-50 border-b overflow-x-auto shadow"
		>
			<Container className="container mx-auto ">
				<RadioGroup
					onChange={(selected) => setSelectedTab(selected)}
					className="flex items-center w-full max-w-full gap-2 py-2 overflow-x-auto flex-nowrap px-2"
					defaultValue="verified"
				>
					<RadioGroup.Option
						appearance={selectedTab === "verified" ? "action" : "subtle"}
						className="flex-shrink-0"
						value="verified"
						as={Button}
					>
						Verified creators
					</RadioGroup.Option>
					<RadioGroup.Option
						as={Button}
						appearance={selectedTab === "resale" ? "action" : "subtle"}
						className="flex-shrink-0"
						value="resale"
					>
						Resale market
					</RadioGroup.Option>
					<RadioGroup.Option
						as={Button}
						appearance={selectedTab === "melon" ? "action" : "subtle"}
						className="flex-shrink-0"
						value="melon"
					>
						Melon
					</RadioGroup.Option>
					<RadioGroup.Option
						as={Button}
						appearance={selectedTab === "totm" ? "action" : "subtle"}
						className="flex-shrink-0"
						value="totm"
					>
						Treat of The Month
					</RadioGroup.Option>
				</RadioGroup>
			</Container>
		</Container>
	);
}
