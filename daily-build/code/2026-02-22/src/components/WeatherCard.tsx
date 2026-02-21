import { CloudSun, Droplets, Thermometer, Umbrella, Wind } from "lucide-react";
import { toLabelWeather } from "../lib/labels";
import { Weather } from "../lib/types";

interface WeatherCardProps {
  weather: Weather | null;
  isLoading: boolean;
  error: string | null;
}

function WeatherCard({ weather, isLoading, error }: WeatherCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Tokyo Weather</h2>

      {isLoading && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      )}

      {!isLoading && error && <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {!isLoading && weather && (
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><dt className="flex items-center gap-1 text-slate-500"><CloudSun size={14} />天気</dt><dd className="mt-1 font-semibold">{toLabelWeather(weather.condition)}</dd></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><dt className="flex items-center gap-1 text-slate-500"><Droplets size={14} />湿度</dt><dd className="mt-1 font-semibold">{weather.humidity}%</dd></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><dt className="flex items-center gap-1 text-slate-500"><Thermometer size={14} />気温</dt><dd className="mt-1 font-semibold">{weather.temperature}℃</dd></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><dt className="flex items-center gap-1 text-slate-500"><Umbrella size={14} />降水確率</dt><dd className="mt-1 font-semibold">{weather.precipitationProbability}%</dd></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><dt className="flex items-center gap-1 text-slate-500"><Wind size={14} />風速</dt><dd className="mt-1 font-semibold">{weather.windSpeed} m/s</dd></div>
        </dl>
      )}
    </section>
  );
}

export default WeatherCard;
