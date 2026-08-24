import type { WeatherData, ForecastData } from "../weatherTypes";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const fetchData = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
};

export const getWeatherByCity = async (
  cityName: string,
): Promise<WeatherData> => {
  return fetchData(
    `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`,
  );
};

export const getWeatherByLocation = async (
  latitude: number,
  longitude: number,
): Promise<WeatherData> => {
  return fetchData(
    `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
  );
};

export const getForecast = async (
  cityName: string,
): Promise<ForecastData> => {
  return fetchData(
    `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`,
  );
};