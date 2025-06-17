import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, ThermometerSun, ThermometerSnowflake,
  Wind, Droplets, ArrowDown, ArrowUp, Droplet, Moon, Info, AlertTriangle
} from "lucide-react";
import { useState } from "react";

// Map weather description/main to icon
function getWeatherIcon(main, isNight = false) {
  if (!main) return <Info className="w-8 h-8 text-indigo-400" />;
  const m = main.toLowerCase();
  if (m.includes("clear")) return isNight ? <Moon className="w-8 h-8 text-blue-400" /> : <Sun className="w-8 h-8 text-yellow-400" />;
  if (m.includes("cloud")) return <Cloud className="w-8 h-8 text-zinc-400" />;
  if (m.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-500" />;
  if (m.includes("drizzle")) return <CloudDrizzle className="w-8 h-8 text-blue-300" />;
  if (m.includes("thunder")) return <CloudLightning className="w-8 h-8 text-yellow-500" />;
  if (m.includes("snow")) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (m.includes("fog") || m.includes("mist") || m.includes("haze")) return <CloudFog className="w-8 h-8 text-zinc-300" />;
  return <Info className="w-8 h-8 text-indigo-400" />;
}

// Color-coded temperature background
function getTempBg(temp) {
  if (temp <= 5) return "bg-blue-200 dark:bg-blue-900";
  if (temp <= 15) return "bg-cyan-100 dark:bg-cyan-900";
  if (temp <= 25) return "bg-yellow-100 dark:bg-yellow-900";
  if (temp <= 35) return "bg-orange-100 dark:bg-orange-900";
  return "bg-red-200 dark:bg-red-900";
}

// Badge for extreme weather
function getBadge(day) {
  if (day.max_temp >= 40) return { text: "Heatwave", color: "bg-red-500 text-white" };
  if (day.min_temp <= 0) return { text: "Freezing", color: "bg-blue-600 text-white" };
  if (day.wind >= 15) return { text: "Windy", color: "bg-indigo-500 text-white" };
  if (day.precipitation && parseFloat(day.precipitation) > 10) return { text: "Heavy Rain", color: "bg-blue-500 text-white" };
  if (/thunder/i.test(day.weather)) return { text: "Thunderstorm", color: "bg-yellow-500 text-white" };
  return null;
}

export default function ForecastCard({ day }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Use weatherMain if available, else fallback to weather description
  const main = day.weatherMain || day.weather || "";

  const badge = getBadge(day);

  return (
    <div
      className={`relative group rounded-xl shadow-lg p-4 flex flex-col gap-2 items-center animate-in fade-in slide-in-from-bottom-2 transition-all duration-300 hover:scale-105 ${getTempBg(day.temp)}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      aria-label="Forecast details"
    >
      {/* Weather Icon and Badge vertically stacked */}
      <div className="flex flex-col items-center mb-1">
        {getWeatherIcon(main)}
        {badge && (
          <span className={`mt-2 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${badge.color}`}>
            <AlertTriangle className="w-4 h-4" />{badge.text}
          </span>
        )}
        <span className="font-semibold mt-2">{day.date}</span>
      </div>
      {/* Day/Night Split */}
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-bold">Day: {day.max_temp}°</span>
        <Moon className="w-4 h-4 text-blue-400 ml-3" />
        <span className="text-sm font-bold">Night: {day.min_temp}°</span>
      </div>
      {/* Main Temp */}
      <div className="flex items-center gap-2">
        <ThermometerSun className="w-5 h-5 text-fuchsia-400" />
        <span className="text-lg font-bold">{day.temp}°</span>
        <span className="text-xs text-zinc-500">Feels: {day.feels_like}°</span>
      </div>
      {/* Weather Description */}
      <div className="text-sm text-zinc-500 capitalize">{day.weather}</div>
      {/* Tooltip on hover/focus */}
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-64 bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-700 rounded-xl shadow-xl p-4 text-xs text-zinc-700 dark:text-zinc-100 pointer-events-none animate-in fade-in slide-in-from-top-2">
          <div className="mb-1 font-bold text-indigo-700 dark:text-indigo-300">Details</div>
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-indigo-400" />
            Wind: {day.wind} m/s
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Droplet className="w-4 h-4 text-blue-400" />
            Humidity: {day.humidity}%
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            Precipitation: {day.precipitation}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowDown className="w-4 h-4 text-blue-400" />
            Min: {day.min_temp}°
            <ArrowUp className="w-4 h-4 text-red-400 ml-2" />
            Max: {day.max_temp}°
          </div>
          <div className="flex items-center gap-2 mb-1">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
            Pressure: {day.pressure} hPa
          </div>
        </div>
      )}
    </div>
  );
}