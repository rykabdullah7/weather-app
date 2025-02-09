// src/WeatherSkeleton.jsx
import React from 'react';

const WeatherSkeleton = () => {
  return (
    <div className="mt-8 w-50 p-4 bg-gray-200 rounded shadow max-w-md mx-auto">
      {/* Placeholder for city and country */}
      <div className="h-8 w-3/4 mb-4 bg-gray-300 skeleton"></div>
      {/* Placeholder for temperature */}
      <div className="h-6 w-full mb-2 bg-gray-300 skeleton"></div>
      {/* Placeholder for weather conditions */}
      <div className="h-6 w-6/7 bg-gray-300 skeleton"></div>
    </div>
  );
};

export default WeatherSkeleton;
