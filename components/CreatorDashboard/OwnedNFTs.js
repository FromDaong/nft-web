import { Box, Button } from "@chakra-ui/react";
import { Clipboard, PiggyBankFill } from "react-bootstrap-icons";

import ErrorFallback from "../Fallback/Error";
import LazyLoad from "react-lazyload";
import MyNFTItem from "../MyNFTItem";
import MyNFTItemSkeleton from "../Skeleton/MyNFTItemSkeleton";
import PaginationComponentV2 from "../Pagination";
import { useMoralis } from "react-moralis";

const OwnedNFTs = ({
  ownedNFTData,
  transferNFTClick,
  listOrderClick,
  isLoading,
  navigate,
  error,
}) => {
  const { account } = useMoralis();

  return (
    <div className="white-tp-bg" style={{ minHeight: 400 }}>
      <div
        className="px-4 py-2 w-100 d-flex"
        style={{
          background: "#FFFDF2",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <div>
          <h2
            className="heading-text-primary pt-1"
            style={{
              fontSize: 24,
            }}
          >
            <PiggyBankFill className="pb-1 mr-1" /> My NFTs
          </h2>
        </div>

        <Button
          className="bg-primary text-white font-bold"
          style={{ maxWidth: 250 }}
          onClick={() => {
            navigator.clipboard.writeText(
              `https://treatdao.com/become-creator?r=${account}`
            );
          }}
        >
          <b>
            <Clipboard className="pb-1 mr-2" size={24} />
            {"COPY REFERRAL LINK"}
          </b>
        </Button>
      </div>
      <Box className="w-full">
        <RenderOwnedNFTs
          listOrderClick={listOrderClick}
          transferNFTClick={transferNFTClick}
          ownedNFTData={ownedNFTData}
          isLoading={isLoading}
          navigate={navigate}
          error={error}
        />
      </Box>
    </div>
  );
};

const RenderOwnedNFTs = ({
  ownedNFTData,
  transferNFTClick,
  listOrderClick,
  isLoading,
  navigate,
  error,
}) => {
  if (error) {
    return <ErrorFallback custom="Failed to load my NFT's" />;
  }
  return (
    <div className="full-width white-tp-bg" style={{ minHeight: 400 }}>
      {ownedNFTData.docs.length && !isLoading > 0 ? (
        <div className="">
          <div
            className="d-flex text-left justify-content-center mt-5 w-100 flex-wrap"
            animate="show"
            exit="hidden"
            initial="hidden"
          >
            {ownedNFTData.docs.map((nft) => (
              <LazyLoad key={nft.id} height={400} offset={600}>
                <div className="order-container">
                  <MyNFTItem
                    balance={nft.balance}
                    isLoading={isLoading}
                    data={nft}
                    transferNFTClick={transferNFTClick}
                    listOrderClick={listOrderClick}
                    hasOpenOrder={nft.hasOpenOrder}
                  />
                </div>
              </LazyLoad>
            ))}
          </div>
          {ownedNFTData.docs.length > 0 && (
            <div className="flex justify-center py-2">
              <PaginationComponentV2
                hasNextPage={ownedNFTData.hasNextPage}
                hasPrevPage={ownedNFTData.hasPrevPage}
                totalPages={ownedNFTData.totalPages}
                totalDocs={ownedNFTData.totalDocs}
                page={ownedNFTData.page}
                goNext={() => navigate("owned", Number(ownedNFTData.page) + 1)}
                goPrev={() => navigate("owned", Number(ownedNFTData.page) - 1)}
                loading={isLoading}
                setPage={(page) => navigate("owned", Number(page))}
              />
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
          className="full-width"
        >
          {new Array(12).fill(0).map((_, i) => (
            <MyNFTItemSkeleton key={i} className="col-span-1" />
          ))}
        </div>
      ) : error ? (
        <div>{JSON.stringify(error)}</div>
      ) : (
        <div
          className="w-100 text-center font-weight-bold d-flex align-items-center justify-content-center h-100"
          style={{
            color: "#333",
            marginTop: -20,
            height: "100%",
            minHeight: 200,
          }}
        >
          You do not own any NFTs at the moment.
        </div>
      )}
    </div>
  );
};

export default OwnedNFTs;
