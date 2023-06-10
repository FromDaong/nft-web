import {Button} from "@packages/shared/components/Button";
import {useRouter} from "next/router";
import {useEffect, useMemo, useRef, useState} from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {PlusIcon} from "lucide-react";

export const useSweetshopTags = () => {
	const tags: React.MutableRefObject<string[]> = useRef(
		[
			{value: "SFW", label: "SFW"},
			{value: "NSFW", label: "NSFW"},
			{value: "Artistic", label: "Artistic"},
			{value: "Glamour", label: "Glamour"},
			{value: "Cosplay", label: "Cosplay"},
			{value: "Natural", label: "Natural"},
			{value: "Solo", label: "Solo"},
			{value: "Man - Woman", label: "Man - Woman"},
			{value: "Woman - Woman", label: "Woman - Woman"},
			{value: "Man - boy", label: "Man - boy"},
			{value: "Group", label: "Group"},
			{value: "Lingerie", label: "Lingerie"},
			{value: "BDSM", label: "BDSM"},
			{value: "Latex", label: "Latex"},
			{value: "Pantyhose", label: "Pantyhose"},
			{value: "Feet", label: "Feet"},
			{value: "Pregnant", label: "Pregnant"},
			{value: "Smoking", label: "Smoking"},
			{value: "Femdom", label: "Femdom"},
			{value: "Findom", label: "Findom"},
			{value: "Flexible", label: "Flexible"},
			{value: "Outdoor", label: "Outdoor"},
			{value: "Oil", label: "Oil"},
			{value: "Masturbation", label: "Masturbation"},
			{value: "Anal", label: "Anal"},
			{value: "Pegging", label: "Pegging"},
			{value: "Toys", label: "Toys"},
			{value: "Exclusive", label: "Exclusive"},
		].map((t) => t.value)
	);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const router = useRouter();
	const remainingTags: string[] = useMemo(
		() => tags.current.filter((t: string) => !selectedTags.includes(t)),
		[selectedTags]
	);

	const removeTag = (tag: string) => {
		setSelectedTags(selectedTags.filter((t: string) => t !== tag));
	};

	const addTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			alert("Tag already added");
			return;
		}

		setSelectedTags([...selectedTags, tag]);
	};

	useEffect(() => {
		if (router.query.tags) {
			const tags = (router.query.tags as string).split(",");
			if (tags.every((t: string) => t.length > 0)) {
				setSelectedTags(tags);
			}
		}
	}, [router.query.tags]);

	useEffect(() => {
		router.push({
			query: {
				...router.query,
				tags: selectedTags.join(","),
			},
		});
	}, [selectedTags]);

	return {
		tags,
		selectedTags,
		addTag,
		removeTag,
		remainingTags,
	};
};

const TagsFilter = () => {
	const {remainingTags, addTag} = useSweetshopTags();
	return (
		<Container className="flex flex-col gap-4 p-2">
			<Container className="flex justify-between w-full">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button
							css={{padding: "4px"}}
							outlined
							className="flex gap-4 rounded-lg"
							appearance={"surface"}
						>
							<PlusIcon className="w-5 h-5" />
							Add tags
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="z-50 w-64 p-2 overflow-x-hidden overflow-y-auto bg-white shadow-2xl rounded-xl max-h-96">
						{remainingTags.map((item) => (
							<DropdownMenuItem
								key={item}
								onClick={() => addTag(item)}
								className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100"
							>
								<Text>
									<ImportantText>{item}</ImportantText>
								</Text>
							</DropdownMenuItem>
						))}
						{remainingTags.length === 0 && (
							<DropdownMenuItem className="flex flex-col items-center justify-center w-full h-full p-2">
								<MutedText>No more tags to add</MutedText>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</Container>
		</Container>
	);
};

export default TagsFilter;
