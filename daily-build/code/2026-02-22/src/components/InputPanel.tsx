import { ChangeEvent } from "react";
import { Settings2 } from "lucide-react";
import { DryingMethod, Inputs, LaundryAmount } from "../lib/types";
import { parseBoolean } from "../lib/labels";

interface InputPanelProps {
  inputs: Inputs;
  onChange: (next: Inputs) => void;
}

function InputPanel({ inputs, onChange }: InputPanelProps) {
  const handleBoolean = (key: keyof Inputs) => (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...inputs, [key]: parseBoolean(event.target.value) });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Settings2 size={18} /> Input (Secondary)
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-700">乾燥方式
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={inputs.dryingMethod ?? ""} onChange={(event) => onChange({ ...inputs, dryingMethod: (event.target.value || undefined) as DryingMethod | undefined })}>
            <option value="">未選択</option><option value="outdoor">外干し</option><option value="indoor">部屋干し</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-700">緊急度（明日着たい服がある）
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={inputs.needTomorrowClothes === undefined ? "" : inputs.needTomorrowClothes ? "yes" : "no"} onChange={handleBoolean("needTomorrowClothes")}>
            <option value="">未選択</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-700">洗濯物量
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={inputs.laundryAmount ?? ""} onChange={(event) => onChange({ ...inputs, laundryAmount: (event.target.value || undefined) as LaundryAmount | undefined })}>
            <option value="">未選択</option><option value="small">少</option><option value="medium">中</option><option value="large">多</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-700">花粉が気になる
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={inputs.pollenSensitive === undefined ? "" : inputs.pollenSensitive ? "yes" : "no"} onChange={handleBoolean("pollenSensitive")}>
            <option value="">未選択</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-700 sm:col-span-2">今日は外出予定あり
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={inputs.hasPlansOutside === undefined ? "" : inputs.hasPlansOutside ? "yes" : "no"} onChange={handleBoolean("hasPlansOutside")}>
            <option value="">未選択</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
      </div>
    </section>
  );
}

export default InputPanel;
