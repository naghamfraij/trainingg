import type { ForecastItem } from "../weatherTypes";

type ForecastCardProps = {
  forecast: ForecastItem[];
  unit: "metric" | "imperial";
};

function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const convertTemperature = (temp: number) => {
    if (unit === "metric") {
      return temp;
    }

    return (temp * 9) / 5 + 32;
  };

  return (
    <div>
      <h2>5-Day Forecast</h2>

      {forecast.map((item) => (
        <div key={item.dt}>
          <h3>{new Date(item.dt * 1000).toLocaleDateString()}</h3>

          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
          />

          <p>{item.weather[0].description}</p>

          <p>
            {Math.round(convertTemperature(item.main.temp))}
            {unit === "metric" ? " °C" : " °F"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;
