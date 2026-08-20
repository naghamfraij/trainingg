import { useState } from "react";

import SearchBar from "./components/SearchBar";
import LocationButton from "./components/LocationButton";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";

import type { WeatherData, ForecastItem, ForecastData } from "./weatherTypes";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  const fetchData = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return response.json();
  };

  const getForecast = async (cityName: string) => {
    const data: ForecastData = await fetchData(
      `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`,
    );

    const dailyForecast = data.list
      .filter((item) => new Date(item.dt * 1000).getHours() === 12)
      .slice(0, 5);

    setForecast(dailyForecast);
  };

  const updateWeather = async (data: WeatherData) => {
    setWeather(data);
    setCity(data.name);
    await getForecast(data.name);
  };

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data: WeatherData = await fetchData(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      await updateWeather(data);
    } catch {
      setError("Could not get weather data");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError("");

    try {
      const data: WeatherData = await fetchData(
        `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
      );

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
