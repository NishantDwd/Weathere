import { useState } from "react";
import {
  CloudSun, Droplets, Wind, ThermometerSun, AlertTriangle, ArrowDown, ArrowUp, Sunrise, Sunset, Droplet, Star,
} from "lucide-react";
import toast from "react-hot-toast";

// Always use this function for local time
function formatLocalTime(unixUtc, timezoneOffset) {
  if (!unixUtc || typeof timezoneOffset !== "number") return "-";
  // unixUtc and timezoneOffset are both in seconds
  // This gives the correct local time for the city
  return new Date((unixUtc + timezoneOffset) * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WeatherCard({ weather, forecast = [], onAddFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    try {
      if (!isFavorite) {
        await onAddFavorite(weather);
        setIsFavorite(true);
        toast.success("Added to favorites!");
      } else {
        toast.error("Already in favorites!");
      }
    } catch (err) {
      toast.error("Failed to add to favorites.");
    }
  };

  // Use forecast[0] for today's min/max if available, else fallback to current
  const minTemp = forecast[0]?.min_temp ?? weather.main?.temp_min;
  const maxTemp = forecast[0]?.max_temp ?? weather.main?.temp_max;

  // Ensure timezone is a number (OpenWeatherMap gives seconds offset)
  const timezoneOffset = typeof weather.timezone === "number" ? weather.timezone : 0;

  if (!weather) return null;
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/20 dark:bg-zinc-900/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 relative">
      {/* Favorite Star Button */}
      <button
        onClick={handleFavorite}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/70 dark:bg-zinc-900/70 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
        aria-label={isFavorite ? "Already in favorites" : "Add to favorites"}
        type="button"
      >
        <Star
          className={`w-6 h-6 transition-colors ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-zinc-400"
          }`}
          fill={isFavorite ? "#facc15" : "none"}
        />
      </button>
      <div className="flex items-center gap-4">
        <CloudSun className="w-12 h-12 text-indigo-400 drop-shadow" />
        <div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 drop-shadow-sm">
            {weather.name}, {weather.sys?.country}
          </div>
          <div className="text-lg font-medium text-indigo-700 dark:text-indigo-200 capitalize drop-shadow-sm">
            {weather.weather?.[0]?.description}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4">
        <div className="flex items-center gap-2">
          <ThermometerSun className="w-6 h-6 text-fuchsia-400" />
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 drop-shadow">
            {weather.main?.temp}
            {weather.tempUnit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDown className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Min: {minTemp}
            {weather.tempUnit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUp className="w-5 h-5 text-red-400" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Max: {maxTemp}
            {weather.tempUnit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Humidity: {weather.main?.humidity}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-indigo-400" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {weather.wind?.speed} m/s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-6 h-6 text-blue-400" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {weather.precipitationStatement}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-2">
        <div className="flex items-center gap-2">
          <Sunrise className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Sunrise: {formatLocalTime(weather.sys?.sunrise, timezoneOffset)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Sunset: {formatLocalTime(weather.sys?.sunset, timezoneOffset)}
          </span>
        </div>
      </div>
      <div className="mt-2 text-base font-medium text-zinc-900 dark:text-zinc-100 drop-shadow-sm">
        {weather.summary}
      </div>
      {weather.warning && (
        <div className="flex items-center gap-2 mt-2 text-yellow-700 dark:text-yellow-300 font-semibold drop-shadow">
          <AlertTriangle className="w-5 h-5" />
          <span>{weather.warning}</span>
        </div>
      )}
    </div>
  );
}