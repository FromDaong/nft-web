import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ModelList from "../components/ModelList";
import { motion } from "framer-motion";
import useSWR from "swr";
import PaginationComponent from "../components/PaginationComponent";
import { usePagination } from "react-use-pagination";
import Fuse from "fuse.js";
import ErrorFallback from "../components/Fallback/Error";
import { useRouter } from "next/dist/client/router";
import axios from "axios";
import PaginationComponentV2 from "../components/Pagination";

const Creators = () => {
  // TODO Get models total items
  // get data for relevant models (startIndex endIndex)
  const [apiResponseData, setApiResponseData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [persistedPageNumber, setPersistedPageNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const modelData = apiResponseData.docs;

  console.log({ apiResponseData, modelData });

  useEffect(() => {
    setLoading(true);
    axios.get("/api/model").then((res) => {
      if (!res.data.error) {
        setApiResponseData(res.data);
        setLoading(false);
      }
    });
  }, []);

  const fuse = new Fuse(modelData, {
    keys: ["username", "display_name"],
    shouldSort: true,
    useExtendedSearch: true,
    includeScore: true,
  });

  let filteredArray;
  // yes search + no dropdown
  if (searchFilter !== "") {
    filteredArray = fuse.search({
      $or: [{ username: searchFilter }, { display_name: searchFilter }],
    });
  } else {
    filteredArray =
      modelData &&
      modelData.map((d, idx) => ({
        item: d,
        refIndex: idx,
      }));
  }

  useEffect(() => {
    const queryFilter = router.query.s;
    setSearchFilter(queryFilter ?? "");
  }, []);

  useEffect(() => {
    if (searchFilter) {
      router.push(
        `${router.pathname}?${searchFilter && `s=${searchFilter}&`}${
          currentPage && `p=${apiResponseData.page}`
        }`,
        undefined,
        { shallow: true }
      );
    }
  }, [searchFilter]);

  useEffect(() => {
    if (filteredArray && persistedPageNumber) {
      setPage(persistedPageNumber);
      setPersistedPageNumber(null);
    }
  }, [filteredArray]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/model?p=${router.query.p ?? 1}`)
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
      <motion.main
        variants={{
          hidden: { opacity: 0, x: -200, y: 0 },
          enter: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 0, y: -100 },
        }}
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className=""
      >
        <Hero
          title={"Our Creators"}
          subtitle={
            "Explore the creators creating content on the TreatDAO platform"
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
          <ModelList totwOnly={false} modelData={filteredArray || []} />
        ) : (
          <ErrorFallback custom="Failed to load models" />
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
      </motion.main>
    </>
  );
};

Creators.getInitialProps = async ({ query: { search } }) => {
  return { search };
};

export default Creators;
