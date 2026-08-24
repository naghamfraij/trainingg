import type { WeatherData } from "../weatherTypes";

type WeatherCardProps = {
  weather: WeatherData;
  unit: "metric" | "imperial";
};

function WeatherCard({ weather, unit }: WeatherCardProps) {
  const convertTemperature = (temp: number) => {
    if (unit === "metric") {
      return temp;
    }

    return (temp * 9) / 5 + 32;
  };

  return (
    <div>
      <h2>{weather.name}</h2>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />

      <p>
        Temperature: {Math.round(convertTemperature(weather.main.temp))}
        {unit === "metric" ? " °C" : " °F"}
      </p>

      <p>Weather: {weather.weather[0].description}</p>

      <p>Humidity: {weather.main.humidity}%</p>

      <p>Wind Speed: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherCard;
