const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENWEATHER_API_KEY = '1b2f11b9145f7ecb7504f37c7fd0b35d';

// GET /api/weather/all?city=CityName&units=metric|imperial
router.get('/all', async (req, res) => {
  const city = req.query.city;
  const units = req.query.units || 'metric'; // default to metric
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // 1. Get lat/lon from city name using geocoding API
    const geoResp = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: city,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    });
    if (!geoResp.data || geoResp.data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }
    const { lat, lon, name, country, state } = geoResp.data[0];

    // 2. Get current weather using lat/lon
    const weatherResp = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units,
      },
    });
    const data = weatherResp.data;

    // 3. Get 5-day forecast using lat/lon
    const forecastResp = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units,
      },
    });
    const forecastData = forecastResp.data;

    // Compose summary and other fields as before
    const tempUnit = units === 'imperial' ? '°F' : '°C';
    const summary = `Feels like ${data.main.feels_like}${tempUnit}. ${capitalize(data.weather?.[0]?.description)}. ${getWindDescription(data.wind?.speed)}.`;
    const warning = getWarning(data.weather?.[0]?.main, data.wind?.speed, data.main?.temp, data.rain);

    let precipitationStatement = 'No precipitation within an hour';
    if (data.rain && data.rain['1h']) precipitationStatement = `Rain: ${data.rain['1h']} mm in the last hour`;
    else if (data.snow && data.snow['1h']) precipitationStatement = `Snow: ${data.snow['1h']} mm in the last hour`;
    else if (data.rain && data.rain['3h']) precipitationStatement = `Rain: ${data.rain['3h']} mm in the last 3 hours`;
    else if (data.snow && data.snow['3h']) precipitationStatement = `Snow: ${data.snow['3h']} mm in the last 3 hours`;

    // Process forecast: group by date, take midday (12:00) or closest
    const forecastByDay = {};
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!forecastByDay[date]) forecastByDay[date] = [];
      forecastByDay[date].push(item);
    });

    const forecast = Object.entries(forecastByDay).slice(0, 5).map(([date, items]) => {
      // Find the item closest to 12:00
      let midday = items.reduce((prev, curr) => {
        return Math.abs(new Date(curr.dt_txt).getHours() - 12) <
          Math.abs(new Date(prev.dt_txt).getHours() - 12)
          ? curr
          : prev;
      }, items[0]);
      return {
        date,
        temp: Math.round(midday.main.temp),
        feels_like: Math.round(midday.main.feels_like),
        min_temp: Math.round(Math.min(...items.map(i => i.main.temp_min))),
        max_temp: Math.round(Math.max(...items.map(i => i.main.temp_max))),
        humidity: midday.main.humidity,
        pressure: midday.main.pressure,
        wind: midday.wind.speed,
        precipitation:
          (midday.rain && midday.rain['3h'] ? `Rain: ${midday.rain['3h']} mm` :
            midday.snow && midday.snow['3h'] ? `Snow: ${midday.snow['3h']} mm` :
              "No precipitation"),
        weather: capitalize(midday.weather?.[0]?.description),
      };
    });

    res.json({
      weather: {
        ...data,
        name: name || data.name,
        country: country || data.sys?.country,
        state: state || "",
        tempUnit,
        summary,
        warning,
        precipitationStatement,
        timezone: data.timezone,
      },
      forecast,
    });
  } catch (err) {
    console.error('OpenWeatherMap API error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// --- Helper functions ---
function getWindDescription(windSpeed) {
  if (!windSpeed && windSpeed !== 0) return '';
  if (windSpeed < 1) return 'Calm';
  if (windSpeed < 5) return 'Light breeze';
  if (windSpeed < 11) return 'Gentle breeze';
  if (windSpeed < 19) return 'Moderate breeze';
  return 'Windy';
}

function getWarning(main, windSpeed, temp, rain) {
  if (main === 'Thunderstorm') return 'Yellow thunderstorm warning';
  if (main === 'Snow') return 'Snowfall warning';
  if (main === 'Extreme') return 'Extreme weather warning';
  if (windSpeed > 19) return 'High wind warning';
  if (temp > 40) return 'Heat warning';
  if (rain && rain['1h'] && rain['1h'] > 10) return 'Heavy rain warning';
  return null;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;