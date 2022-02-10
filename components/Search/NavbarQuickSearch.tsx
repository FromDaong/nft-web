import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function NavbarQuickSearch() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  useEffect(() => {
    fetchAutocomplete(searchText);
  }, [searchText]);

  const fetchAutocomplete = (val) => {
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

  console.log({ results, error });

  return (
    <div className="quick-search">
      <form onSubmit={doFetchAutocomplete}>
        <input
          placeholder="Search Treat and Creators"
          className="full-width-search p-2"
          value={searchText}
          onChange={onChange}
        />
      </form>
      {results && (
        <div className="quick-search-results">
          {results.map((doc) => (
            <Link
              href={
                doc.type === "nft"
                  ? `/view/${doc.id}`
                  : `/creator/${doc.username}`
              }
            >
              <a>
                <div className="quick-search-results-item">
                  <p>{doc.group === "nft" ? doc.name : doc.username}</p>
                  <p className="totm-tag">{doc.type}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
