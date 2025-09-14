import React, { useState, useEffect, useRef } from "react";
import { geocodeCity } from "../services/openMeteo.js";

export default function SearchBar({ onSelectLocation }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  // Debounced suggestion fetch
  useEffect(() => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await geocodeCity(q, 5);
        setSuggestions(res || []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timerRef.current);
  }, [q]);

  async function handleSelect(s) {
    setQ(`${s.name}${s.admin1 ? ", " + s.admin1 : ""}, ${s.country}`);
    setSuggestions([]);
    onSelectLocation(s);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // if suggestions exist, pick first; else trigger geocode once and pick first
    if (suggestions && suggestions.length) {
      handleSelect(suggestions[0]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await geocodeCity(q, 1);
        if (res && res.length) {
          handleSelect(res[0]);
        } else {
          alert("City not found. Try a more specific name.");
        }
      } catch (err) {
        console.error(err);
        alert("Search failed.");
      } finally {
        setLoading(false);
      }
    })();
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // create a small place object
        const place = {
          name: "Your location",
          country: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        onSelectLocation(place);
      },
      (err) => {
        alert("Could not access location: " + (err.message || err.code));
      }
    );
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          placeholder="Search city (e.g., 'Kathmandu' or 'Austin, TX')"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search city"
        />
        <button type="submit">Search</button>
        <button type="button" className="loc-btn" onClick={handleUseMyLocation}>Use my location</button>
      </form>

      {loading && <div className="small">Searching…</div>}

      {suggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li key={`${s.latitude}-${s.longitude}-${s.name}`} onClick={() => handleSelect(s)}>
              <strong>{s.name}</strong>{s.admin1 ? `, ${s.admin1}` : ""} · {s.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
