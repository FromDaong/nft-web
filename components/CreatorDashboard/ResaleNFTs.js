import { ArrowRepeat } from "react-bootstrap-icons";
import BigNumber from "bignumber.js";
import { Box } from "@chakra-ui/react";
import ErrorFallback from "../Fallback/Error";
import LazyLoad from "react-lazyload";
import MyNFTItem from "../MyNFTItem";
import MyNFTItemSkeleton from "../Skeleton/MyNFTItemSkeleton";
import PaginationComponentV2 from "../Pagination";
import { getDisplayBalance } from "../../utils/formatBalance";
import { useMoralis } from "react-moralis";

const ResaleNFTs = ({
  resaleNFTData,
  cancelOrderClick,
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
            <ArrowRepeat className="pb-1 mr-1" />
            Listed on Resale Marketplace
          </h2>
        </div>
      </div>
      <Box className="w-full">
        <RenderResaleNFTs
          cancelOrderClick={cancelOrderClick}
          resaleNFTData={resaleNFTData}
          revealNFTs={resaleNFTData}
          isLoading={isLoading}
          navigate={navigate}
          error={error}
        />
      </Box>
    </div>
  );
};

const RenderResaleNFTs = ({
  resaleNFTData,
  cancelOrderClick,
  isLoading,
  navigate,
  error,
}) => {
  if (error) {
    return <ErrorFallback custom="Failed to load Resale NFT's" />;
  }
  return (
    <div className="" style={{ minHeight: 400 }}>
      {resaleNFTData.docs.length > 0 && !isLoading ? (
        <div className="container px-4 ">
          <div className="d-flex text-left mt-5">
            <div
              className="d-flex text-left mt-5 w-100 flex-wrap justify-content-center"
              animate="show"
              exit="hidden"
              initial="hidden"
            >
              {resaleNFTData.docs.map((nft) => {
                return (
                  <LazyLoad key={nft.id} height={400} offset={600}>
                    <div className="order-container">
                      <MyNFTItem
                        price={
                          nft &&
                          nft.price &&
                          getDisplayBalance(new BigNumber(nft.price))
                        }
                        balance={nft.quantity}
                        data={nft}
                        isLoading={isLoading}
                        cancelOrderClick={cancelOrderClick}
                      />
                    </div>
                  </LazyLoad>
                );
              })}
            </div>
          </div>
          {resaleNFTData.docs.length > 0 && (
            <div className="flex justify-center py-2">
              <PaginationComponentV2
                hasNextPage={resaleNFTData.hasNextPage}
                hasPrevPage={resaleNFTData.hasPrevPage}
                totalPages={resaleNFTData.totalPages}
                totalDocs={resaleNFTData.totalDocs}
                page={resaleNFTData.page}
                goNext={() =>
                  navigate("resale", Number(resaleNFTData.page) + 1)
                }
                goPrev={() =>
                  navigate("resale", Number(resaleNFTData.page) - 1)
                }
                loading={isLoading}
                setPage={(page) => navigate("resale", Number(page))}
              />
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full container mx-auto"
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
          You haven&#39;t listed any NFTs for resale yet.
        </div>
      )}
    </div>
  );
};

export default ResaleNFTs;
