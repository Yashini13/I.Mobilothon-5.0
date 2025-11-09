import React from "react";
import { Gauge, HeartPulse, Brain, Eye, Activity, AlertTriangle } from "lucide-react";

export default function MetricsReport() {
  const metrics = [
    { label: "Driver Wellness Index", value: 87, icon: Gauge, color: "text-cyan-400" },
    { label: "Drowsiness Score", value: 22, icon: Eye, color: "text-amber-400" },
    { label: "Stress Level", value: 40, icon: AlertTriangle, color: "text-red-400" },
    { label: "Heart Rate (BPM)", value: 76, icon: HeartPulse, color: "text-pink-400" },
    { label: "Posture Deviation", value: 12, icon: Activity, color: "text-green-400" },
    { label: "Cognitive Focus", value: 68, icon: Brain, color: "text-purple-400" },
  ];

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-300">
        Detailed Metrics Report
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-lg font-bold ${color}`}>{label}</div>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className="text-4xl font-extrabold text-white">{value}</div>
            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${color.replace("text-", "bg-")}`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 p-6 rounded-3xl border border-cyan-600/30 text-center text-slate-300">
        <h3 className="text-xl font-bold text-cyan-300 mb-2">
          Summary Insight
        </h3>
        <p className="text-sm">
          Driver shows moderate focus and stable vitals. Minor signs of fatigue
          detected. Recommended: short 5-minute rest and hydration.
        </p>
      </div>
    </div>
  );
}
