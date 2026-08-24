import { useState } from "react";

import SearchBar from "./components/SearchBar";
import LocationButton from "./components/LocationButton";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";

import type { WeatherData, ForecastItem } from "./weatherTypes";

import {
  getWeatherByCity,
  getWeatherByLocation,
  getForecast,
} from "./services/weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const updateWeather = async (data: WeatherData) => {
    setWeather(data);
    setCity(data.name);

    const forecastData = await getForecast(data.name);

    const dailyForecast = forecastData.list
      .filter((item) => new Date(item.dt * 1000).getHours() === 12)
      .slice(0, 5);

    setForecast(dailyForecast);
  };

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getWeatherByCity(city);

      await updateWeather(data);
    } catch {
      setError("Could not get weather data");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = async (
    latitude: number,
    longitude: number,
  ) => {
    setLoading(true);
    setError("");

    try {
      const data = await getWeatherByLocation(latitude, longitude);

      await updateWeather(data);
    } catch {
      setError("Could not get weather data");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const changeUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  return (
    <div>
      <h1>Weather App</h1>

      <SearchBar city={city} setCity={setCity} onSearch={getWeather} />

      <LocationButton onLocation={getLocationWeather} onError={setError} />

      <button onClick={changeUnit}>
        Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
      </button>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {weather && !loading && <WeatherCard weather={weather} unit={unit} />}

      {forecast.length > 0 && !loading && (
        <ForecastCard forecast={forecast} unit={unit} />
      )}
    </div>
  );
}

export default App;