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

const Creators = () => {
  // TODO Get models total items
  // get data for relevant models (startIndex endIndex)
  const { data: modelData, error } = useSWR(`/api/model`);
  const [searchFilter, setSearchFilter] = useState("");
  const [initialRender, setInitialRender] = useState(true);

  const router = useRouter();

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
    setPage(persistedPageNumber ?? 1);
    setInitialRender(false);
  }, []);

  useEffect(() => {
    router.push(
      `/${router.pathname}?s=${searchFilter}&p=${currentPage}`,
      undefined,
      { shallow: true }
    );
  }, [searchFilter, currentPage]);

  useEffect(() => {
    if (!initialRender) {
      setPage(0);
    }
  }, [searchFilter, sortBy]);

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
        {!error ? (
          <ModelList
            totwOnly={false}
            endIndex={endIndex}
            startIndex={startIndex}
            modelData={filteredArray || []}
          />
        ) : (
          <ErrorFallback custom="Failed to load models" />
        )}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          setPage={setPage}
          setPageSize={setPageSize}
          setNextPage={setNextPage}
          setPreviousPage={setPreviousPage}
        />
      </motion.main>
    </>
  );
};

export default Creators;
