import { useState } from "react";
import { useFavorites } from "@/components/FavoritesContext";
import WeatherChatbot from "@/components/WeatherChatbot";
import { AlertTriangle, Info, BarChart2, CheckCircle2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// Helper to build a descriptive summary
function buildSummary(fav) {
  if (!fav || fav.error) return "No data available.";
  const weather = fav.weather?.[0]?.description || fav.description || "Clear sky";
  const temp = fav.main?.temp;
  const feels = fav.main?.feels_like;

  // Use forecast for today's min/max if available
  let min = fav.main?.temp_min, max = fav.main?.temp_max;
  if (fav.forecast && fav.forecast.length > 0) {
    min = fav.forecast[0].min_temp;
    max = fav.forecast[0].max_temp;
  }

  const humidity = fav.main?.humidity;
  const wind = fav.wind?.speed;
  const sunrise = fav.sys?.sunrise
    ? new Date(fav.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  const sunset = fav.sys?.sunset
    ? new Date(fav.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  const warning = fav.warning ? `⚠️ ${fav.warning}` : "";
  return (
    `In ${fav.name}, ${fav.country}: ${weather}. ` +
    `Current temperature is ${temp}${fav.tempUnit}, feels like ${feels}${fav.tempUnit}. ` +
    `Today's range: ${min}${fav.tempUnit} - ${max}${fav.tempUnit}. ` +
    `Humidity: ${humidity}%. Wind: ${wind} m/s. ` +
    `Sunrise at ${sunrise}, Sunset at ${sunset}. ${warning}`
  );
}

export default function Dashboard() {
  const { favorites } = useFavorites();
  const [selectedCity, setSelectedCity] = useState("");

  // Find the selected favorite's forecast
  const selectedFav = favorites.find(f => f.name === selectedCity);

  // Prepare data for the graph
  const trendData = (selectedFav?.forecast || []).map(day => ({
    date: day.date,
    temp: day.temp,
    rain: parseFloat(day.precipitation?.replace(/[^\d.]/g, "")) || 0,
  }));

  // Gather all warnings for alerts
  const alerts = favorites
    .filter(fav => fav.warning)
    .map(fav => ({
      city: fav.name,
      warning: fav.warning,
      weather: fav.weather?.[0]?.description,
    }));

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Quick Summary Cards */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
              <Info className="w-6 h-6" /> Quick Summary
            </h2>
            {favorites.length === 0 ? (
              <div className="text-zinc-500">No favorite cities yet.</div>
            ) : (
              <div className="space-y-4">
                {favorites.map((fav, idx) => (
                  <div
                    key={fav.name + idx}
                    className="bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow p-4 border border-indigo-100 dark:border-indigo-900"
                  >
                    <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{fav.name}</div>
                    <div className="text-zinc-700 dark:text-zinc-200 text-sm mt-1 whitespace-pre-line">
                      {buildSummary(fav)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Weather Trends Chart */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-fuchsia-700">
              <BarChart2 className="w-6 h-6" /> Weather Trends (Next 5-Days)
            </h2>
            {/* Dropdown to select favorite */}
            <div className="mb-4">
              <label className="font-semibold mr-2">Select City:</label>
              <select
                className="px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
              >
                <option value="">Select a city</option>
                {favorites.map(fav => (
                  <option key={fav.name} value={fav.name}>{fav.name}</option>
                ))}
              </select>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow p-4 border border-fuchsia-100 dark:border-fuchsia-900">
              {!selectedCity ? (
                <div className="text-zinc-500">Please select a city to view trends.</div>
              ) : trendData.length === 0 ? (
                <div className="text-zinc-500">No forecast data for this city.</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" label={{ value: "Temp (°C)", angle: -90, position: "insideLeft" }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: "Rain (mm)", angle: 90, position: "insideRight" }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#6366f1" name="Temperature" />
                    <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#06b6d4" name="Rainfall" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </div>

        {/* Notifications Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl p-6 border border-yellow-100 dark:border-yellow-900">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" /> Weather Alerts
            </h2>
            {alerts.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                All clear! No weather alerts for your favorite cities. Enjoy your day!
              </div>
            ) : (
              <ul className="space-y-3">
                {alerts.map((alert, idx) => (
                  <li key={alert.city + idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-700">{alert.city}:</span>{" "}
                      <span className="text-yellow-700">{alert.warning}</span>
                      {alert.weather && (
                        <span className="block text-xs text-zinc-500">Current: {alert.weather}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
      <WeatherChatbot />
    </>
  );
}