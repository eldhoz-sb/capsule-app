// SearchResults.js
import React from "react";
import "./SearchResults.css";
import SaltItemList from "./components/SaltItemList";

function SearchResults({ results }) {
  return (
    <section id="search-results" className="grid">
      {results && results.data && results.data.saltSuggestions ? (
        <SaltItemList salts={results.data.saltSuggestions} />
      ) : (
        <span className="search-results-placeholder">
          “Find medicines with amazing discount“
        </span>
      )}
    </section>
  );
}

export default SearchResults;