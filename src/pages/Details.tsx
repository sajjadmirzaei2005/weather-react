import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWeatherStore } from "./../store.ts/weatherStore";
import Lottie from "lottie-react";

import sunnyAnim from "../assets/sun.json";
import rainAnim from "../assets/rain.json";
import cloudyAnim from "../assets/cloud.json";
import snowAnim from "../assets/snow.json";

function Details() {
  const data = useWeatherStore((state) => state.weatherData);
  const navigate = useNavigate();

  // Show message if no weather data is available
  if (!data)
    return (
      <p className="text-center mt-10 text-gray-800 dark:text-white">
        No data available
      </p>
    );

  // Select appropriate Lottie animation based on weather condition
  const getAnimation = () => {
    const weatherMain = data.weather[0].main.toLowerCase();
    if (weatherMain.includes("rain") || weatherMain.includes("drizzle"))
      return rainAnim;
    if (weatherMain.includes("cloud")) return cloudyAnim;
    if (weatherMain.includes("clear")) return sunnyAnim;
    if (weatherMain.includes("snow")) return snowAnim;
    return sunnyAnim; // Default animation
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white flex items-center justify-center"
    >
      <div className="w-full max-w-md bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30">
        {/* Back button to navigate to home */}
        <div className="mb-4 flex justify-start">
          <button
            onClick={() => navigate("/")}
            className="text-sm bg-white/30 dark:bg-white/10 text-gray-800 dark:text-white px-4 py-2 rounded-full hover:bg-white/50 transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* Display city name */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center mb-6">
          {data.name}
        </h1>

        {/* Weather animation and info */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-36 h-36 sm:w-40 sm:h-40">
            <Lottie animationData={getAnimation()} loop />
          </div>

          {/* Temperature, humidity, and condition */}
          <div className="text-center space-y-2 text-base sm:text-lg">
            <p className="font-semibold">
              🌡 Temperature:{" "}
              <span className="font-bold">{data.main.temp}°C</span>
            </p>
            <p className="font-semibold">
              💧 Humidity:{" "}
              <span className="font-bold">{data.main.humidity}%</span>
            </p>
            <p className="font-semibold capitalize">
              ☁️ Condition: {data.weather[0].description}
            </p>
          </div>
        </div>

        {/* Button to navigate to 5-day forecast */}
        <button
          onClick={() => navigate("/forecast")}
          className="w-full mt-6 bg-blue-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          View 5-Day Forecast
        </button>
      </div>
    </motion.div>
  );
}

export default Details;
