import { useEffect, useState } from "react";

import Hero from "../../components/Hero";
import ModelList from "../../components/ModelList";
import MyNFTItemSkeleton from "../../components/Skeleton/MyNFTItemSkeleton";
import PaginationComponentV2 from "../../components/Pagination";
import axios from "axios";
import { useRouter } from "next/dist/client/router";

const Creators = () => {
  const [apiResponseData, setApiResponseData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const modelData = apiResponseData.docs;

  useEffect(() => {
    const queryFilter = router.query.s;
    setSearchFilter(queryFilter ?? "");
  }, []);

  useEffect(() => {
    router.push(
      `${router.pathname}?${searchFilter && `s=${searchFilter}`}&p=1`,
      undefined,
      { shallow: true }
    );
  }, [searchFilter]);

  useEffect(() => {
    console.log("Route changed");
    setLoading(true);
    axios
      .get(
        `/api/model/with-subs?p=${router.query.p ?? 1}${
          searchFilter ? `&s=${router.query.s}` : ""
        }`
      )
      .then((res) => setApiResponseData(res.data))
      .then(() => setLoading(false));
  }, [router]);

  const navigate = (page) => {
    window.scrollTo(0, 0);

    router.push(
      `${router.pathname}?${searchFilter && `s=${searchFilter}&`}p=${page}`,
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <div>
        <Hero
          title={"Subscriptions"}
          subtitle={
            "Explore the creators who offer subscriptions on the TreatDAO platform"
          }
        />
        <div className="full-width-search white-tp-bg p-3 d-flex">
          <input
            placeholder="Type to search for a model..."
            type="text"
            className="flex-grow-1 pl-2"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ fontSize: "1.1em" }}
          />
        </div>
        <br />
        {!loading ? (
          <ModelList totwOnly={false} modelData={modelData || []} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full container mx-auto">
            {new Array(12).fill(0).map((_, i) => (
              <MyNFTItemSkeleton key={i} className="col-span-1" />
            ))}
          </div>
        )}
        <div className="flex justify-center py-2">
          <PaginationComponentV2
            hasNextPage={apiResponseData.hasNextPage}
            hasPrevPage={apiResponseData.hasPrevPage}
            totalPages={apiResponseData.totalPages}
            totalDocs={apiResponseData.totalDocs}
            page={apiResponseData.page}
            goNext={() => navigate(Number(apiResponseData.page) + 1)}
            goPrev={() => navigate(Number(apiResponseData.page) - 1)}
            loading={loading}
            setPage={(page) => navigate(Number(page))}
          />
        </div>
      </div>
    </>
  );
};

export default Creators;
