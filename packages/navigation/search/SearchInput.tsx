// search input using lucide, tailwind

import {Search} from "lucide-react";
import {SmallText, Text} from "@packages/shared/components/Typography/Text";
import {Input} from "@packages/shared/components/Input";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Container} from "@packages/shared/components/Container";
import {RadioGroup} from "@headlessui/react";
import {cn} from "@lib/utils";
import {Button} from "@packages/shared/components/Button";
import {useFormikContext} from "formik";
import {useDebounce} from "@packages/shared/hooks";

export default function SearchInput() {
	const form = useFormikContext();
	const [search, setSearch] = useState("");
	const debouncedSearchValue = useDebounce(search, 500);

	useEffect(() => {
		form.setFieldValue("search", debouncedSearchValue);
	}, [debouncedSearchValue]);

	const handleSearch = (e) => {
		e.preventDefault();
	};

	return (
		<form
			className="flex flex-col p-4"
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
					appearance={"solid"}
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
	const form = useFormikContext();
	const options = ["people", "collections", "nfts"];

	return (
		<RadioGroup
			value={(form.values as any).entity}
			onChange={(value) => form.setFieldValue("entity", value)}
		>
			<RadioGroup.Label className="sr-only">Search</RadioGroup.Label>
			<div className="flex items-center justify-between w-full gap-2">
				{options.map((option) => {
					return (
						<RadioGroup.Option
							key={option}
							value={option}
							className={`flex gap-2 text-sm py-2`}
						>
							{({checked}) => (
								<>
									<Button
										type="button"
										appearance={checked ? "action" : "surface"}
										className="capitalize"
									>
										{option}
									</Button>
								</>
							)}
						</RadioGroup.Option>
					);
				})}
			</div>
		</RadioGroup>
	);
};
