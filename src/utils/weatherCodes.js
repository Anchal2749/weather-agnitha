// src/utils/weatherCodes.js
const MAP = {
  0: { desc: "Clear sky", icon: "☀️" },
  1: { desc: "Mainly clear", icon: "🌤️" },
  2: { desc: "Partly cloudy", icon: "⛅" },
  3: { desc: "Overcast", icon: "☁️" },
  45: { desc: "Fog", icon: "🌫️" },
  48: { desc: "Depositing rime fog", icon: "🌫️" },
  51: { desc: "Light drizzle", icon: "🌦️" },
  53: { desc: "Moderate drizzle", icon: "🌦️" },
  55: { desc: "Dense drizzle", icon: "🌧️" },
  61: { desc: "Light rain", icon: "🌧️" },
  63: { desc: "Moderate rain", icon: "🌧️" },
  65: { desc: "Heavy rain", icon: "⛈️" },
  71: { desc: "Light snow", icon: "🌨️" },
  73: { desc: "Moderate snow", icon: "🌨️" },
  75: { desc: "Heavy snow", icon: "❄️" },
  80: { desc: "Light showers", icon: "🌦️" },
  81: { desc: "Moderate showers", icon: "🌦️" },
  82: { desc: "Violent showers", icon: "⛈️" },
  95: { desc: "Thunderstorm", icon: "⛈️" },
  99: { desc: "Thunderstorm with heavy hail", icon: "⛈️🌨️" }
};

export function getWeatherText(code) {
  return MAP[Number(code)] || { desc: "Unknown", icon: "❓" };
}
