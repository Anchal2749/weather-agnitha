// small wrapper for Open-Meteo endpoints used by the app
export async function geocodeCity(name, count = 5) {
  if (!name) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const json = await res.json();
  // API returns `results` array (may be undefined)
  return json.results || [];
}

export async function getCurrentWeather(lat, lon, units = "metric") {
  if (lat == null || lon == null) throw new Error("Missing coordinates");
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: "true",
    timezone: "auto"
  });

  if (units === "imperial") {
    params.append("temperature_unit", "fahrenheit");
    params.append("windspeed_unit", "mph");
    params.append("precipitation_unit", "inch");
  } else {
    // metric is default; explicit set for clarity
    params.append("temperature_unit", "celsius");
    params.append("windspeed_unit", "kmh");
    params.append("precipitation_unit", "mm");
  }

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const json = await res.json();
  // current_weather is top-level in the response
  return json.current_weather || null;
}
