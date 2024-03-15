import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox = ({ placeholder, handleChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
    </div>
    <input
      type="search"
      placeholder={placeholder}
      onChange={handleChange}
      className="block w-full pl-10 pr-3 py-2.5 rounded-md border border-black leading-5 bg-white focus:outline-none focus:border-blue-500 focus:ring-blue-500"
    />
  </div>
);

export default SearchBox;
