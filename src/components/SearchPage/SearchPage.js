import { useState } from "react";
import {fetchData} from "../../services/search";
import Nav from "../Nav/Nav";
import { ReactComponent as SearchIcon } from "../../assets/icons/search-icon.svg";
import SearchResults from "../SearchResults/SearchResults";
import "./SearchPage.css";

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchQuery = e.target.elements.searchInput.value;
    try {
      const data = await fetchData(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error gracefully, e.g., show error message to the user
    }
  };

  console.log(searchResults)

  return (
    <>
      <Nav />
      <main>
        <section id="search-section" className="grid">
          <div id="search-box">
            <SearchIcon />
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Type your medicine name here"
                className="search-input"
                name="searchInput"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </section>
        <SearchResults results={searchResults} />
      </main>
    </>
  );
}

export default SearchPage;
