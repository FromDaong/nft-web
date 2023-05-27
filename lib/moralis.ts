import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";

/**
 * {
      "token_address": "0x36f8f51f65fe200311f709b797baf4e193dd0b0d",
      "token_id": "641",
      "amount": "4",
      "owner_of": "0x585865b1bd74b773b8fef871289ac895742b22bc",
      "token_hash": "4d50803ccd50a48162bc63b8cf774e5c",
      "block_number_minted": "11806383",
      "block_number": "26313795",
      "contract_type": "ERC1155",
      "name": "Treat NFT Minter",
      "symbol": "TreatNFTMinter",
      "token_uri": "https://treatdao.com/api/nft/641",
      "metadata": "{\"name\":\"Teasing\",\"image\":\"https://i.imgur.com/iX3jKAs.jpg\",\"description\":\" \",\"properties\":{\"_id\":641,\"external_url\":\"https://treatdao.com/\",\"model\":{\"handle\":\"davinaastewart\",\"address\":\"0xec32573f5a2ea548c1e4527432810bec00089662\"},\"createdAt\":\"2021-10-15T22:16:21.735Z\",\"tags\":[]},\"attributes\":[{\"trait_type\":\"Model\",\"value\":\"davinaastewart\",\"_id\":\"6169fdb5e19adf0009953512\"},{\"trait_type\":\"Max Supply\",\"value\":\"691337420\",\"_id\":\"6169fdb5e19adf0009953513\"}]}",
      "last_token_uri_sync": "2022-07-24T12:57:18.761Z",
      "last_metadata_sync": "2022-07-24T12:58:55.681Z",
      "minter_address": "ERC1155 tokens don't have a single minter",
      "possible_spam": false
    }
 */
type MoralisOwnedNFTResponse = {
	token_address: string;
	token_id: string;
	amount: string;
	owner_of: string;
	token_hash: string;
	block_number_minted: string;
	block_number: string;
	contract_type: string;
	name: string;
	symbol: string;
	token_uri: string;
	metadata: string;
	last_token_uri_sync: string;
	last_metadata_sync: string;
	minter_address: string;
	possible_spam: boolean;
};

// Generate type from this string "{\"name\":\"Teasing\",\"image\":\"https://i.imgur.com/iX3jKAs.jpg\",\"description\":\" \",\"properties\":{\"_id\":641,\"external_url\":\"https://treatdao.com/\",\"model\":{\"handle\":\"davinaastewart\",\"address\":\"0xec32573f5a2ea548c1e4527432810bec00089662\"},\"createdAt\":\"2021-10-15T22:16:21.735Z\",\"tags\":[]},\"attributes\":[{\"trait_type\":\"Model\",\"value\":\"davinaastewart\",\"_id\":\"6169fdb5e19adf0009953512\"},{\"trait_type\":\"Max Supply\",\"value\":\"691337420\",\"_id\":\"6169fdb5e19adf0009953513\"}]}",
type MoralisNFTReponseMetadata = {
	name: string;
	image: string;
	description: string;
	properties: {
		_id: number;
		external_url: string;
		model: {
			handle: string;
			address: string;
		};
		createdAt: string;
		tags: string[];
	};
	attributes: {
		trait_type: string;
		value: string;
		_id: string;
	}[];
};

export class MoralisNFTApiURLBuilder {
	tokenAddress: string;
	address: string;

	constructor(tokenAddress, address) {
		this.tokenAddress = tokenAddress;
		this.address = address;
	}

	getResaleListingsURL = (limit = 100) => {
		return `https://deep-index.moralis.io/api/v2/${contractAddresses.treatResaleMarketplaceMinter[56]}/nft?chain=bsc&disable_total=false&limit=${limit}&format=decimal&token_address=${this.tokenAddress}`;
	};

	getOwnedNFTsURL = (limit = 100) => {
		return `https://deep-index.moralis.io/api/v2/${this.address}/nft?chain=bsc&disable_total=false&limit=${limit}&format=decimal&token_address=${this.tokenAddress}`;
	};
}

export const generateNewNFTFromOwnedButLostNFT = async (
	nft: MoralisOwnedNFTResponse
) => {
	const metadata: MoralisNFTReponseMetadata = JSON.parse(nft.metadata);
	console.log(metadata);
	if (!metadata?.properties) return;
	if (!nft.minter_address) return;

	const creator_address =
		metadata.properties?.model?.address?.toLocaleLowerCase() ??
		nft.minter_address?.toLocaleLowerCase();
	let creator = await MongoModelCreator.findOne({address: creator_address});

	if (!creator) {
		// Creator does not exist, look for their profile
		let creatorProfile = await MongoModelProfile.findOne({
			address: creator_address,
		});

		if (!creatorProfile) {
			// Creator profile does not exist, create it
			creatorProfile = new MongoModelProfile({
				address: creator_address,
				username:
					metadata.properties?.model?.handle ??
					nft.minter_address.slice(0, 6) +
						"..." +
						nft.minter_address.slice(
							nft.minter_address.length - 4,
							nft.minter_address.length
						),
				bio: "I am a Treat explorer.",
				display_name:
					creator_address.slice(0, 6) +
					"..." +
					creator_address.slice(
						creator_address.length - 4,
						creator_address.length
					),
				nfts: [],
			});
			await creatorProfile.save();
		}

		creator = new MongoModelCreator({
			address: creator_address,
			username: metadata.properties?.model?.handle ?? creatorProfile.username,
			profile: creatorProfile._id,
		});
		await creator.save();
	}

	const newNFT = new MongoModelNFT({
		id: nft.token_id,
		name: metadata.name,
		description: metadata.description,
		image: {
			cdn: metadata.image,
			ipfs: metadata.image,
		},
		creator: creator._id,
		type: "image",
		listedDate: new Date().getTime(),
		seller: creator._id,
		max_supply: metadata.attributes.find(
			(attr) => attr.trait_type === "Max Supply"
		)?.value,
	});
	await newNFT.save();
	console.log(`Saved new NFT ${newNFT.id} from lost NFT ${nft.token_id}`);
	return newNFT;
};
