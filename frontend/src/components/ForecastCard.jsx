import { Calendar, ThermometerSun, Wind, Droplets, ArrowDown, ArrowUp, Droplet } from "lucide-react";

export default function ForecastCard({ day }) {
  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 rounded-xl shadow-lg p-4 flex flex-col gap-2 items-center animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <span className="font-semibold">{day.date}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThermometerSun className="w-5 h-5 text-fuchsia-400" />
        <span className="text-lg font-bold">{day.temp}°</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Feels like:</span>
        <span className="text-sm">{day.feels_like}°</span>
      </div>
      <div className="flex items-center gap-2">
        <ArrowDown className="w-4 h-4 text-blue-400" />
        <span className="text-xs">Min: {day.min_temp}°</span>
        <ArrowUp className="w-4 h-4 text-red-400" />
        <span className="text-xs">Max: {day.max_temp}°</span>
      </div>
      <div className="flex items-center gap-2">
        <Droplet className="w-4 h-4 text-blue-400" />
        <span className="text-xs">Humidity: {day.humidity}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Pressure:</span>
        <span className="text-xs">{day.pressure} hPa</span>
      </div>
      <div className="flex items-center gap-2">
        <Wind className="w-5 h-5 text-indigo-400" />
        <span className="text-xs">{day.wind} m/s</span>
      </div>
      <div className="flex items-center gap-2">
        <Droplets className="w-5 h-5 text-blue-400" />
        <span className="text-xs">{day.precipitation}</span>
      </div>
      <div className="text-sm text-zinc-500">{day.weather}</div>
    </div>
  );
}