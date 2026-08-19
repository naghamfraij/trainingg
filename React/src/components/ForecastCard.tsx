type ForecastCardProps = {
  date: string;
  temp: number;
  description: string;
  icon: string;
  unit: "metric" | "imperial";
};

function ForecastCard({
  date,
  temp,
  description,
  icon,
  unit,
}: ForecastCardProps) {
  return (
    <div>
      <h3>{date}</h3>

      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />

      <p>{description}</p>

      <p>
        {Math.round(temp)}
        {unit === "metric" ? " °C" : " °F"}
      </p>
    </div>
  );
}

export default ForecastCard;