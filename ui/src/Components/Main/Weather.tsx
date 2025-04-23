import React, { useEffect, useState } from "react";
import {
  FaSun,
  FaCloudSun,
  FaCloudRain,
  FaCloud,
  FaCloudShowersHeavy,
} from "react-icons/fa"; // Importing icons from react-icons
import api from "../utils/api";
import dayjs from "dayjs";

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  dt_txt: string; // timestamp of the forecasted period
}

const Weather: React.FC = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getWeatherForecast(latitude, longitude);
    });
  }, []);

  const getWeatherForecast = async (lat: number, lon: number) => {
    try {
      const response = await api.get(`/utils/weather?lat=${lat}&lon=${lon}`);
      setForecastData(response.data.list); // Assuming 'list' contains the 5-day forecast data
    } catch (error) {
      console.error("Error fetching forecast data", error);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case "01d":
      case "01n":
        return <FaSun className="text-yellow-500 w-16 h-16" />;
      case "02d":
      case "02n":
        return <FaCloudSun className="text-yellow-500 w-16 h-16" />;
      case "03d":
      case "03n":
        return <FaCloud className="text-gray-400 w-16 h-16" />;
      case "04d":
      case "04n":
        return <FaCloud className="text-gray-500 w-16 h-16" />;
      case "09d":
      case "09n":
        return <FaCloudShowersHeavy className="text-blue-500 w-16 h-16" />;
      case "10d":
      case "10n":
        return <FaCloudRain className="text-blue-500 w-16 h-16" />;
      default:
        return <FaCloud className="text-gray-300 w-16 h-16" />;
    }
  };

  const groupForecastByDay = () => {
    const groupedData: { [key: string]: ForecastData[] } = {};

    forecastData.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
      groupedData[day].push(forecast);
    });

    // Sort the forecast data by time (ascending)
    Object.keys(groupedData).forEach((day) => {
      groupedData[day].sort((a, b) => a.dt - b.dt);
    });

    return groupedData;
  };

  if (forecastData.length === 0) return <div>Loading...</div>;

  const groupedData = groupForecastByDay();

  return (
    <div className="">
      <h3 className="text-center text-2xl font-bold text-gray-800 mb-4">
        5-Day Weather Forecast
      </h3>
      <div id="weather" className="p-3 grid grid-cols-6">
        {/* 5-Day Forecast */}
        {Object.keys(groupedData).map((day, index) => (
          <div key={index} className="flex justify-center space-x- mt-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{day}</h2>
              {groupedData[day].map((forecast, idx) => {
                const temp = Math.round(forecast.main.temp - 273.15); // Convert from Kelvin to Celsius
                return (
                  <div key={idx} className="bg-white p-4 m-1 rounded-lg shadow-md">
                    {getWeatherIcon(forecast.weather[0].icon)}
                    <p className="text-lg font-semibold">{temp}°C</p>
                    <p className="text-sm text-gray-600">
                      {dayjs(forecast.dt_txt).format("hh:mm A")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {forecast.weather[0].description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
