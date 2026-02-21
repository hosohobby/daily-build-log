import { CloudSun } from "lucide-react";

function HeroHeader() {
  return (
    <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        <CloudSun size={14} />
        Laundry Decision Agent
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">今日の洗濯判断を、最短で。</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
        東京都の天気とあなたの状況をもとに、今夜の洗濯タイミングをシンプルに提案します。
      </p>
    </header>
  );
}

export default HeroHeader;
