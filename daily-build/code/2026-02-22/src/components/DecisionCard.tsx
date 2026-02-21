import { CheckCircle2, Clock3, LoaderCircle, TriangleAlert } from "lucide-react";
import { Decision } from "../lib/types";
import { toLabelRecommendation } from "../lib/labels";

interface DecisionCardProps {
  decision: Decision | null;
  isLoading: boolean;
  error: string | null;
}

const recommendationTone = {
  do: "border-blue-200 bg-blue-50",
  dont: "border-rose-200 bg-rose-50",
  wait: "border-amber-200 bg-amber-50"
} as const;

function DecisionCard({ decision, isLoading, error }: DecisionCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Result</h2>
        {decision?.recommendation === "do" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <CheckCircle2 size={14} />
            Success
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          <div className="h-7 w-44 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <LoaderCircle className="animate-spin" size={16} /> Loading weather and decision...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p className="flex items-center gap-2 font-medium">
            <TriangleAlert size={16} /> Error Banner
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!isLoading && !error && decision && (
        <div className={`rounded-lg border p-4 ${recommendationTone[decision.recommendation]}`}>
          <p className="text-xl font-semibold text-slate-900">{toLabelRecommendation(decision.recommendation)}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <Clock3 size={15} /> 推奨開始時刻: {decision.recommendedStartTime}
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {decision.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {typeof decision.estimatedDryingHours === "number" && (
            <p className="mt-3 text-sm font-semibold text-slate-900">部屋干し乾燥見込み: 約 {decision.estimatedDryingHours} 時間</p>
          )}
          {decision.warnings.length > 0 && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-100 px-3 py-2 text-sm text-amber-900">
              {decision.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default DecisionCard;
