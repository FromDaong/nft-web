import {Button} from "@packages/shared/components/Button";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Link from "next/link";
import {useRouter} from "next/router";

const NFTSort = ({setSort, sort}) => {
	const router = useRouter();
	return (
		<>
			<a
				href={`/sweetshop/resale?sort=${3}&p=1${
					router.query.s ? `&s=${router.query.s}` : ""
				}`}
			>
				<Button
					className="flex gap-2 px-4 py-2"
					outlined={Number(sort) !== 3}
					active={Number(sort) === 3}
				>
					<ImportantText>Newest first</ImportantText>
				</Button>
			</a>

			<a
				href={`/sweetshop/resale?sort=${1}&p=1${
					router.query.s ? `&s=${router.query.s}` : ""
				}`}
			>
				<Button
					className="flex gap-2 px-4 py-2"
					outlined={Number(sort) !== 1}
					active={Number(sort) === 1}
				>
					<ImportantText>Lowest price first</ImportantText>
				</Button>
			</a>

			<a
				href={`/sweetshop/resale?sort=${2}&p=1${
					router.query.s ? `&s=${router.query.s}` : ""
				}`}
			>
				<Button
					className="flex gap-2 px-4 py-2"
					outlined={Number(sort) !== 2}
					active={Number(sort) === 2}
				>
					<ImportantText>Highest price first</ImportantText>
				</Button>
			</a>
		</>
	);
};

export default NFTSort;
