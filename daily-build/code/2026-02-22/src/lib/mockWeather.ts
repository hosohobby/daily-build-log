import { Weather, WeatherCondition } from "./types";

const BASE_SEED = 20260220;

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function createDailySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return BASE_SEED + y * 10000 + m * 100 + d;
}

function pickCondition(precipitationProbability: number): WeatherCondition {
  if (precipitationProbability >= 60) {
    return "rainy";
  }
  if (precipitationProbability >= 30) {
    return "cloudy";
  }
  return "sunny";
}

export function getMockWeather(date: Date = new Date()): Weather {
  const random = mulberry32(createDailySeed(date));
  const humidity = Math.round(35 + random() * 55);
  const temperature = Math.round(8 + random() * 27);
  const precipitationProbability = Math.round(random() * 100);
  const windSpeed = Math.round((0.5 + random() * 7.5) * 10) / 10;

  return {
    condition: pickCondition(precipitationProbability),
    humidity,
    temperature,
    precipitationProbability,
    windSpeed
  };
}
