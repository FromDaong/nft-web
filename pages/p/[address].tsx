import { Button } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import Link from "next/link";
import MoralisInstance from "../../utils/moralis";
import NFT from "../../models/NFT";
import PaginationComponentV2 from "../../components/Pagination";
import Profile from "../../models/Profile";
import TwNFTListItem from "../../components/NFTListItem/TwNFTListItem";
import dbConnect from "../../utils/dbConnect";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

export default function UserProfile(props) {
  const [loadingOwnedNFTs, setLoadingOwnedNFTs] = useState(false);

  const router = useRouter();
  const { address } = router.query;
  const owned_nfts = JSON.parse(props.owned_nfts);
  const { profile } = props;

  const navigateOwnedNFTs = (p) => {};

  return (
    <Layout>
      <div className="container">
        <div className="view-model white-tp-bg">
          <div
            className="banner"
            style={{
              backgroundImage: `url(${profile.banner_pic})`,
            }}
          ></div>
          <div className="profile-top-container col-md-12">
            <div
              style={{ backgroundImage: `url(${profile.profile_pic})` }}
              className="profile-pic"
            />
            <div className="buttons">
              {address === profile.address && (
                <div className="mr-2">
                  <Link href="/creator-dashboard">
                    <a>
                      <Button
                        className="px-4"
                        style={{
                          marginTop: 15,
                          width: "100%",
                          borderRadius: 25,
                          display: "inline-block",
                        }}
                      >
                        Edit Profile
                      </Button>
                    </a>
                  </Link>
                </div>
              )}
              <div></div>
            </div>
          </div>

          <div className="profile-info">
            <div className="col-md-12">
              <div className="name">
                {profile.display_name || profile.username || address}
              </div>
              <div className="username">@{profile.username || address}</div>
              <p className="bio">{profile.bio}</p>
            </div>
            <div className="grid grid-cols-3 gap-8 p-4">
              {owned_nfts.docs.length > 0 ? (
                <>
                  {owned_nfts.docs.map((doc) => {
                    return (
                      // @ts-ignore
                      <TwNFTListItem doc={doc} key={doc.id} />
                    );
                  })}
                  <PaginationComponentV2
                    hasNextPage={owned_nfts.hasNextPage}
                    hasPrevPage={owned_nfts.hasPrevPage}
                    totalPages={owned_nfts.totalPages}
                    totalDocs={owned_nfts.totalDocs}
                    page={owned_nfts.page}
                    goNext={() =>
                      navigateOwnedNFTs(Number(owned_nfts.page) + 1)
                    }
                    goPrev={() =>
                      navigateOwnedNFTs(Number(owned_nfts.page) - 1)
                    }
                    loading={loadingOwnedNFTs}
                    setPage={(page) => navigateOwnedNFTs(Number(page))}
                  />
                </>
              ) : (
                <p>User has no owned nfts</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  await dbConnect();
  try {
    const address = ctx.query.address as any;
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
    const nftsWithMetadata = await NFT.paginate(
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

          if (returnObj.blurhash) {
            delete returnObj.image;
          }

          // Removing this to minimize total payload, get only what we need.
          delete returnObj.description;
          delete returnObj.mints;

          return returnObj;
        }
        return undefined;
      })
    );

    return {
      props: {
        profile: { ...profile },
        owned_nfts: JSON.stringify(nftsWithMetadata),
        address,
      },
    };
  } catch (err) {
    console.log({ err });
    return {
      props: {
        error: JSON.stringify(err),
      },
    };
  }
};
