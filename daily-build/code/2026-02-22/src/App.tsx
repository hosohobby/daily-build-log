import { useEffect, useMemo, useState } from "react";
import ContainerLayout from "./components/ContainerLayout";
import DecisionCard from "./components/DecisionCard";
import HeroHeader from "./components/HeroHeader";
import InputPanel from "./components/InputPanel";
import WeatherCard from "./components/WeatherCard";
import { decideLaundry } from "./lib/decision";
import { Inputs, Weather } from "./lib/types";
import { fetchTokyoWeather } from "./lib/weatherService";

function App() {
  const [inputs, setInputs] = useState<Inputs>({});
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadWeather = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);

      try {
        const latestWeather = await fetchTokyoWeather();
        if (isActive) {
          setWeather(latestWeather);
        }
      } catch (error) {
        if (isActive) {
          setWeatherError(error instanceof Error ? error.message : "天気情報の取得に失敗しました。");
        }
      } finally {
        if (isActive) {
          setIsLoadingWeather(false);
        }
      }
    };

    loadWeather();

    return () => {
      isActive = false;
    };
  }, []);

  const decision = useMemo(() => {
    if (!weather) return null;
    return decideLaundry(inputs, weather);
  }, [inputs, weather]);

  return (
    <ContainerLayout>
      <DecisionCard decision={decision} isLoading={isLoadingWeather} error={weatherError} />
      <HeroHeader />
      <WeatherCard weather={weather} isLoading={isLoadingWeather} error={weatherError} />
      <InputPanel inputs={inputs} onChange={setInputs} />
    </ContainerLayout>
  );
}

export default App;
