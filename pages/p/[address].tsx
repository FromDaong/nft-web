import { useEffect, useState } from "react";

import Axios from "axios";
import { Button } from "react-bootstrap";
import GumletImage from "../../components/Image/GumletImage";
import Layout from "../../components/Layout";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import PaginationComponentV2 from "../../components/Pagination";
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

  useEffect(() => {
    setLoadingOwnedNFTs(true);
    console.log({ address });
    if (address) {
      Axios.get(`/api/v2/profile/`)
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
    console.log({ owned_nfts });
  }, [owned_nfts]);

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
            <div className="grid grid-cols-3 gap-8">
              {owned_nfts.docs.length > 0 ? (
                <>
                  {owned_nfts.docs.map((doc) => {
                    const profilePic = `/api/v2/utils/images/fetchWithFallback?default=${doc.model_profile_pic}`;
                    return (
                      // @ts-ignore
                      <div key={doc.id} className="p-4 col-span-1">
                        <LazyLoad height={400} offset={600}>
                          <div className="p-2 w-full flex items-center justify-center">
                            <Link
                              href={`/creator/${doc.attributes[0].value.slice(
                                1,
                                -1
                              )}`}
                            >
                              <a>
                                <img
                                  className="w-16 h-16 rounded-full object-cover"
                                  src={profilePic}
                                />
                              </a>
                            </Link>
                          </div>
                          <div className="p-2 w-full flex items-center justify-center">
                            <img
                              className="rounded-md w-full h-96 object-cover"
                              src={`/api/v2/utils/images/fetchWithFallback?default=${doc.image}`}
                            />
                          </div>
                          <div className="p-2 bg-pink-400 flex justify-between">
                            <div className="block">
                              <p className="pb-2">{doc.name}</p>
                              {account === address && (
                                <span className="font-bold">Creator: </span>
                              )}
                              {doc.attributes[0].value.slice(1, -1)}
                            </div>
                            {typeof doc.list_price !== "undefined" && (
                              <div className="block">
                                <p className="pb-2">{doc.list_price}</p>
                                <p className="font-bold">BNB</p>
                              </div>
                            )}
                          </div>
                        </LazyLoad>
                      </div>
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
