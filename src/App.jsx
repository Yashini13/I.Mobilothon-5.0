import React, { useState, useEffect } from "react";
import LeftPanel from "./componenets/Leftpanel";
import CenterPanel from "./componenets/CentralPanel";
import RightPanel from "./componenets/RightPanel";
import MetricsReport from "./componenets/MetricsReport";
import { Brain, Eye, Navigation, Sun, BarChart3 } from "lucide-react";

export default function App() {
  const [time, setTime] = useState(new Date());
  const [showReport, setShowReport] = useState(false); // toggle for metrics report

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col text-white overflow-hidden">

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-blue-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">AURA</h1>
                  <p className="text-xs text-blue-300">Cognitive Adaptive Road Assistant</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
              </div>
      
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-400" />Cloudy 28°C </div>
                <div className="flex items-center gap-2"><Navigation className="w-4 h-4 text-blue-400" />Low Visibility</div>
                <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" />2h 7m</div>
              </div>
      
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}{" "}
                  {/* {time.getHours() >= 12 ? "PM" : "AM"} */}
                </div>
      
                {/* Report Button */}
                <button
                  onClick={() => setShowReport(!showReport)}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold flex items-center gap-2 hover:from-blue-500 hover:to-purple-500 transition-all shadow-md shadow-blue-700/30"
                >
                  <BarChart3 className="w-4 h-4" />
                  {showReport ? "Back to Dashboard" : "Detailed Metrics Report"}
                </button>
              </div>
            </div>
      

      {/* Conditional Rendering */}
      {showReport ? (
        <MetricsReport />
      ) : (
        <>
          {/* Three Columns */}
          <div className="flex flex-1 gap-4 p-4">
            <LeftPanel />
            <CenterPanel />
            <RightPanel />
          </div>

          {/* Footer */}
          <div className="bg-black/40 backdrop-blur-sm px-6 py-2 flex justify-between items-center border-t border-blue-500/10 text-xs">
            <div className="text-gray-400">Team Auto-gorithm × VW Digital Solutions India</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Edge AI Processing
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Privacy-First
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}