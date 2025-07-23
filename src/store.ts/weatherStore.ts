import { create } from "zustand";

// Represents the structure of current weather data
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
}

// Represents a single forecast entry (e.g., for one time slot)
interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
}

// Full forecast data containing multiple entries
interface ForecastData {
  list: ForecastItem[];
}

// Zustand store structure
interface WeatherState {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  setWeatherData: (data: WeatherData) => void;
  setForecastData: (data: ForecastData) => void;
  history: string[]; // Search history of city names
  addToHistory: (city: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create Zustand store with initial values pulled from localStorage
export const useWeatherStore = create<WeatherState>((set) => ({
  weatherData: JSON.parse(localStorage.getItem("weatherData") || "null"),
  forecastData: JSON.parse(localStorage.getItem("forecastData") || "null"),
  history: JSON.parse(localStorage.getItem("history") || "[]"),
  darkMode: JSON.parse(localStorage.getItem("darkMode") || "false"),

  // Updates current weather data and persists to localStorage
  setWeatherData: (data) => {
    localStorage.setItem("weatherData", JSON.stringify(data));
    set({ weatherData: data });
  },

  // Updates forecast data and persists to localStorage
  setForecastData: (data) => {
    localStorage.setItem("forecastData", JSON.stringify(data));
    set({ forecastData: data });
  },

  // Adds a city to search history, avoiding duplicates and keeping a max of 10
  addToHistory: (city) => {
    set((state) => {
      const updated = Array.from(new Set([city, ...state.history])).slice(0, 10);
      localStorage.setItem("history", JSON.stringify(updated));
      return { history: updated };
    });
  },

  // Toggles between dark and light mode and saves preference
  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return { darkMode: newMode };
    });
  },
}));
