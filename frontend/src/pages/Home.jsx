import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import WeatherCard from "@/components/WeatherCard";
import ForecastCard from "@/components/ForecastCard";
import { useFavorites } from "@/components/FavoritesContext";

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

// Dummy data for demo
const dummyHistory = [
  "London", "New York", "Tokyo", "Paris", "Delhi", "Sydney", "Prayagraj", "Noida"
];
const dummyWeather = {
  name: "London",
  sys: { country: "GB", sunrise: 1718340000, sunset: 1718394000 },
  weather: [{ main: "Thunderstorm", description: "light rain" }],
  main: { temp: 18, feels_like: 17, temp_min: 16, temp_max: 20, humidity: 82 },
  wind: { speed: 4 },
  precipitationStatement: "Rain: 1 mm in the last hour",
  summary: "Feels like 17°C. Light rain. Light breeze.",
  tempUnit: "°C",
  warning: "Yellow thunderstorm warning",
  timezone: 0 // UTC offset in seconds
};
const dummyForecast = [
  {
    date: "2024-06-14",
    temp: 18,
    feels_like: 17,
    min_temp: 16,
    max_temp: 20,
    pressure: 1012,
    humidity: 80,
    weather: "light rain",
    wind: 4,
    precipitation: "Rain: 1 mm"
  },
  {
    date: "2024-06-15",
    temp: 20,
    feels_like: 19,
    min_temp: 18,
    max_temp: 22,
    pressure: 1015,
    humidity: 75,
    weather: "clear sky",
    wind: 3,
    precipitation: "No precipitation"
  },
  {
    date: "2024-06-16",
    temp: 19,
    feels_like: 18,
    min_temp: 17,
    max_temp: 21,
    pressure: 1010,
    humidity: 78,
    weather: "scattered clouds",
    wind: 5,
    precipitation: "No precipitation"
  },
  {
    date: "2024-06-17",
    temp: 17,
    feels_like: 16,
    min_temp: 15,
    max_temp: 19,
    pressure: 1008,
    humidity: 85,
    weather: "moderate rain",
    wind: 6,
    precipitation: "Rain: 2 mm"
  },
  {
    date: "2024-06-18",
    temp: 21,
    feels_like: 20,
    min_temp: 19,
    max_temp: 23,
    pressure: 1013,
    humidity: 70,
    weather: "few clouds",
    wind: 2,
    precipitation: "No precipitation"
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState(dummyHistory);
  const [showForecast, setShowForecast] = useState(false);
  const { addFavorite } = useFavorites();
  const location = useLocation();
  const inputRef = useRef();

  useEffect(() => {
    if (location.state && location.state.city) {
      setQuery(location.state.city);
      // TODO: Fetch weather for this city and update weather card
      // For now, you can set dummyWeather or fetch real data
    }
  }, [location.state]);
  
  // Remove city from history
  const handleDelete = (city) => {
    setHistory((prev) => prev.filter((c) => c !== city));
    // TODO: Call backend to delete from DB
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // TODO: Fetch weather for query
    if (!history.includes(query.trim())) {
      setHistory([query.trim(), ...history]);
    }
    setShowDropdown(false);
  };

  // Show dropdown on focus
  const handleFocus = () => setShowDropdown(true);

  // Hide dropdown on blur (with delay for button click)
  const handleBlur = () => setTimeout(() => setShowDropdown(false), 150);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Weather video background (only in Current mode) */}
      {!showForecast && (
        <video
          key={getWeatherBgMp4(dummyWeather)}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{ minHeight: "100vh" }}
        >
          <source src={getWeatherBgMp4(dummyWeather)} type="video/mp4" />
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
            >
              Search
            </Button>
            {/* Dropdown */}
            {showDropdown && history.length > 0 && (
              <div className="absolute left-0 right-0 top-[110%] bg-white/95 dark:bg-zinc-900/95 border border-indigo-200 dark:border-zinc-700 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {history.map((city) => (
                  <div
                    key={city}
                    className="flex items-center justify-between px-4 py-2 hover:bg-indigo-50 dark:hover:bg-zinc-800/60 transition group"
                  >
                    <span
                      className="cursor-pointer text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600"
                      onMouseDown={() => {
                        setQuery(city);
                        setShowDropdown(false);
                        inputRef.current.focus();
                      }}
                    >
                      {city}
                    </span>
                    <button
                      type="button"
                      className="ml-2 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
                      onMouseDown={() => handleDelete(city)}
                      aria-label={`Delete ${city} from history`}
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
            <WeatherCard weather={dummyWeather} onAddFavorite={addFavorite} />
          ) : (
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {dummyForecast.map((day) => (
                <ForecastCard key={day.date} day={day} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}