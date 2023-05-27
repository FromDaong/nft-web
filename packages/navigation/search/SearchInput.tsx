// search input using lucide, tailwind

import {Search} from "lucide-react";
import {SmallText, Text} from "@packages/shared/components/Typography/Text";
import {Input} from "@packages/shared/components/Input";
import {useState} from "react";
import {useRouter} from "next/router";
import {Container} from "@packages/shared/components/Container";
import {RadioGroup} from "@headlessui/react";
import {cn} from "@lib/utils";

export default function SearchInput() {
	const [search, setSearch] = useState("");
	const router = useRouter();

	const handleSearch = (e) => {
		e.preventDefault();
		router.push(`/search?q=${search}`);
	};

	return (
		<form
			className="flex flex-col"
			onSubmit={handleSearch}
		>
			<div className="relative flex items-center w-full h-8">
				<div className="absolute left-0 flex items-center justify-center w-8 h-8 text-gray-400">
					<Text>
						<Search size={16} />
					</Text>
				</div>
				<Input
					className="pl-8"
					css={{
						paddingLeft: 32,
					}}
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<Container className="flex gap-2 mt-4">
				<SearchRadioGroup />
			</Container>
		</form>
	);
}
// radio button group with 4 options, creators, collections, nfts, and people

const SearchRadioGroup = () => {
	const options = ["creators", "collections", "nfts", "people"];
	const [value, setValue] = useState("creators");

	return (
		<RadioGroup
			value={value}
			onChange={setValue}
		>
			<RadioGroup.Label className="sr-only">Search</RadioGroup.Label>
			<div className="flex items-center justify-between w-full gap-2">
				{options.map((option) => {
					const checked = value === option;

					return (
						<RadioGroup.Option
							key={option}
							value={option}
							className={({active}) =>
								cn(
									"relative flex items-center justify-center outline-none ring-0 flex-1 w-full py-2 capitalize px-4 text-sm font-medium text-center text-gray-500 rounded-lg cursor-pointer focus:outline-none",
									checked ? "bg-zinc-100 text-white" : "bg-white text-gray-900",
									active
										? "ring-2 ring-offset-2 ring-offset-primary-500 ring-white ring-opacity-60"
										: "",
									!active && !checked ? "hover:bg-zinc-50" : ""
								)
							}
						>
							{({active, checked}) => (
								<>
									<Text
										className={
											checked && !active
												? "bg-primary-500 border-transparent"
												: "bg-white border-gray-300"
										}
										aria-hidden="true"
									/>
									<SmallText
										className={cn(
											checked ? "text-zinc-900" : "text-zinc-600",
											"relative"
										)}
									>
										{option}
									</SmallText>
								</>
							)}
						</RadioGroup.Option>
					);
				})}
			</div>
		</RadioGroup>
	);
};
