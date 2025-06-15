const express = require('express');
const router = express.Router();
const axios = require('axios');

// Combined endpoint: GET /api/weather/all?city=CityName&lang=EN&units=metric|imperial
router.get('/all', async (req, res) => {
  const city = req.query.city;
  const lang = req.query.lang || 'EN';
  const units = req.query.units || 'imperial';
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // 1. Get current weather (to get lat/lon)
    const weatherResponse = await axios.get('https://open-weather13.p.rapidapi.com/city', {
      params: { city, lang },
      headers: {
        'x-rapidapi-key': '849b469476msheba35c78aa0af8fp111642jsnd00e7d421c8f',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    });
    const data = weatherResponse.data;

    // Convert temperatures if needed
    let feels_like = data.main.feels_like;
    let temp = data.main.temp;
    let temp_min = data.main.temp_min;
    let temp_max = data.main.temp_max;
    let tempUnit = '°F';
    if (units === 'metric') {
      feels_like = toCelsius(feels_like);
      temp = toCelsius(temp);
      temp_min = toCelsius(temp_min);
      temp_max = toCelsius(temp_max);
      tempUnit = '°C';
    }

    const summary = `Feels like ${feels_like}${tempUnit}. ${getSkyDescription(data.weather)}. ${getWindDescription(data.wind.speed)}.`;
    const warning = getWarning(data.weather[0].main, data.wind.speed, data.main.temp, data.rain);

    let precipitationStatement = 'No precipitation within an hour';
    if (data.rain && data.rain['1h']) precipitationStatement = `Rain: ${data.rain['1h']} mm in the last hour`;
    else if (data.snow && data.snow['1h']) precipitationStatement = `Snow: ${data.snow['1h']} mm in the last hour`;
    else if (data.rain && data.rain['3h']) precipitationStatement = `Rain: ${data.rain['3h']} mm in the last 3 hours`;
    else if (data.snow && data.snow['3h']) precipitationStatement = `Snow: ${data.snow['3h']} mm in the last 3 hours`;

    // 2. Get forecast using lat/lon from current weather
    const { lat, lon } = data.coord;
    const forecastResponse = await axios.get('https://open-weather13.p.rapidapi.com/fivedaysforcast', {
      params: { latitude: lat, longitude: lon, lang },
      headers: {
        'x-rapidapi-key': '849b469476msheba35c78aa0af8fp111642jsnd00e7d421c8f',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    });

    // Group 3-hourly data by day
    const list = forecastResponse.data.list;
    const daily = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) daily[date] = [];
      daily[date].push(item);
    });

    // For each day, pick the forecast at 12:00 or the closest to it
    const forecast = Object.keys(daily).map(date => {
      const dayData = daily[date];
      let noon = dayData.find(d => d.dt_txt.includes('12:00:00'));
      if (!noon) noon = dayData[Math.floor(dayData.length / 2)];
      return {
        date,
        temp: noon.main.temp,
        weather: noon.weather[0].description,
        wind: noon.wind.speed,
        precipitation: (noon.rain && noon.rain['3h']) ? `${noon.rain['3h']} mm` : 'No precipitation'
      };
    });

    res.json({
      weather: {
        ...data,
        main: { ...data.main, feels_like, temp, temp_min, temp_max },
        summary,
        tempUnit,
        warning,
        precipitationStatement
      },
      forecast
    });
  } catch (err) {
    console.error('Combined Weather+Forecast API error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch weather and forecast data' });
  }
});

// ...keep your existing / and /forecast endpoints and helper functions...

function toCelsius(f) {
  return Math.round(((f - 32) * 5) / 9 * 100) / 100;
}

function getSkyDescription(weather) {
  if (Array.isArray(weather) && weather.length > 0 && weather[0].description) {
    return capitalize(weather[0].description);
  }
  if (typeof weather === 'string') {
    return capitalize(weather);
  }
  return 'Clear sky';
}

function getWindDescription(windSpeed) {
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
  if (temp > 104) return 'Heat warning';
  if (rain && rain['1h'] && rain['1h'] > 10) return 'Heavy rain warning';
  return null;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;