import {Container} from "@packages/shared/components/Container";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {RadioGroup} from "@headlessui/react";
import {Button} from "@packages/shared/components/Button";
import SortBy from "./SortByDropdownFilter";
import TagsFilter, {useSweetshopTags} from "./TagsFilter";
import {XIcon} from "lucide-react";

export default function SweetshopTabs() {
	const [selectedTab, setSelectedTab] = useState("verified");
	const router = useRouter();
	const {selectedTags, removeTag} = useSweetshopTags();

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
			className="overflow-x-auto container mx-auto w-full flex flex-col"
		>
			<Container className="flex justify-between items-center w-full flex-col lg:flex-row">
				<Container
					css={{borderColor: "$subtleBorder"}}
					className="mb-2 flex justify-between border-b w-full lg:hidden"
				>
					<TagsFilter />
					<SortBy />
				</Container>
				<Container className="hidden lg:flex">
					<TagsFilter />
				</Container>
				<Container>
					<RadioGroup
						onChange={(selected) => setSelectedTab(selected)}
						className="flex items-center w-full max-w-full gap-2 py-2 overflow-x-auto flex-nowrap px-2 scroll-smooth whitespace-wrap"
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
				<Container className="hidden lg:flex">
					<SortBy />
				</Container>
			</Container>
			{selectedTags.length > 0 && (
				<Container className="flex flex-wrap gap-2 px-2 py-2">
					{selectedTags.map((tag) => (
						<Button
							key={tag}
							appearance={"link"}
							className="border shadow-sm"
							css={{paddingX: "8px", borderColor: "$subtleBorder"}}
							onClick={() => removeTag(tag)}
						>
							{tag}
							<XIcon className="w-4 h-4" />
						</Button>
					))}
				</Container>
			)}
		</Container>
	);
}