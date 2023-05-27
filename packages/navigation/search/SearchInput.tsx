// search input using lucide, tailwind

import {Search} from "lucide-react";
import {SmallText, Text} from "@packages/shared/components/Typography/Text";
import {Input} from "@packages/shared/components/Input";
import {useState} from "react";
import {useRouter} from "next/router";

export default function SearchInput() {
	const [search, setSearch] = useState("");
	const router = useRouter();

	const handleSearch = (e) => {
		e.preventDefault();
		router.push(`/search?q=${search}`);
	};

	return (
		<form onSubmit={handleSearch}>
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
		</form>
	);
}
