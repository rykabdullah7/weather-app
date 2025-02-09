// src/ForecastDisplay.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Custom Next Arrow Component
// Custom Next Arrow Component
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} scale-150`}
      style={{ ...style, }}
      onClick={onClick}
    >
    </div>
  );
};

// Custom Prev Arrow Component
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} scale-150 `}
      style={{ ...style }}
      onClick={onClick}
    >
    </div>
  );
};
const ForecastDisplay = ({ forecastData }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
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
    <div className="mt-8 max-w-3xl mx-auto px-4">
      <Slider {...settings}>
        {forecastData.map((item, index) => (
          <div key={index} className="p-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-md text-center p-4 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">
                {new Date(item.dt * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </h3>
              <img 
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
                alt="Weather Icon" 
                className="mx-auto w-14 h-14 sm:w-16 sm:h-16" 
              />
              <p className="text-sm sm:text-base text-gray-700 mt-2">
                {item.main.temp}°C
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ForecastDisplay;