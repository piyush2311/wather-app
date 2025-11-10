"use client";

import { useState } from 'react';
import styles from "./page.module.css";

type WeatherData = {
  temp: number;
  city: string;
  description: string;
  error?: string;
};

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/temp/${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeather({
          temp: data.temp,
          city: data.city,
          description: data.description
        });
      } else {
        setWeather({
          temp: 0,
          city: city,
          description: '',
          error: data.error || 'Failed to fetch weather data'
        });
      }
    } catch (error) {
      setWeather({
        temp: 0,
        city: city,
        description: '',
        error: 'An error occurred while fetching weather data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main>
        <h1>Weather App</h1>
        <form onSubmit={fetchWeather} className={styles.form}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className={styles.input}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading || !city.trim()}
          >
            {isLoading ? 'Loading...' : 'Get Temperature'}
          </button>
        </form>

        {weather && (
          <div className={styles.weatherContainer}>
            {weather.error ? (
              <p className={styles.error}>{weather.error}</p>
            ) : (
              <>
                <h2>{weather.city}</h2>
                <p className={styles.temperature}>{weather.temp}°C</p>
                {weather.description && (
                  <p className={styles.description}>{weather.description}</p>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}