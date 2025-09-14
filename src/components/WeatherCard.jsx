import React from "react";
import { getWeatherText } from "../utils/weatherCodes.js";

function windDirToText(deg) {
  if (deg == null) return "—";
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function WeatherCard({ weather, location, units }) {
  // weather expected shape: {temperature, windspeed, winddirection, weathercode, time}
  const code = Number(weather.weathercode);
  const label = getWeatherText(code);

  return (
    <section className="weather-card" role="region" aria-label="Current weather">
      <div className="wc-left">
        <div className="place">
          <h2>{location.name}{location.admin1 ? `, ${location.admin1}` : ""}{location.country ? ` · ${location.country}` : ""}</h2>
          <div className="coords">Lat {location.latitude ?? location.lat}, Lon {location.longitude ?? location.lon}</div>
        </div>

        <div className="temp-row">
          <div className="temp">
            <div className="temp-value">{Math.round(weather.temperature)}°</div>
            <div className="temp-unit">{units === "metric" ? "C" : "F"}</div>
          </div>

          <div className="cond">
            <div className="icon">{label.icon}</div>
            <div className="cond-text">{label.desc}</div>
          </div>
        </div>

        <div className="details">
          <div>Wind: {Math.round(weather.windspeed)} {units === "metric" ? "km/h" : "mph"} · {windDirToText(weather.winddirection)}</div>
          <div>Last update: {weather.time}</div>
        </div>
      </div>

      <div className="wc-right">
        {/* You can add extra panels: forecast buttons, map, etc. */}
      </div>
    </section>
  );
}
