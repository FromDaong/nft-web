import { useCallback, useEffect, useState } from "react";

import Axios from "axios";
import { Button } from "react-bootstrap";
import Layout from "../../components/Layout";
import Link from "next/link";
import MoralisInstance from "../../utils/moralis";
import NFT from "../../models/NFT";
import NFTListItem from "../../components/NFTListItem";
import { NextPageContext } from "next";
import PaginationComponentV2 from "../../components/Pagination";
import Profile from "../../models/Profile";
import dbConnect from "../../utils/dbConnect";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/dist/client/router";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    address: "",
    banner_pic: "",
    profile_pic: "",
    username: "",
    display_name: "",
    bio: "",
  });
  const [owned_nfts, setOwnedNfts] = useState({
    docs: [],
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    totalDocs: 0,
  });

  const [loadingOwnedNFTs, setLoadingOwnedNFTs] = useState(false);
  const { account } = useMoralis();
  const router = useRouter();
  const { address } = router.query;
  console.log({ address });

  const fetchOwnedNFTs = useCallback(() => {
    setLoadingOwnedNFTs(true);
    if (address) {
      Axios.get(`/api/v2/profile/${address}`)
        .then((res) => {
          if (!res.data.err) {
            setProfile(res.data.profile);
            setOwnedNfts(res.data.owned_nfts);
            setLoadingOwnedNFTs(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingOwnedNFTs(false);
        });
    }
  }, [address]);

  useEffect(() => {
    fetchOwnedNFTs();
  }, []);

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
            <div className="order-container">
              {owned_nfts.docs.length > 0 ? (
                <>
                  {owned_nfts.docs.map((doc) => (
                    // @ts-ignore
                    <div key={doc._id}>
                      <NFTListItem
                        data={doc}
                        isOwner={account === address}
                        buttonLabel={undefined}
                        buttonFunction={undefined}
                        price={undefined}
                        owner={address}
                        soldOut={undefined}
                      />
                    </div>
                  ))}
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
