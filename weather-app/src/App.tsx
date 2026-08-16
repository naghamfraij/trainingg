import { useState } from "react";

import SearchBar from "./components/SearchBar";
import LocationButton from "./components/LocationButton";
import UnitToggle from "./components/UnitToggle";
import ForecastCard from "./components/ForecastCard";

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
};

type ForecastItem = {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

type ForecastData = {
  list: ForecastItem[];
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getForecast = async (cityName: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`
    );

    if (!response.ok) {
      throw new Error("Forecast failed");
    }

    const data: ForecastData = await response.json();

    // API gives weather every 3 hours.
    // We take one reading from each day.
    const dailyForecast = data.list.filter((item) =>
      new Date(item.dt * 1000).getHours() === 12
    );

    setForecast(dailyForecast.slice(0, 5));
  };

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );

      if (!response.ok) {
        setError("City not found");
        setWeather(null);
        setForecast([]);
        return;
      }

      const data: WeatherData = await response.json();

      setWeather(data);

      await getForecast(data.name);
    } catch {
      setError("Something went wrong. Please try again.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
          );

          if (!response.ok) {
            setError("Could not get weather for your location");
            setWeather(null);
            setForecast([]);
            return;
          }

          const data: WeatherData = await response.json();

          setWeather(data);
          setCity(data.name);

          await getForecast(data.name);
        } catch {
          setError("Something went wrong. Please try again.");
          setWeather(null);
          setForecast([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Could not access your location");
        setLoading(false);
      }
    );
  };

  const changeUnit = () => {
    if (unit === "metric") {
      setUnit("imperial");
    } else {
      setUnit("metric");
    }
  };

  return (
    <div>
      <h1>Weather App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={getWeather}
      />

      <LocationButton onLocation={getLocationWeather} />

      <UnitToggle
        unit={unit}
        onChange={changeUnit}
      />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {weather && !loading && (
        <div>
          <h2>{weather.name}</h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <p>
            Temperature: {Math.round(weather.main.temp)}
            {unit === "metric" ? " °C" : " °F"}
          </p>

          <p>Weather: {weather.weather[0].description}</p>

          <p>Humidity: {weather.main.humidity}%</p>

          <p>
            Wind Speed: {weather.wind.speed}
            {unit === "metric" ? " m/s" : " mph"}
          </p>
        </div>
      )}

      {forecast.length > 0 && !loading && (
        <div>
          <h2>5-Day Forecast</h2>

          {forecast.map((item) => (
            <ForecastCard
              key={item.dt}
              date={new Date(item.dt * 1000).toLocaleDateString()}
              temp={item.main.temp}
              description={item.weather[0].description}
              icon={item.weather[0].icon}
              unit={unit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;