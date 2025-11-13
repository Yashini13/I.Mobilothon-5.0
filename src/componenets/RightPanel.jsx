
import React from "react";
import {
  Heart,
  Activity,
  Music,
  Brain,
  Sun,
  AirVent,
  Navigation,
  Coffee,
} from "lucide-react";
import logo from '../assets/volkwgenLogo.png'
export default function RightPanel() {
  return (
    <div className="flex flex-col gap-4 w-[32%]">
      {/* Favorite Activities */}
      <div className="bg-gradient-to-br from-slate-900/80 to-pink-900/50 rounded-3xl p-6 border border-pink-500/20">
        <h3 className="font-bold text-pink-200 mb-4">
          Your Favorite Activities
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { Icon: Heart, name: "Calm Breathing Exercises", color: "pink" },
            { Icon: Music, name: "Refreshing Neuro-Music", color: "purple" },
            { Icon: Activity, name: "Micro Movement Break", color: "green" },
            { Icon: AirVent, name: "Cabin Air Refresh", color: "cyan" },
            { Icon: Sun, name: "Circadian Light Sync", color: "amber" },
            { Icon: Brain, name: "Focus Micro-Game", color: "indigo" },
          ].map(({ Icon, name, color }) => (
            <div
              key={name}
              className={`bg-${color}-500/20 rounded-2xl p-4 border border-${color}-500/30 text-center`}
            >
              <Icon className={`w-8 h-8 text-${color}-400 mx-auto mb-2`} />
              <div className="text-xs font-medium">{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Suggestion Panel */}
      <div className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 rounded-3xl p-6 border border-cyan-500/20 relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-cyan-200 text-sm">
              Smart Suggestion
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Live Route Update</span>
        </div>

        <div className="bg-slate-800/40 rounded-2xl border border-cyan-600/30 p-4 mt-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Driving for{" "}
                <span className="text-cyan-400 font-semibold">
                  2 hrs straight
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Suggested Break:{" "}
                <span className="text-cyan-300 font-semibold">
                  Hideout Café
                </span>
              </p>
            </div>
            <Coffee className="w-6 h-6 text-cyan-400" />
          </div>

          <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
            <span>📍 200m ahead</span>
            <span>☕ Great for quick rest</span>
          </div>

          {/* Suggestion Button */}
          <div className="mt-4 flex justify-center">
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs rounded-lg font-medium hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-500/30 transition-all">
              View on Map
            </button>
          </div>
        </div>

        {/* Glow Accent */}
        <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl blur-3xl pointer-events-none"></div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 bg-gradient-to-r from-slate-900/90 to-slate-800/70 p-6 rounded-3xl border border-cyan-700/40 backdrop-blur-md shadow-[inset_0_0_20px_rgba(56,189,248,0.2)] w-full">
        {/* VW Logo */}
        <img
          src={logo}
          alt="Volkswagen Logo"
          className="w-20 h-23 object-contain drop-shadow-[0_0_13px_rgba(56,189,248,0.6)] rounded-full"
        />

        {/* Tagline */}
        <div className="text-left">
          <p className="text-2xl font-bold text-cyan-300 tracking-wide leading-tight">
            Volkswagen Group
          </p>
          <p className="text-base text-slate-300 mt-1 font-medium italic">
            Innovating Intelligent Mobility
          </p>
        </div>
      </div>
    </div>
  );
}
