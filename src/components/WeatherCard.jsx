// src/components/WeatherCard.jsx
import React from 'react';

const WeatherCard = ({ weather }) => {
  return (
    <div className="mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-md max-w-md mx-auto transform hover:-translate-y-1 transition-all duration-300">
      <div className="grid grid-cols-2 items-center">
        {/* Left Column: City Name & Conditions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {weather.city}, {weather.country}
          </h2>
          <p className="capitalize text-gray-700 mt-2">
            Conditions: {weather.description}
          </p>
        </div>
        {/* Right Column: Temperature */}
        <div className="text-center">
          <p className="text-4xl sm:text-6xl font-bold text-gray-800">
            {Math.round(weather.temp)}°C
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
