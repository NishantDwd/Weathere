const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWeather(city, units = "metric") {
  const res = await fetch(`${API_URL}/weather/all?city=${encodeURIComponent(city)}&units=${units}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch weather");
  }
  return await res.json();
}