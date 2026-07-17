import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  temp: string;
  feels: string;
  desc: string;
  icon: string;
  wind: string;
  city: string;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "6d1180af0325ae32a299ef4ef42301fe";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              appid: API_KEY,
              units: "metric",
              lang: "ru",
            },
          });

          const data = response.data;

          setWeather({
            city: data.name,
            temp: data.main.temp.toFixed(1),
            feels: data.main.feels_like.toFixed(1),
            desc: data.weather[0].description,
            icon: data.weather[0].icon,
            wind: data.wind.speed.toFixed(1),
          });
        } catch {
          setError("Не удалось получить погоду.");
        }
      },
      () => {
        setError("Разрешите доступ к геолокации.");
      }
    );
  }, []);

  if (error) return <div>{error}</div>;
  if (!weather) return <div>Загрузка...</div>;

  return (
    <div className="weather-widget">
      <h3>{weather.city}</h3>

      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.desc} />

      <h2>{weather.temp}°</h2>
      <p>Ощущается как {weather.feels}°C</p>
      <p>{weather.desc}</p>
      <p>💨 {weather.wind} м/с</p>
    </div>
  );
}
