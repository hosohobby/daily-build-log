import { Weather, WeatherCondition } from "./types";

const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
const TOKYO_QUERY = "Tokyo";

interface WeatherApiErrorResponse {
  error: {
    code: number;
    message: string;
  };
}

export interface WeatherApiForecastResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    precip_mm: number;
    condition: {
      text: string;
      code: number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        daily_chance_of_rain: number | string;
      };
    }>;
  };
}

function normalizePercentage(value: number | string | undefined): number {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function toWindSpeedMeterPerSecond(windKph: number): number {
  return Math.round((windKph / 3.6) * 10) / 10;
}

function mapWeatherCondition(code: number, precipitationProbability: number, precipitationMm: number): WeatherCondition {
  if (precipitationMm > 0 || precipitationProbability >= 60) {
    return "rainy";
  }

  const cloudyCodes = new Set([1003, 1006, 1009, 1030, 1135, 1147]);
  if (cloudyCodes.has(code)) {
    return "cloudy";
  }

  if (code === 1000) {
    return "sunny";
  }

  const rainyCodeRanges: Array<[number, number]> = [
    [1063, 1201],
    [1240, 1246],
    [1273, 1282]
  ];
  if (rainyCodeRanges.some(([min, max]) => code >= min && code <= max)) {
    return "rainy";
  }

  return "cloudy";
}

function toWeather(data: WeatherApiForecastResponse): Weather {
  const today = data.forecast.forecastday[0];
  const precipitationProbability = normalizePercentage(today?.day?.daily_chance_of_rain);
  return {
    condition: mapWeatherCondition(data.current.condition.code, precipitationProbability, data.current.precip_mm),
    humidity: Math.round(data.current.humidity),
    temperature: Math.round(data.current.temp_c),
    precipitationProbability,
    windSpeed: toWindSpeedMeterPerSecond(data.current.wind_kph)
  };
}

function parseErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  if (!("error" in payload)) {
    return undefined;
  }
  const error = (payload as WeatherApiErrorResponse).error;
  if (!error || typeof error.message !== "string") {
    return undefined;
  }
  return error.message;
}

export async function fetchTokyoWeather(): Promise<Weather> {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("環境変数 VITE_WEATHER_API_KEY が未設定です。.env を確認してください。");
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: TOKYO_QUERY,
    days: "1",
    aqi: "no",
    alerts: "no",
    lang: "ja"
  });
  const response = await fetch(`${WEATHER_API_BASE_URL}?${params.toString()}`);
  const payload = (await response.json()) as WeatherApiForecastResponse | WeatherApiErrorResponse;

  if (!response.ok) {
    const apiMessage = parseErrorMessage(payload);
    throw new Error(apiMessage ? `天気情報の取得に失敗しました: ${apiMessage}` : "天気情報の取得に失敗しました。");
  }

  if ("error" in payload) {
    throw new Error(`天気情報の取得に失敗しました: ${payload.error.message}`);
  }

  return toWeather(payload);
}
