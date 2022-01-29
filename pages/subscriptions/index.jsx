import Hero from "../../components/Hero";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import Axios from "axios";
import PaginationComponent from "../../components/PaginationComponent";
import ModelList from "../../components/ModelList";
import { usePagination } from "react-use-pagination";
import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import ErrorFallback from "../../components/Fallback/Error";
import { useRouter } from "next/dist/client/router";
import dbConnect from "../../utils/dbConnect";
import Model from "../../models/Model";

export default function Index(props) {
  // TODO Get models total items
  // get data for relevant models (startIndex endIndex)
  const [searchFilter, setSearchFilter] = useState("");
  const [persistedPageNumber, setPersistedPageNumber] = useState(0);
  const router = useRouter();

  let {returnModels: modelData} = props
  modelData = JSON.parse(modelData)
  const loadingError = undefined

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

  const {
    currentPage,
    totalPages,
    setPage,
    setPageSize,
    setNextPage,
    setPreviousPage,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: filteredArray ? filteredArray.length + 1 : 0,
    initialPageSize: 25,
  });

  useEffect(() => {
    const queryFilter = router.query.s;
    const persistedPageNumber = router.query.p;

    setSearchFilter(queryFilter ?? "");
    setPersistedPageNumber(
      persistedPageNumber ? Number(persistedPageNumber) : 0
    );
  }, []);

  useEffect(() => {
    if (searchFilter || currentPage) {
      router.push(
        `${router.pathname}?${searchFilter && `s=${searchFilter}&`}${
          currentPage && `p=${currentPage}`
        }`,
        undefined,
        { shallow: true }
      );
    }
  }, [searchFilter, currentPage]);

  useEffect(() => {
    if (filteredArray && persistedPageNumber) {
      setPage(persistedPageNumber);
      setPersistedPageNumber(null);
    }
  }, [filteredArray]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

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
        <Layout>
          <div className="subscriptions">
            <Hero
              title={"Subscriptions"}
              subtitle={
                "Explore the creators with subscriptions to offer on the TreatDAO platform"
              }
            />
          </div>
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
          {!loadingError || !modelData ? <>
              {!filteredArray && !loadingError ? (
                <Loading />
              ) : loadingError ? (
                <ErrorFallback
                  custom={"Failed to load models with subscriptions."}
                />
              ) : (
                <ModelList
                  totwOnly={false}
                  endIndex={endIndex}
                  startIndex={startIndex}
                  modelData={filteredArray || []}
                />
              )}
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setPage}
                setPageSize={setPageSize}
                setNextPage={setNextPage}
                setPreviousPage={setPreviousPage}
              />
          </> : <ErrorFallback customTitle={"Failed to load models with subscriptions."} custom={loadingError} />}
        </Layout>
      </motion.main>
    </>
  );
}

export const getServerSideProps = async context => {
  dbConnect();

  try {
    const Models = await Model.find({ subscription: { $exists: true } });

    const returnModels = await Models.map((n) => {
      const returnObj = { ...n.toObject() };
      return returnObj;
    });

    return {
      props: {
        returnModels: JSON.stringify(returnModels),
      },
    };
  } catch(err) {
    console.log({err})
    return {
      props: {
        modelData: [],
        error: "Failed to load models with subscriptions."
      }
    }
  }
}