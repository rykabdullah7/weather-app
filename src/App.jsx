// src/App.jsx
import { useState } from "react";
import ForecastDisplay from "./components/ForecastDisplay";
import WeatherSkeleton from "./components/WeatherSkeleton";
import ForecastSkeleton from "./components/ForecastSkeleton";
import WeatherCard from "./components/WeatherCard";
import CitySearch from "./components/CitySearch";
import WritingAnimation from "./components/WritingAnimation"

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityData) => {
    setError("");
    setWeather(null);
    setForecast([]);

    // If cityData is not provided or empty, show an error.
    if (!cityData || !cityData.name) {
      setError("Please select a valid city.");
      return;
    }

    // Build query parameters based on available data.
    let query = "";
    if (cityData.latitude && cityData.longitude) {
      query = `lat=${cityData.latitude}&lon=${cityData.longitude}`;
    } else {
      query = `q=${encodeURIComponent(cityData.name)}`;
    }

    setLoading(true);
    try {
      // Fetch current weather using coordinates if available.
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`
      );
      if (!weatherResponse.ok) {
        throw new Error("City not found or error fetching weather.");
      }
      const weatherData = await weatherResponse.json();
      setWeather({
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        city: weatherData.name,
        country: weatherData.sys.country,
      });

      // Fetch forecast data using the same query.
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error("Error fetching forecast.");
      }
      const forecastData = await forecastResponse.json();
      // For simplicity, take the first 8 entries.
      setForecast(forecastData.list.slice(0, 8));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch weather using geolocation (latitude and longitude)
  const fetchWeatherByCoords = async (lat, lon) => {
    setError("");
    setWeather(null);
    setForecast([]);
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch weather data");
      }
      const data = await response.json();
      const weatherData = {
        temp: data.main.temp,
        description: data.weather[0].description,
        city: data.name,
        country: data.sys.country,
      };
      setWeather(weatherData);

      // Fetch forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error("Error fetching forecast");
      }
      const forecastData = await forecastResponse.json();
      // For simplicity, take the first 8 entries
      setForecast(forecastData.list.slice(0, 8));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle geolocation retrieval
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          setError("Error getting geolocation. Please allow location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Callback for when a city is selected from CitySearch
  const handleCitySelect = (cityData) => {
    setCity(cityData);
    fetchWeatherByCity(cityData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex flex-col items-center py-8 px-4">
      {/* Header */}
      <header className="w-full max-w-4xl mb-8">
       
        <WritingAnimation />
       
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        {/* City Search */}
        <div className="mb-8 w-full max-w-md mx-auto">
        <div className="mb-8 w-full max-w-md mx-auto">
          <CitySearch onCitySelect={handleCitySelect} />
        </div>

        {/* Buttons for Geolocation */}
        
          <button
            onClick={() => fetchWeatherByCity(city)}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition duration-200 shadow-md mb-4"
          >
            Get Weather
          </button>
          <button
            onClick={handleGetLocation}
            className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition duration-200 shadow-md"
          >
            Use Current Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-center">
            {error}
          </div>
        )}

        {/* Loading State with Skeletons */}
        {loading && (
          <>
            <WeatherSkeleton />
            <ForecastSkeleton />
          </>
        )}

        {/* Weather Display */}
        {!loading && weather && <WeatherCard weather={weather} />}

        {/* Forecast Slider */}
        {!loading && forecast.length > 0 && (
          <ForecastDisplay forecastData={forecast} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-5 pt-4 text-sm">
        &copy; {new Date().getFullYear()} Weather App | M. Abdullah Khan Abbasi | All rights reserved.
      </footer>
    </div>
  );
}

export default App;
