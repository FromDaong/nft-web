import { CameraFill, PlusCircle } from "react-bootstrap-icons";

import { Button } from "@chakra-ui/react";
import CreatorNFTItem from "../../components/CreatorNFTItem";
import Link from "next/link";

const variants = {
  show: {
    transition: { staggerChildren: 0.25 },
    when: "afterChildren",
    opacity: 1,
  },
  hidden: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const CreatedNFTs = ({
  transferNFTClick,
  listOrderClick,
  isLoading,
  nftData,
  modelData,
}) => {
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
            <CameraFill className="pb-1 mr-1" /> Sweet Shop NFTs
          </h2>
        </div>

        <Link href="/dashboard/create-nft">
          <a>
            <Button
              className="bg-primary text-white font-bold"
              style={{ maxWidth: 250 }}
            >
              <b>
                <PlusCircle className="pb-1 mr-2" size={24} />
                {"CREATE NEW NFTs"}
              </b>
            </Button>
          </a>
        </Link>
      </div>
      {nftData && nftData.nfts.length > 0 ? (
        <div className="container">
          <div className="d-flex text-left justify-content-center mt-5">
            <div
              className="row w-100"
              animate="show"
              exit="hidden"
              initial="hidden"
              variants={variants}
            >
              {nftData.nfts.map((nft) => {
                return (
                  nft && (
                    <div className="col-md-6 bg-transparent border-0">
                      <CreatorNFTItem
                        balance={nft.balance}
                        isLoading={isLoading}
                        data={nft}
                        price={nft.list_price}
                        transferNFTClick={transferNFTClick}
                        listOrderClick={listOrderClick}
                        modelData={modelData}
                        hasOpenOrder={nft.hasOpenOrder}
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
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
          You haven't created any NFTs yet
        </div>
      )}
    </div>
  );
};

export default CreatedNFTs;
