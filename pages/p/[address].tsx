import Layout from "../../components/Layout";
import MoralisInstance from "../../utils/moralis";
import NFT from "../../models/NFT";
import { NextPageContext } from "next";
import Profile from "../../models/Profile";
import dbConnect from "../../utils/dbConnect";
import { useRouter } from "next/dist/client/router";

export default function UserProfile(props) {
  const router = useRouter();
  const { address } = router;
  console.log({ props, address });
  return (
    <Layout>
      <div className="container">{props.toString()}</div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    await dbConnect();
    const address = ctx.query.query as any;
    const page = ctx.query.p as any;
    const options = {
      page: page ?? 1,
      limit: 12,
      collation: {
        locale: "en",
      },
      sort: {},
    };

    const profile = await Profile.findOne({ address });
    const ownedNFTs = await MoralisInstance.Web3API.account.getNFTsForContract({
      address,
      token_address: process.env.TREAT_MINTER_ADDRESS,
      chain: "bsc",
    });
    const ownedNFTsIds = await ownedNFTs.result.map((nft) => nft.token_id);

    // @ts-ignore
    const nftsWithMetadata = NFT.paginate(
      {
        id: { $in: ownedNFTsIds },
      },
      options
    );

    nftsWithMetadata.docs = await Promise.all(
      nftsWithMetadata.docs.map((data) => {
        const nft_data = ownedNFTs.result.find(
          (owned_nft) => Number(owned_nft.token_id) === data.id
        );
        if (nft_data) {
          const returnObj = {
            ...nft_data,
            ...data.toObject(),
          };

          if (returnObj.cdnUrl) {
            returnObj.image = returnObj.cdnUrl;
            delete returnObj.cdnUrl;
          }

          // Removing this to minimize total payload, get only what we need.
          delete returnObj.description;
          delete returnObj.mints;

          return returnObj;
        }
        return undefined;
      })
    );

    console.log({ nftsWithMetadata, ownedNFTsIds });

    if (profile) {
      return {
        props: {
          ...profile,
          data: nftsWithMetadata,
          ownedNFTsIds,
        },
      };
    } else {
      return {
        props: {
          error: "No profile exists for that wallet",
        },
      };
    }
  } catch (err) {
    console.log({ err });
    return {
      props: {
        error: JSON.stringify(err),
      },
    };
  }
};
