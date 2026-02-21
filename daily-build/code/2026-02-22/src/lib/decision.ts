import { Decision, DryingMethod, Inputs, LaundryAmount, Weather } from "./types";

interface NormalizedInputs {
  dryingMethod: DryingMethod;
  needTomorrowClothes: boolean;
  laundryAmount: LaundryAmount;
  pollenSensitive: boolean;
  hasPlansOutside: boolean;
}

function normalizeInputs(inputs: Inputs): NormalizedInputs {
  return {
    dryingMethod: inputs.dryingMethod ?? "indoor",
    needTomorrowClothes: inputs.needTomorrowClothes ?? false,
    laundryAmount: inputs.laundryAmount ?? "medium",
    pollenSensitive: inputs.pollenSensitive ?? false,
    hasPlansOutside: inputs.hasPlansOutside ?? false
  };
}

function estimateIndoorDryingHours(humidity: number, laundryAmount: LaundryAmount): number {
  const amountHours = {
    small: 5,
    medium: 7,
    large: 9
  } as const;

  const humidityPenalty = humidity >= 75 ? 2 : humidity >= 65 ? 1 : 0;
  return amountHours[laundryAmount] + humidityPenalty;
}

function suggestStartTime(score: number, needTomorrowClothes: boolean, hasPlansOutside: boolean): string {
  if (score <= -2) {
    return "21:00 (再判定)";
  }
  if (needTomorrowClothes && hasPlansOutside) {
    return "18:00";
  }
  if (needTomorrowClothes) {
    return "19:00";
  }
  if (score >= 2) {
    return "20:00";
  }
  return "19:20";
}

export function decideLaundry(inputs: Inputs, weather: Weather): Decision {
  const normalized = normalizeInputs(inputs);
  const reasons: string[] = [];
  const warnings: string[] = [];
  let score = 0;
  let estimatedDryingHours: number | undefined;

  if (normalized.dryingMethod === "outdoor" && weather.precipitationProbability >= 50) {
    score -= 4;
    reasons.push(`外干しで降水確率が ${weather.precipitationProbability}% のため、乾きにくく濡れ戻りのリスクがあります。`);
  }

  if (normalized.needTomorrowClothes && normalized.laundryAmount === "large") {
    score += 4;
    reasons.push("明日着たい服があり、洗濯物量も多いため、今日のうちに早めの洗濯が有利です。");
  } else if (normalized.needTomorrowClothes) {
    score += 2;
    reasons.push("明日着たい服があるため、夜のうちに洗濯を済ませる価値があります。");
  }

  if (normalized.dryingMethod === "indoor" && weather.humidity >= 70) {
    estimatedDryingHours = estimateIndoorDryingHours(weather.humidity, normalized.laundryAmount);
    reasons.push(`部屋干しで湿度が ${weather.humidity}% と高めなので、乾燥に時間がかかる見込みです。`);
  }

  if (normalized.pollenSensitive && normalized.dryingMethod === "outdoor") {
    score -= 1;
    warnings.push("花粉が気になる設定です。外干し時は取り込み前の払落としやカバー利用を推奨します。");
    reasons.push("花粉対策を優先するなら、外干し時間を短めにするか部屋干しが安全です。");
  }

  if (normalized.hasPlansOutside) {
    score += normalized.needTomorrowClothes ? 1 : 0;
    reasons.push("外出予定があるため、洗濯する場合は帰宅後すぐ開始できる時間帯が現実的です。");
  }

  if (normalized.laundryAmount === "small" && !normalized.needTomorrowClothes) {
    score -= 1;
    reasons.push("洗濯物量が少ないため、天候条件が微妙なら明日に回す選択肢があります。");
  } else if (normalized.laundryAmount === "large") {
    score += 1;
    reasons.push("洗濯物量が多い日は先延ばしすると負担が増えやすいです。");
  }

  if (weather.windSpeed >= 4 && normalized.dryingMethod === "outdoor") {
    score += 1;
    reasons.push(`風速 ${weather.windSpeed}m/s で通気が確保しやすく、外干しの乾燥効率が上がります。`);
  }

  if (weather.condition === "rainy" && normalized.dryingMethod === "outdoor") {
    score -= 2;
    reasons.push("天気が雨寄りなので、外干し前提なら本日は見送りが安全です。");
  }

  if (reasons.length < 3) {
    reasons.push("気温・湿度・予定のバランス上、無理のない時間帯に開始するのが効率的です。");
  }
  if (reasons.length < 3) {
    reasons.push("今夜の判断はダミー天気に基づくため、実運用時は最新予報で再評価できます。");
  }

  let recommendation: Decision["recommendation"] = "wait";
  if (score >= 2) {
    recommendation = "do";
  } else if (score <= -2) {
    recommendation = "dont";
  }

  return {
    recommendation,
    recommendedStartTime: suggestStartTime(score, normalized.needTomorrowClothes, normalized.hasPlansOutside),
    reasons: reasons.slice(0, 6),
    estimatedDryingHours,
    warnings,
    score
  };
}
