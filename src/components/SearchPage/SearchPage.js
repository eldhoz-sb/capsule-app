import Nav from "../Nav/Nav";
import { ReactComponent as SearchIcon } from "../../assets/icons/search-icon.svg";
import SearchResults from "../SearchResults/SearchResults";
import './SearchPage.css'

function SearchPage() {
  return (
    <>
      <Nav />
      <main>
        <section id="search-section" className="grid">
          <div id="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Type your medicine name here"
              className="search-input"
            />
            <button className="search-button">Search</button>
          </div>
        </section>
        <SearchResults />
      </main>
    </>
  );
}

export default SearchPage;
