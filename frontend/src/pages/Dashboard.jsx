import { useState } from "react";
import { useFavorites } from "@/components/FavoritesContext";
import { AlertTriangle, Info, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const dummyAlerts = [
  {
    city: "London",
    type: "Thunderstorm",
    message: "Yellow thunderstorm warning in effect. Stay indoors and avoid travel if possible.",
    details: "Heavy rain and thunderstorms expected from 3 PM to 8 PM. Possible flooding in low-lying areas.",
  },
  {
    city: "Delhi",
    type: "Heatwave",
    message: "Heatwave alert: Temperatures expected to reach 44°C.",
    details: "Stay hydrated and avoid outdoor activities during peak hours.",
  },
];

const dummyTrends = [
  { day: "Mon", temp: 18, rain: 2 },
  { day: "Tue", temp: 20, rain: 0 },
  { day: "Wed", temp: 22, rain: 1 },
  { day: "Thu", temp: 21, rain: 0 },
  { day: "Fri", temp: 19, rain: 3 },
  { day: "Sat", temp: 17, rain: 5 },
  { day: "Sun", temp: 18, rain: 0 },
];

export default function Dashboard() {
  const { favorites } = useFavorites();
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Dummy summary generator (replace with real API data)
  const getSummary = (fav) =>
    `${fav.name}: ${fav.weather?.[0]?.description || "Clear sky"}, ${fav.main?.temp}${fav.tempUnit}. Feels like ${fav.main?.feels_like}${fav.tempUnit}. Humidity: ${fav.main?.humidity}%. Wind: ${fav.wind?.speed} m/s.`;

  return (
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
                    {getSummary(fav)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Weather Trends Chart */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-fuchsia-700">
            <BarChart2 className="w-6 h-6" /> Weather Trends (Past Week)
          </h2>
          <div className="bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow p-4 border border-fuchsia-100 dark:border-fuchsia-900">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dummyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" label={{ value: "Temp (°C)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "Rain (mm)", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#6366f1" name="Temperature" />
                <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#06b6d4" name="Rainfall" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Notifications Sidebar */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl p-6 border border-yellow-100 dark:border-yellow-900">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="w-5 h-5" /> Weather Alerts
          </h2>
          {dummyAlerts.length === 0 ? (
            <div className="text-zinc-500">No alerts for your favorite cities.</div>
          ) : (
            <ul className="space-y-3">
              {dummyAlerts.map((alert, idx) => (
                <li key={idx}>
                  <button
                    className="w-full text-left flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-800/60 transition"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span>
                      <span className="font-semibold text-yellow-700 dark:text-yellow-300">{alert.city}:</span>{" "}
                      <span className="text-yellow-700 dark:text-yellow-200">{alert.message}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-8 max-w-md w-full border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> {selectedAlert.city} - {selectedAlert.type}
              </h3>
              <div className="mb-4 text-zinc-700 dark:text-zinc-200">{selectedAlert.details}</div>
              <button
                className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}