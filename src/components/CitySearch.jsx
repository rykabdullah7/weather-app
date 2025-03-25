// src/components/CitySearch.jsx
import React, { useState, useEffect, useRef } from "react";

const CitySearch = ({ onCitySelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // If a city has been selected, do not fetch new suggestions.
    if (selectedCity) {
      setSuggestions([]);
      return;
    }
    if (inputValue.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(
            inputValue
          )}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY, // Replace with your key if needed
              "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
            },
          }
        );
        if (!response.ok) {
          console.error("Error fetching cities. Status:", response.status);
          setSuggestions([]);
          return;
        }
        const data = await response.json();
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
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, selectedCity]);

  // Listen for clicks outside the component to close the suggestions.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSelect = (city) => {
    setInputValue(city.name);
    setSelectedCity(city);
    setSuggestions([]);
    onCitySelect(city);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        placeholder="Enter city name"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          // Clear any previous selection if the user starts typing
          setSelectedCity(null);
        }}
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
              onPointerDown={(e) => {
                // Using onPointerDown handles both mouse and touch events.
                e.preventDefault();
                handleSelect(city);
              }}
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
