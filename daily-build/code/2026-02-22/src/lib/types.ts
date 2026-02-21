export type WeatherCondition = "sunny" | "cloudy" | "rainy";

export interface Weather {
  condition: WeatherCondition;
  humidity: number;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
}

export type DryingMethod = "outdoor" | "indoor";
export type LaundryAmount = "small" | "medium" | "large";

export interface Inputs {
  dryingMethod?: DryingMethod;
  needTomorrowClothes?: boolean;
  laundryAmount?: LaundryAmount;
  pollenSensitive?: boolean;
  hasPlansOutside?: boolean;
}

export type Recommendation = "do" | "dont" | "wait";

export interface Decision {
  recommendation: Recommendation;
  recommendedStartTime: string;
  reasons: string[];
  estimatedDryingHours?: number;
  warnings: string[];
  score: number;
}
