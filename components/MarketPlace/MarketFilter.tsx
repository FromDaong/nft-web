import {Container} from "@packages/shared/components/Container";
import {useRouter} from "next/router";
import {useState} from "react";
import {RadioGroup} from "@headlessui/react";
import {Button} from "@packages/shared/components/Button";
import SortBy from "./SortByDropdownFilter";
import TagsFilter, {useSweetshopTags} from "./TagsFilter";
import {XIcon} from "lucide-react";

export default function SweetshopTabs() {
	const router = useRouter();
	const defaultTab = `${router.query.tab ?? "verified"}`;
	const {selectedTags, removeTag} = useSweetshopTags();
	const [selectedTab, setSelectedTab] = useState(defaultTab);

	const onChangeTab = (tab: string) => {
		router.push({
			query: {
				...router.query,
				tab,
			},
		});
		setSelectedTab(tab);
	};

	return (
		<Container
			css={{
				backgroundColor: "$surface",
				borderColor: "$border",
			}}
			className="flex flex-col w-full overflow-x-auto"
		>
			<Container className="flex flex-col items-center justify-between w-full lg:flex-row">
				<Container
					css={{borderColor: "$subtleBorder"}}
					className="flex justify-between w-full mb-2 border-b lg:hidden"
				>
					<TagsFilter />
					<SortBy />
				</Container>
				<Container className="hidden lg:flex">
					<TagsFilter />
				</Container>
				<Container>
					<RadioGroup
						onChange={(selected) => onChangeTab(selected)}
						className="flex items-center w-full max-w-full gap-2 px-2 py-2 overflow-x-auto flex-nowrap scroll-smooth whitespace-wrap"
						defaultValue={defaultTab}
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
