// src/components/WeatherCard.jsx
import React from 'react';

const WeatherCard = ({ weather }) => {
  return (
    <div className="mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-md max-w-md mx-auto transform hover:-translate-y-1 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        {weather.city}, {weather.country}
      </h2>
      <p className="text-xl mb-1 text-gray-700">Temperature: {weather.temp}°C</p>
      <p className="capitalize text-gray-700">Conditions: {weather.description}</p>
    </div>
  );
};

export default WeatherCard;
