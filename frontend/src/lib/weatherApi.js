export async function fetchWeather(city, units = "metric") {
  const res = await fetch(`/api/weather/all?city=${encodeURIComponent(city)}&units=${units}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch weather");
  }
  return await res.json();
}