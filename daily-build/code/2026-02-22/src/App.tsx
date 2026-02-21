import { useEffect, useMemo, useState } from "react";
import { decideLaundry } from "./lib/decision";
import { DryingMethod, Inputs, LaundryAmount, Weather } from "./lib/types";
import { fetchTokyoWeather } from "./lib/weatherService";

function toLabelRecommendation(value: "do" | "dont" | "wait"): string {
  if (value === "do") return "洗濯する";
  if (value === "dont") return "洗濯しない";
  return "様子見";
}

function toLabelWeather(condition: "sunny" | "cloudy" | "rainy"): string {
  if (condition === "sunny") return "晴れ";
  if (condition === "cloudy") return "くもり";
  return "雨";
}

function parseBoolean(value: string): boolean | undefined {
  if (value === "yes") return true;
  if (value === "no") return false;
  return undefined;
}

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
        if (!isActive) return;
        setWeather(latestWeather);
      } catch (error) {
        if (!isActive) return;
        setWeatherError(error instanceof Error ? error.message : "天気情報の取得に失敗しました。");
      } finally {
        if (!isActive) return;
        setIsLoadingWeather(false);
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

  const recommendationClass = decision
    ? `recommendation recommendation-${decision.recommendation}`
    : "recommendation recommendation-wait";

  return (
    <main className="app">
      <section className={recommendationClass}>
        <p className="badge">今日の提案</p>
        <h1>Laundry Decision Agent</h1>
        {isLoadingWeather && <p className="status-text">Loading... 東京都の天気を取得中です。</p>}
        {!isLoadingWeather && weatherError && <p className="status-text status-error">{weatherError}</p>}
        {decision && (
          <>
            <p className="recommendation-text">推奨: {toLabelRecommendation(decision.recommendation)}</p>
            <p className="recommendation-time">推奨開始時刻: {decision.recommendedStartTime}</p>
            <ul>
              {decision.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            {typeof decision.estimatedDryingHours === "number" && (
              <p className="note">部屋干し乾燥見込み: 約 {decision.estimatedDryingHours} 時間</p>
            )}
            {decision.warnings.length > 0 && (
              <div className="warning-box">
                {decision.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="panel">
        <h2>入力（任意）</h2>

        <label>
          乾燥方式
          <select
            value={inputs.dryingMethod ?? ""}
            onChange={(event) =>
              setInputs((prev) => ({
                ...prev,
                dryingMethod: (event.target.value || undefined) as DryingMethod | undefined
              }))
            }
          >
            <option value="">未選択</option>
            <option value="outdoor">外干し</option>
            <option value="indoor">部屋干し</option>
          </select>
        </label>

        <label>
          緊急度（明日着たい服がある）
          <select
            value={inputs.needTomorrowClothes === undefined ? "" : inputs.needTomorrowClothes ? "yes" : "no"}
            onChange={(event) =>
              setInputs((prev) => ({
                ...prev,
                needTomorrowClothes: parseBoolean(event.target.value)
              }))
            }
          >
            <option value="">未選択</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label>
          洗濯物量
          <select
            value={inputs.laundryAmount ?? ""}
            onChange={(event) =>
              setInputs((prev) => ({
                ...prev,
                laundryAmount: (event.target.value || undefined) as LaundryAmount | undefined
              }))
            }
          >
            <option value="">未選択</option>
            <option value="small">少</option>
            <option value="medium">中</option>
            <option value="large">多</option>
          </select>
        </label>

        <label>
          花粉が気になる
          <select
            value={inputs.pollenSensitive === undefined ? "" : inputs.pollenSensitive ? "yes" : "no"}
            onChange={(event) =>
              setInputs((prev) => ({
                ...prev,
                pollenSensitive: parseBoolean(event.target.value)
              }))
            }
          >
            <option value="">未選択</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label>
          今日は外出予定あり
          <select
            value={inputs.hasPlansOutside === undefined ? "" : inputs.hasPlansOutside ? "yes" : "no"}
            onChange={(event) =>
              setInputs((prev) => ({
                ...prev,
                hasPlansOutside: parseBoolean(event.target.value)
              }))
            }
          >
            <option value="">未選択</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </section>

      <section className="panel">
        <h2>東京都の現在天気</h2>
        {isLoadingWeather && <p className="status-text">Loading...</p>}
        {!isLoadingWeather && weatherError && <p className="status-text status-error">{weatherError}</p>}
        {weather && (
          <dl className="weather-grid">
            <div>
              <dt>天気</dt>
              <dd>{toLabelWeather(weather.condition)}</dd>
            </div>
            <div>
              <dt>湿度</dt>
              <dd>{weather.humidity}%</dd>
            </div>
            <div>
              <dt>気温</dt>
              <dd>{weather.temperature}℃</dd>
            </div>
            <div>
              <dt>降水確率</dt>
              <dd>{weather.precipitationProbability}%</dd>
            </div>
            <div>
              <dt>風速</dt>
              <dd>{weather.windSpeed} m/s</dd>
            </div>
          </dl>
        )}
      </section>
    </main>
  );
}

export default App;
