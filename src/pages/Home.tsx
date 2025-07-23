import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Moon, Sun } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnim from "../assets/loading.json";
import { useEffect, useState } from "react";
import { useWeatherStore } from "../store.ts/weatherStore";

interface FormValues {
  city: string;
}

function Home() {
  const { register, handleSubmit, setValue } = useForm<FormValues>();
  const setWeatherData = useWeatherStore((state) => state.setWeatherData);
  const setForecastData = useWeatherStore((state) => state.setForecastData);
  const addToHistory = useWeatherStore((state) => state.addToHistory);
  const history = useWeatherStore((state) => state.history);
  const darkMode = useWeatherStore((state) => state.darkMode);
  const toggleDarkMode = useWeatherStore((state) => state.toggleDarkMode);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Apply dark mode class to root element based on store state
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Form submit handler to fetch weather and forecast data
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const [current, forecast] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=bb61fea02f708868d8b3d50d6737d6d0&units=metric`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${data.city}&appid=bb61fea02f708868d8b3d50d6737d6d0&units=metric`
        ),
      ]);
      setWeatherData(current.data);
      setForecastData(forecast.data);
      addToHistory(data.city);
      navigate("/details");
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300 bg-gradient-to-br from-blue-300 to-indigo-500 dark:from-gray-900 dark:to-gray-800">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Weather App
      </motion.h1>

      {/* Dark mode toggle button */}
      <div className="flex justify-end w-full max-w-lg mb-4">
        <button
          onClick={toggleDarkMode}
          className="text-white bg-black/30 dark:bg-white/20 p-2 rounded-full hover:scale-110 transition"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3 w-full max-w-lg"
      >
        <input
          {...register("city", { required: true })}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none dark:bg-gray-800 dark:text-white text-sm"
          placeholder="Enter city name"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all flex justify-center items-center"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Loading animation */}
      {isLoading && (
        <div className="mt-8 w-24 h-24 sm:w-32 sm:h-32">
          <Lottie animationData={loadingAnim} loop={true} />
        </div>
      )}

      {/* Search history buttons */}
      {!isLoading && history.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-700 rounded-xl shadow p-4 sm:p-6 w-full max-w-lg">
          <h2 className="font-bold text-lg mb-2 text-center text-gray-900 dark:text-white">
            Search History
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {history.map((city, index) => (
              <button
                key={index}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-sm px-3 py-1 rounded dark:text-white"
                onClick={() => {
                  setValue("city", city);
                  handleSubmit(onSubmit)();
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
