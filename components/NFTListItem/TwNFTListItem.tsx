import { Blurhash } from "react-blurhash";
import { EyeSlash } from "react-bootstrap-icons";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import { isBlurhashValid } from "blurhash";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/dist/client/router";

export default function TwNFTListItem({ doc }: { doc: any }) {
  const { account } = useMoralis();
  const router = useRouter();

  const profilePic = `/api/v2/utils/images/fetchWithFallback?default=${doc.model_profile_pic}`;
  const { address } = router.query;

  return (
    <div className="p-2 rounded-xl col-span-1 border-3 border-primary">
      <LazyLoad height={400} offset={600}>
        <div className="space-y-4 pt-12">
          <div className="w-full rounded-xl flex items-center justify-center h-96 border-2 border-primary2 bg-black relative">
            <Link href={`/creator/${doc.attributes[0].value.slice(1, -1)}`}>
              <a
                style={{
                  transform: "translateY(-50%)",
                }}
                className="absolute rounded-full border-2 border-primary2 top-0"
              >
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={profilePic}
                />
              </a>
            </Link>
            {doc.image ? (
              <img
                className="rounded-xl w-full h-full object-cover border-2 border-primary2"
                src={`/api/v2/utils/images/fetchWithFallback?default=${doc.image}`}
              />
            ) : (
              <>
                {isBlurhashValid(doc.blurhash).result ? (
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
                      hash={doc.blurhash}
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
              <p className="pb-2 font-bold">{doc.name}</p>
              {account === address && (
                <span className="font-bold">Creator: </span>
              )}
              {doc.attributes[0].value.slice(1, -1)}
            </div>
            {typeof doc.list_price !== "undefined" && (
              <div className="block">
                <p className="pb-2 font-bold">{doc.list_price}</p>
                <p className="font-bold">BNB</p>
              </div>
            )}
          </div>
        </div>
      </LazyLoad>
    </div>
  );
}
