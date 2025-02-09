// src/ForecastSkeleton.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ForecastSkeleton = () => {
  // Slider settings to match your ForecastDisplay component
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <Slider {...settings}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="p-2">
            <div className="bg-gray-200 rounded shadow text-center p-4">
              {/* Placeholder for time */}
              <div className="h-6 w-1/2 mb-2 bg-gray-300 skeleton mx-auto"></div>
              {/* Placeholder for icon */}
              <div className="h-16 w-full mb-2 bg-gray-300 skeleton"></div>
              {/* Placeholder for temperature */}
              <div className="h-6 w-1/3 bg-gray-300 skeleton mx-auto"></div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ForecastSkeleton;
