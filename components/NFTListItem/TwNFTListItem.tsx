import { Blurhash } from "react-blurhash";
import { EyeSlash } from "react-bootstrap-icons";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import { isBlurhashValid } from "blurhash";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/dist/client/router";

export default function TwNFTListItem({ data }: { data: any }) {
  const { account } = useMoralis();
  const router = useRouter();

  const profilePic = `/api/v2/utils/images/fetchWithFallback?default=${data.model_profile_pic}`;
  const isTOTMorOldTOTW =
    data.totw || data.totm || data.old_totw || data.old_totm;
  const { address } = router.query;

  return (
    <div
      className={`nft-card ${isTOTMorOldTOTW && "purple"}`}
      style={{ width: "100%" }}
    >
      <LazyLoad height={400} offset={600}>
        <div className="space-y-4 pt-12">
          <div className="w-full rounded-xl flex items-center justify-center h-96 border-2 border-primary2 bg-black relative">
            <Link
              href={`/creator/${data.attributes[0].value.replace("@", "")}`}
            >
              <a
                style={{
                  transform: "translateY(-50%)",
                }}
                className="absolute rounded-full border-2 border-primary2 top-0 z-10"
              >
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={profilePic}
                />
              </a>
            </Link>
            {data.image ? (
              <img
                className="rounded-xl w-full h-full object-cover border-2 border-primary2"
                src={`/api/v2/utils/images/fetchWithFallback?default=${data.image}`}
              />
            ) : (
              <>
                {isBlurhashValid(data.blurhash).result ? (
                  <>
                    <div className="info-overlay" style={{ zIndex: 100 }}>
                      <EyeSlash size={32} />
                      <div>Purchase to View</div>
                    </div>
                    <Blurhash
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                        zIndex: 95,
                      }}
                      hash={data.blurhash}
                      width={"100%"}
                      height={375}
                      resolutionX={32}
                      resolutionY={32}
                      punch={1}
                    />
                  </>
                ) : (
                  <h3 className="text-center p4">
                    Please contact admin. Invalid Blurhash.
                  </h3>
                )}
              </>
            )}
          </div>
          <div className="p-2 text-white bg-primary rounded-lg flex justify-between w-full">
            <div className="block pr-3">
              <p className="pb-2 font-bold">{data.name}</p>
              {account === address && (
                <span className="font-bold">Creator: </span>
              )}
              {data.attributes[0].value.replace("@", "")}
            </div>
            {typeof data.list_price !== "undefined" && (
              <div className="block">
                <p className="pb-2 font-bold text-left">{data.list_price}</p>
                <p className="font-bold">BNB</p>
              </div>
            )}
          </div>
        </div>
      </LazyLoad>
    </div>
  );
}
