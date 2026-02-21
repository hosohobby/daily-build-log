import { Recommendation, WeatherCondition } from "./types";

export function toLabelRecommendation(value: Recommendation): string {
  if (value === "do") return "洗濯する";
  if (value === "dont") return "洗濯しない";
  return "様子見";
}

export function toLabelWeather(condition: WeatherCondition): string {
  if (condition === "sunny") return "晴れ";
  if (condition === "cloudy") return "くもり";
  return "雨";
}

export function parseBoolean(value: string): boolean | undefined {
  if (value === "yes") return true;
  if (value === "no") return false;
  return undefined;
}
