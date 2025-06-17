import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import WeatherCard from "@/components/WeatherCard";
import ForecastCard from "@/components/ForecastCard";
import { useFavorites } from "@/components/FavoritesContext";
import { fetchWeather } from "@/lib/weatherApi";
import toast from "react-hot-toast";
import { addHistory, fetchHistory, deleteHistory } from "@/lib/historyApi";

export default function Home() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const { addFavorite } = useFavorites();
  const location = useLocation();
  const inputRef = useRef();

  // Weather state
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  function dedupeHistory(historyArr) {
  const seen = new Set();
  const deduped = [];
  for (const item of historyArr) {
    if (!seen.has(item.city.toLowerCase())) {
      deduped.push(item);
      seen.add(item.city.toLowerCase());
    }
  }
  return deduped;
}

  // Fetch real history from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchHistory(token)
         .then((data) => setHistory(dedupeHistory(data).slice(0, 10)))
        .catch(() => setHistory([]));
    }
  }, []);

  // On mount or when navigating with a city
  useEffect(() => {
    if (location.state && location.state.city) {
      setQuery(location.state.city);
      handleFetchWeather(location.state.city);
    }
    // eslint-disable-next-line
  }, [location.state]);

  // Remove city from history (backend and frontend)
  const handleDelete = async (city) => {
    const token = localStorage.getItem("token");
    // Find the first matching history entry for this city
    const entry = history.find((h) => h.city === city);
    if (!entry) return;
    try {
      await deleteHistory(entry.id, token);
      setHistory((prev) => prev.filter((h) => h.id !== entry.id));
    } catch {
      toast.error("Failed to delete from history");
    }
  };

  // Fetch weather for a city
  const handleFetchWeather = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeather(data.weather);
      setForecast(data.forecast || []);
      // Add to backend history and update local history
      const token = localStorage.getItem("token");
      if (token) {
        await addHistory(city, token);
        // Refetch history to get updated order and limit to 10
        const updated = await fetchHistory(token);
        setHistory(dedupeHistory(updated).slice(0, 10));
      }
    } catch (err) {
      setWeather(null);
      setForecast([]);
      toast.error(err.message || "Failed to fetch weather");
    }
    setLoading(false);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleFetchWeather(query.trim());
    setShowDropdown(false);
  };

  // Show dropdown on focus
  const handleFocus = () => setShowDropdown(true);

  // Hide dropdown on blur (with delay for button click)
  const handleBlur = () => setTimeout(() => setShowDropdown(false), 150);

  // Map weather to video background
  function getWeatherBgMp4(weather) {
    if (!weather || !weather.weather || !weather.weather[0]) return "/default.mp4";
    const main = weather.weather[0].main?.toLowerCase() || "";
    if (main.includes("rain")) return "/rainy.mp4";
    if (main.includes("cloud")) return "/cloudy.mp4";
    if (main.includes("sunny") || main.includes("clear")) return "/sunny.mp4";
    if (main.includes("snow")) return "/snowy.mp4";
    if (main.includes("thunder")) return "/thunder.mp4";
    return "/default.mp4";
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Weather video background (only in Current mode) */}
      {!showForecast && (
        <video
          key={getWeatherBgMp4(weather)}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{ minHeight: "100vh" }}
        >
          <source src={getWeatherBgMp4(weather)} type="video/mp4" />
        </video>
      )}

      {/* Optional: dark overlay for glassy effect */}
      {!showForecast && (
        <div className="fixed inset-0 bg-black/40 z-10 pointer-events-none" />
      )}

      {/* Main content above video */}
      <div className="relative z-20 flex flex-col items-center justify-start min-h-[60vh] pt-10">
        <form
          className="w-full max-w-2xl flex items-center gap-4"
          onSubmit={handleSearch}
          autoComplete="off"
        >
          {/* Search bar with solid background and icon */}
          <div className="flex w-full relative bg-white dark:bg-zinc-900 rounded-full border-2 border-indigo-300 shadow-lg">
            <span className="flex items-center pl-4">
              <Search className="text-indigo-400 w-6 h-6" />
            </span>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="pl-2 pr-2 py-4 text-lg bg-transparent border-none focus:outline-none focus:ring-0 transition-all rounded-none flex-1 h-14 shadow-none"
              style={{ boxShadow: "none" }}
            />
            <Button
              type="submit"
              className="rounded-r-full rounded-l-none px-8 py-4 h-14 bg-indigo-300 hover:bg-indigo-400 text-white font-semibold shadow transition cursor-pointer border-0"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </Button>
            {/* Dropdown */}
            {showDropdown && history.length > 0 && (
              <div className="absolute left-0 right-0 top-[110%] bg-white/95 dark:bg-zinc-900/95 border border-indigo-200 dark:border-zinc-700 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-2 hover:bg-indigo-50 dark:hover:bg-zinc-800/60 transition group"
                  >
                    <span
                      className="cursor-pointer text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600"
                      onMouseDown={() => {
                        setQuery(item.city);
                        setShowDropdown(false);
                        inputRef.current.focus();
                        handleFetchWeather(item.city);
                      }}
                    >
                      {item.city}
                    </span>
                    <button
                      type="button"
                      className="ml-2 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
                      onMouseDown={() => handleDelete(item.city)}
                      aria-label={`Delete ${item.city} from history`}
                    >
                      <X className="w-4 h-4 text-indigo-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Toggle Switch */}
          <div className="flex-shrink-0">
            <ToggleSwitch
              checked={showForecast}
              onChange={setShowForecast}
              leftLabel="Current"
              rightLabel="5-Day"
            />
          </div>
        </form>

        {/* Weather content */}
        <div className="mt-12 w-full flex flex-col items-center">
          {!showForecast ? (
            weather ? (
              <WeatherCard weather={weather} forecast={forecast} onAddFavorite={addFavorite} />
            ) : (
              <div className="text-orange-300 text-center mt-12 font-bold text-2xl">
                {loading ? "Loading..." : "Search for a city to see the weather!"}
              </div>
            )
          ) : (
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {forecast.length > 0 ? (
                forecast.map((day) => <ForecastCard key={day.date} day={day} />)
              ) : (
                <div className="text-zinc-500 text-center col-span-full mt-12">
                  {loading ? "Loading..." : "No forecast data. Search for a city!"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}