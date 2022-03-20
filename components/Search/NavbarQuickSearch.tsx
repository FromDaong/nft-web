import { useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import ModelIcon from "../icons/Model";
import Photograph from "../icons/Photograph";
import axios from "axios";
import { useRouter } from "next/dist/client/router";

export default function NavbarQuickSearch() {
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <div className="quick-search">
      <form
        onSubmit={() => null}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Button bgColor="white" color="gray.800" onClick={toggleShow}>
          <b>Search</b>
        </Button>
      </form>
      <SearchModal show={show} handleClose={toggleShow} />
    </div>
  );
}

const SearchModal = ({ show, handleClose }) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const onChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  useEffect(() => {
    fetchAutocomplete(searchText);
  }, [searchText]);

  const fetchAutocomplete = (val) => {
    if (!val) return setResults([]);
    axios
      .get(`/api/v2/search/autocomplete?s=${val}`)
      .then((res) => {
        if (!res.data.error) {
          setResults(res.data);
        } else {
          setError(null);
        }
      })
      .catch((err) => setError(err));
  };

  const doFetchAutocomplete = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (show) handleClose();
  }, [router]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search for anything on TreatDAO</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="quick-search">
          <form onSubmit={doFetchAutocomplete}>
            <input
              placeholder="Search Treat and Creators"
              className="full-width-search p-2 w-full"
              value={searchText}
              onChange={onChange}
            />
          </form>
        </div>
        {results.length > 0 && (
          <div className="quick-search-results w-full">
            {results.map((doc) => (
              <Link
                key={doc.id ?? doc.username}
                href={
                  doc.group === "nft"
                    ? `/view/${doc.id}`
                    : `/creator/${doc.username}`
                }
              >
                <a className="quick-search-results-item w-full">
                  <div className="quick-search-results-item w-full">
                    {doc.group === "nft" ? (
                      <Photograph className="size-2 mr-2" />
                    ) : (
                      <ModelIcon className="size-2 mr-2" />
                    )}
                    <p>{doc.group === "nft" ? doc.name : doc.username}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
