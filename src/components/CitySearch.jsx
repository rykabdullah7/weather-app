// src/components/CitySearch.jsx
import React, { useState, useEffect } from "react";

const CitySearch = ({ onCitySelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      if (inputValue.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(
            inputValue
          )}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": "1a9f1918eemsh20786399055ebeap15247cjsne0e85f5c8076", // Replace with your key
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );

        // If response is not OK, log error and clear suggestions.
        if (!response.ok) {
          console.error("Error fetching cities. Status:", response.status);
          setSuggestions([]);
          return;
        }
        const data = await response.json();
        // Ensure data.data exists and is an array
        setSuggestions(data.data || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCities();
    }, 300); // Debounce by 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleSelect = (city) => {
    setInputValue(city.name);
    setSuggestions([]);
    onCitySelect(city);
  };

  // Hide suggestions shortly after input loses focus
  const handleBlur = () => {
    setTimeout(() => {
      setSuggestions([]);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Enter city name"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
      />

      {/* Skeleton Loader when loading */}
      {isLoading && (
        <div className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 p-2">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {!isLoading && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-md">
          {suggestions.map((city) => (
            <li
              key={city.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800 transition-colors"
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
