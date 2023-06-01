import {Button} from "@packages/shared/components/Button";
import {XIcon} from "lucide-react";
import {useRouter} from "next/router";
import {useEffect, useMemo, useRef, useState} from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {Container} from "@packages/shared/components/Container";
import SortBy from "./SortByDropdownFilter";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {PlusIcon} from "lucide-react";

const TagsFilter = () => {
	const tags: React.MutableRefObject<string[]> = useRef([
		"Anime",
		"Artistic",
		"Cosplay",
		"Collectibles",
		"Comics",
		"Food",
		"Fashion",
		"Gaming",
		"Melon",
		"Movies",
		"Music",
		"Manga",
		"NSFW",
		"Pets",
		"Sports",
		"Travel",
		"Treat of the month",
		"TV",
	]);
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

	return (
		<Container className="flex flex-col w-full gap-4 py-4">
			<Container className="flex flex-wrap gap-4">
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
			<Container className="flex justify-between w-full">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button
							css={{padding: "8px"}}
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
				<SortBy />
			</Container>
		</Container>
	);
};

export default TagsFilter;
