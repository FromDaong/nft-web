import { useEffect, useState } from "react";
import axios from "axios";

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
    </div>
  );
}
