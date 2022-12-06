import {useCallback, useEffect, useMemo, useState} from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {ChevronDownIcon} from "@heroicons/react/solid";
import Link from "next/link";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";

import {
	DropdownContent,
	NavDropdownContainer,
	NavDropdownItem,
} from "../navigation/components/DropdownContainer";
import {
	BoldLink,
	ImportantText,
	Text,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {Container} from "@packages/shared/components/Container";
import NFTSearchResult, {NFTSearchResultProps} from "./NFTSearchResult";
import {QuestionMarkCircleIcon} from "@heroicons/react/outline";
import {Input} from "@packages/shared/components/Input";

const creatorResultsData = [
	{
		fname: "Elvin Kakomo",
		uname: "codeslayer",
	},
	{
		fname: "Tatenda Chinyamakobvu",
		uname: "kamfacekaya",
	},
	{
		fname: "Wallace Mukoka",
		uname: "mrfresh",
	},
	{
		fname: "Dylan Chigwanda",
		uname: "chigwanda",
	},
	{
		fname: "Munya Makosa",
		uname: "munyawerasta",
	},
	{
		fname: "Arvid Kakomo",
		uname: "spragga",
	},
];

const nftSearchResultData: Array<NFTSearchResultProps> = [
	{
		collection_name: "Developer Memes",
		post_id: "hdhjshjdsjdkdjk2",
		minted: 2,
		totalSupply: 11,
		price: {
			value: 0.93,
			currency: "BNB",
		},
		blurhash:
			"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	},
	{
		collection_name: "Retro Hardware",
		post_id: "hdhjshjdsjdkdjk2",
		minted: 2,
		totalSupply: 11,
		price: {
			value: 0.93,
			currency: "BNB",
		},
		blurhash:
			"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	},
	{
		collection_name: "Designer Bro's",
		post_id: "hdhjshjdsjdkdjk2",
		minted: 2,
		totalSupply: 11,
		price: {
			value: 0.93,
			currency: "BNB",
		},
		blurhash:
			"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	},
];

const NavbarSearchDropdown = () => {
	const [searchText, setSearchText] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (searchText) {
			setIsOpen(true);
		}
	}, [searchText]);

	const creatorResults = useMemo(
		() =>
			creatorResultsData.filter((item) => {
				const keyword = searchText.toLocaleLowerCase();
				const fullname = item.fname.toLocaleLowerCase();
				const username = item.uname.toLocaleLowerCase();

				return fullname.includes(keyword) || username.includes(keyword);
			}),
		[searchText]
	);

	const nftResults = useMemo(
		() =>
			nftSearchResultData.filter((item) => {
				const keyword = searchText.toLocaleLowerCase();
				const collection_name = item.collection_name.toLocaleLowerCase();

				return collection_name.includes(keyword);
			}),
		[searchText]
	);

	return (
		<div onBlur={() => setIsOpen(false)}>
			<div className="items-center hidden w-full max-w-md md:flex">
				<Input
					css={{
						borderColor: "$subtleBorder",
						backgroundColor: "$elementSurface",
						margin: 0,
						padding: "8px",
						paddingX: "12px",
						borderRadius: "9999px",
					}}
					className="w-full max-w-md border"
					placeholder="Search content"
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>
			{searchText && isOpen ? (
				<Container
					css={{
						backgroundColor: "$elementSurface",
						borderRadius: "16px",
						position: "absolute",
					}}
					className="grid w-full max-w-md grid-cols-1 gap-4 p-4 mt-2 shadow"
				>
					{creatorResults.length > 0 && (
						<Container className="flex flex-col gap-2">
							<Text>
								<MutedText>Creators</MutedText>
							</Text>
							<Container className="grid grid-cols-1 gap-2">
								{creatorResults.map((item, i) => (
									<SuggestedCreatorCard
										key={i}
										username={item.uname}
										display_name={item.fname}
										avatar=""
										bio="Mystery SEV. Suddenly, the site goes dark. The dashboard is red. Everything seems fucked. There's no indication why."
										isPromoted
										noFollowButton
									/>
								))}
							</Container>
						</Container>
					)}
					{nftResults.length > 0 && (
						<Container className="flex flex-col gap-2">
							<Text>
								<MutedText>Sweetshop NFT's</MutedText>
							</Text>
							<Container className="grid grid-cols-1 gap-2">
								{nftResults.map((nft) => (
									<NFTSearchResult
										key={nft.blurhash}
										{...nft}
									/>
								))}
							</Container>
						</Container>
					)}
					{!(creatorResults.length > 0 || nftResults.length > 0) && (
						<Container className="flex flex-col items-center justify-center gap-4 py-4">
							<QuestionMarkCircleIcon
								height={24}
								width={24}
							/>
							<Text>Oops. We couldn't find anything</Text>
						</Container>
					)}
				</Container>
			) : null}
		</div>
	);
};

export default NavbarSearchDropdown;
