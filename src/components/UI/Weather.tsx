'use client';
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

interface WeatherProps {
  userCity: string;      // берем город из профиля
  lat?: number;          // если есть координаты
  lon?: number;
}

export default function Weather({ userCity, lat, lon }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "6d1180af0325ae32a299ef4ef42301fe";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const params = lat && lon
          ? { lat, lon, appid: API_KEY, units: "metric", lang: "ru" }
          : { q: userCity, appid: API_KEY, units: "metric", lang: "ru" };

        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          { params }
        );

        const data = response.data;

        setWeather({
          city: data.name,
          temp: data.main.temp.toFixed(1),
          feels: data.main.feels_like.toFixed(1),
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
          wind: data.wind.speed.toFixed(1),
        });
      } catch (err) {
        setError("❌ Не удалось получить погоду.");
      }
    };

    fetchWeather();
  }, [userCity, lat, lon]);

  if (error) return <div className="weather-error">{error}</div>;
  if (!weather) return <div className="weather-loading">Загрузка...</div>;

  return (
    <div className="weather-widget">
      <h3>{weather.city}</h3>
      <p>{weather.temp}°C</p>
      <p>☁️ {weather.desc}</p>
      <p>💨 Ветер: {weather.wind} м/с</p>
    </div>
  );
}