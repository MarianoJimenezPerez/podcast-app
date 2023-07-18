import React, { useState } from "react";

const SearchBar = ({ onSearch, searchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div className="search__bar">
      <div className="container">
        <div className="search__box">
          <h2>{searchResults.length}</h2>
          <form action="">
            <input
              type="text"
              placeholder="Buscar podcasts..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
