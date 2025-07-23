import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWeatherStore } from "./../store.ts/weatherStore";

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

interface ForecastData {
  list: ForecastItem[];
}

function Forecast() {
  const forecast = useWeatherStore(
    (state) => state.forecastData
  ) as ForecastData | null;
  const navigate = useNavigate();

  // Show message if forecast data not available
  if (!forecast)
    return (
      <p className="text-center mt-10 text-gray-800 dark:text-white">
        No forecast available
      </p>
    );

  // Group forecast items by date (YYYY-MM-DD)
  const grouped = forecast.list.reduce(
    (acc: Record<string, ForecastItem[]>, item: ForecastItem) => {
      const date = item.dt_txt.split(" ")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {}
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-sky-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with back button and title */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => navigate("/details")}
            className="bg-white/30 dark:bg-white/10 text-sm text-gray-900 dark:text-white px-4 py-2 rounded-full hover:bg-white/50 transition"
          >
            ⬅ Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-center sm:text-left">
            📅 5-Day Forecast
          </h1>
        </div>

        {/* Grid displaying each day's average temperature and condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Object.entries(grouped).map(([date, items]) => {
            const temps = items.map((i) => i.main.temp);
            const avg = (
              temps.reduce((a, b) => a + b, 0) / temps.length
            ).toFixed(1);
            const description = items[0].weather[0].description;

            return (
              <motion.div
                key={date}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/30 p-5 rounded-2xl shadow-md text-center"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-2">{date}</h2>
                <p className="text-base sm:text-lg font-medium">
                  🌡 Avg Temp: <span className="font-bold">{avg}°C</span>
                </p>
                <p className="mt-1 capitalize text-sm text-gray-800 dark:text-gray-200">
                  ☁️ Condition: {description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default Forecast;
