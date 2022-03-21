import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Link from "next/link";
import ModelIcon from "../icons/Model";
import Photograph from "../icons/Photograph";
import axios from "axios";
import { useRouter } from "next/dist/client/router";

export default function NavbarQuickSearch() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <div className="quick-search">
      <form
        onSubmit={() => null}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Button bgColor="white" color="gray.800" onClick={onOpen}>
          <b>Search</b>
        </Button>
      </form>
      <SearchModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

const SearchModal = ({ isOpen, onClose }) => {
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
    if (isOpen) onClose();
  }, [router]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize={"xl"}>Search for anything on TreatDAO</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
