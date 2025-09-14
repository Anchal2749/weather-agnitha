import React, { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import { getCurrentWeather } from "./services/openMeteo.js";

export default function App() {
  const [location, setLocation] = useState(null); // {name, country, lat, lon}
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric"); // "metric" or "imperial"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSelectLocation(loc) {
    setError("");
    setLocation(loc);
    setLoading(true);
    try {
      const cw = await getCurrentWeather(loc.latitude || loc.lat, loc.longitude || loc.lon, units);
      if (!cw) throw new Error("No current weather returned");
      setWeather(cw);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather. Try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleUnitToggle() {
    const next = units === "metric" ? "imperial" : "metric";
    setUnits(next);
    // if we already have a location, re-fetch in new units
    if (location) {
      handleSelectLocation(location);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Weather Now</h1>
        <p className="tag">Quick current conditions for any city — made for outdoor lovers.</p>
      </header>

      <main className="main">
        <SearchBar onSelectLocation={handleSelectLocation} />
        <div className="controls">
          <button className="unit-btn" onClick={handleUnitToggle}>
            Units: {units === "metric" ? "Metric (°C / km/h)" : "Imperial (°F / mph)"}
          </button>
        </div>

        {loading && <div className="loading">Loading current conditions…</div>}
        {error && <div className="error">{error}</div>}

        {weather && location && (
          <WeatherCard weather={weather} location={location} units={units} />
        )}

        {!weather && !loading && <div className="hint">Search a city above or use your device location.</div>}
      </main>

      <footer className="footer">
        <small>Data from Open-Meteo (free, no API key). </small>
      </footer>
    </div>
  );
}
