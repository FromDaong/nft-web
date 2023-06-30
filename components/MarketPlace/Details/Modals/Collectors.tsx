import React from "react";
import {NFTPageModal} from ".";
import CreatorCard from "@packages/feed/components/CreatorCard";

/**
 * [
    {
        "social_accounts": {
            "twitter": "",
            "website": "",
            "instagram": ""
        },
        "_id": "6470b5331ada8f7eec62a8a3",
        "display_name": "0x8c80...548a",
        "username": "devan",
        "bio": "I am a Treat explorer.",
        "profile_pic": "",
        "banner_pic": "https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP",
        "address": "0x8c80f871f91b7e53859cbffebdb35311630b548a",
        "isTeam": false,
        "isCouncil": false,
        "referred": [],
        "followers": [],
        "following": [],
        "collected_nfts": [],
        "badges": [],
        "createdAt": "2023-05-26T13:33:39.341Z",
        "updatedAt": "2023-05-26T13:33:39.341Z",
        "__v": 0
    }
]
 */
export default function ShowAllCollectors({
	isOpen,
	onClose,
	collectors,
}: {
	isOpen: boolean;
	onClose: () => void;
	collectors: {
		social_accounts: {
			twitter: string;
			website: string;
		};
		_id: string;
		display_name: string;
		username: string;
		bio: string;
		profile_pic: string;
		banner_pic: string;
		address: string;
		followers: string[];
		following: string[];
		isCouncil: boolean;
		isTeam: boolean;
	}[];
}) {
	return (
		<NFTPageModal
			isOpen={isOpen}
			onClose={onClose}
			title="Owned by"
		>
			{collectors.map((collector) => (
				<CreatorCard
					key={collector._id}
					username={collector.username}
					display_name={collector.display_name}
					avatar={collector.profile_pic}
					bio={collector.bio}
					isExpanded
					border
					live={false}
					followers={collector.followers}
					subscribers={collector.following.length}
				/>
			))}
		</NFTPageModal>
	);
}
