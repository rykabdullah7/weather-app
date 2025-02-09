// src/App.jsx
import { useState } from "react";
import ForecastDisplay from "./components/ForecastDisplay";
import WeatherCard from "./components/WeatherCard";
import WeatherSkeleton from "./components/WeatherSkeleton";
import ForecastSkeleton from "./components/ForecastSkeleton";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather using city name
  const fetchWeatherByCity = async () => {
    setError("");
    setWeather(null);
    setForecast([]);

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );
      if (!weatherResponse.ok) {
        throw new Error("City not found");
      }
      const weatherData = await weatherResponse.json();
      setWeather({
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        city: weatherData.name,
        country: weatherData.sys.country,
      });

      // Fetch forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error("Error fetching forecast");
      }
      const forecastData = await forecastResponse.json();
      // For simplicity, take the first 8 entries
      setForecast(forecastData.list.slice(0, 10));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex flex-col items-center py-8 px-4">
      {/* Header */}
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold  text-center drop-shadow-lg">
          Weather App
        </h1>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        {/* Input & Buttons */}
        <div className="mb-8 w-full max-w- mx-auto bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter city name"
            className="flex-1 p-3 bg-transparent border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={fetchWeatherByCity}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Get Weather
          </button>
          <button
            onClick={handleGetLocation}
            className="flex-1 bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition duration-200 shadow-md"
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
        &copy; {new Date().getFullYear()} Weather App. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
