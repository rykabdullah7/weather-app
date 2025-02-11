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
const ForecastDisplay = ({ forecastData, currentWeather}) => {

    // Combine current weather (as "Now") with forecast data.
    const combinedData = [];
    if (currentWeather) {
      // Mark current weather with a flag so we know to render the "Now" card.
      combinedData.push({ isCurrent: true, ...currentWeather });
    }
    combinedData.push(...forecastData);

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
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto px-4">
      <Slider {...settings}>
        {combinedData.map((item, index) => (
          <div key={index} className="p-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-md text-center p-4 transform hover:-translate-y-1 transition-all duration-300">
            {item.isCurrent ? (
                <>
                  <h3 className="font-bold text-base sm:text-lg text-gray-800">Now</h3>
                  {item.icon && (
                    <img
                      src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                      alt="Current Weather Icon"
                      className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
                    />
                  )}
                  <p className="text-base sm:text-xl text-gray-700">
                    {Math.round(item.temp)}°C
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-base sm:text-lg text-gray-800">
                    {new Date(item.dt * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </h3>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
                  />
                  <p className="text-base sm:text-xl text-gray-700">
                    {Math.round(item.main.temp)}°C
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ForecastDisplay;