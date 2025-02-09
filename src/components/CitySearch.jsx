// src/components/CitySearch.jsx
import React, { useState, useEffect } from "react";

const CitySearch = ({ onCitySelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      if (inputValue.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${inputValue}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": "1a9f1918eemsh20786399055ebeap15247cjsne0e85f5c8076", // Replace with your key
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();
        // data.data is an array of city objects
        setSuggestions(data.data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCities();
    }, 300); // debounce input by 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleSelect = (city) => {
    setInputValue(city.name);
    setSuggestions([]);
    onCitySelect(city);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Enter city name"
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((city) => (
            <li
              key={city.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
              onClick={() => handleSelect(city)}
            >
              {city.name}, {city.countryCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
