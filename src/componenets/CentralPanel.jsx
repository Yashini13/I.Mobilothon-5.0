

import React, { useState, useEffect } from "react";
import { Brain, Mic, Volume2 } from "lucide-react";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual Gemini key
const ALERT_COOLDOWN = 15000; // 15s between alerts

export default function CenterPanel() {
  const [active, setActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastRiskLevel, setLastRiskLevel] = useState("");
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [message, setMessage] = useState("Initializing monitoring...");
  const [assessment, setAssessment] = useState(null);
  const [voicesReady, setVoicesReady] = useState(false);

  // 🟢 Preload voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log("✅ Voices loaded:", voices.map(v => v.name).slice(0, 3));
        setVoicesReady(true);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 🎤 Automatically speak once monitoring starts
  useEffect(() => {
    const introMessage =
      "Camera access granted. Monitoring driver wellness has started. Stay alert and drive safely.";
    setMessage("Monitoring driver wellness...");
    const speakIntro = () => {
      if (voicesReady) playSpeech(introMessage);
      else setTimeout(speakIntro, 1000);
    };
    speakIntro();
  }, [voicesReady]);

  // 🧠 Listen for risk level updates from LeftPanel
  useEffect(() => {
    const handleRiskEvent = (event) => {
      const risk = event.detail;
      console.log("🚨 Risk event received:", risk);
      if (!risk) return;

      const now = Date.now();
      if (risk === lastRiskLevel && now - lastAlertTime < ALERT_COOLDOWN) return;

      setAssessment({ risk_level: risk });
      handleRiskChange({ risk_level: risk });
      setLastRiskLevel(risk);
      setLastAlertTime(now);
    };

    window.addEventListener("riskLevelChange", handleRiskEvent);
    return () => window.removeEventListener("riskLevelChange", handleRiskEvent);
  }, [lastRiskLevel, lastAlertTime]);

  // 🧩 Handle risk change logic
  const handleRiskChange = async (assessmentData) => {
    const risk = assessmentData.risk_level?.toUpperCase();
    console.log("🔍 Risk changed:", risk);

    let fallbackText = "";
    if (risk === "LOW") {
      fallbackText = "Optimal driving state. Keep it up.";
    } else if (risk === "MODERATE") {
      fallbackText =
        "Moderate fatigue detected. Consider taking a short break or stretching.";
    } else if (risk === "HIGH" || risk === "CRITICAL") {
      fallbackText = "High risk detected. Please stop safely and rest.";
    }

    if (risk === "LOW") {
      setMessage(fallbackText);
      playSpeech(fallbackText);
      return;
    }

    const aiText = await generateGeminiMessage({
      risk_level: risk,
      fallbackText,
    });

    setMessage(aiText);
    playSpeech(aiText);
  };

  // 🤖 Generate Gemini message
  const generateGeminiMessage = async ({ risk_level, fallbackText }) => {
    const prompt = `
You are AURA, a warm AI driving companion.
Driver's current risk level: ${risk_level}.
Generate a friendly and natural short voice message (max 2 sentences):
- MODERATE: Suggest taking a short break or stretching.
- HIGH/CRITICAL: Advise pulling over safely to rest.
Tone: calm and helpful.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const aiMessage =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      if (!aiMessage) {
        console.warn("⚠️ Gemini empty — using fallback.");
        return fallbackText;
      }

      console.log("💬 Gemini generated:", aiMessage);
      return aiMessage;
    } catch (error) {
      console.error("⚠️ Gemini API error:", error);
      return fallbackText;
    }
  };

  // 🔊 Speak text (female voice)
  const playSpeech = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speakNow = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice =
        voices.find((v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("google uk english female") ||
          v.name.toLowerCase().includes("susan") ||
          v.name.toLowerCase().includes("victoria")
        ) || voices[0];

      if (!femaleVoice) {
        console.warn("No voices yet — retrying in 1s");
        setTimeout(speakNow, 1000);
        return;
      }

      const u = new SpeechSynthesisUtterance(text);
      u.voice = femaleVoice;
      u.rate = 0.95;
      u.pitch = 1.1;
      u.volume = 1.0;

      setIsSpeaking(true);
      setActive(true);

      u.onend = () => {
        setIsSpeaking(false);
        setActive(false);
      };
      u.onerror = (e) => {
        console.error("Speech synthesis failed:", e);
        setIsSpeaking(false);
        setActive(false);
      };

      console.log("🎤 Speaking:", text);
      window.speechSynthesis.speak(u);
    };

    if (!voicesReady) setTimeout(speakNow, 1000);
    else speakNow();
  };

  return (
    <div className="flex flex-col gap-4 w-[36%]">
      {/* AURA Main Panel */}
      <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 rounded-3xl p-8 border border-purple-500/20 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="relative flex items-center justify-center mb-6">
          <div
            className={`w-56 h-56 rounded-full flex items-center justify-center border-4 ${
              active || isSpeaking
                ? "border-cyan-400 shadow-cyan-500/60"
                : "border-cyan-700 shadow-cyan-500/20"
            } shadow-2xl transition-all duration-500`}
          >
            <div
              className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-semibold text-sm tracking-wider uppercase transition-all ${
                active || isSpeaking
                  ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/50 scale-105"
                  : "bg-gradient-to-br from-slate-800 to-slate-900 hover:from-cyan-700/50 hover:to-blue-800/40 border border-cyan-600/30"
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-8 h-8 mb-2 animate-pulse" />
              ) : (
                <Mic className="w-8 h-8 mb-2" />
              )}
              <h4 className="font-bold">AURA</h4>
              <span className="text-xs">AI Companion</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-cyan-400 mb-2">{message}</h2>
        <p className="text-gray-300 text-sm">Real-time AI Analysis Active</p>

        {assessment && (
          <div className="mt-4 text-xs text-gray-400">
            Risk Level:{" "}
            <span
              className={`font-bold ${
                assessment.risk_level === "CRITICAL"
                  ? "text-red-400"
                  : assessment.risk_level === "HIGH"
                  ? "text-orange-400"
                  : assessment.risk_level === "MODERATE"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {assessment.risk_level}
            </span>
          </div>
        )}
      </div>

      {/* Predictive Timeline */}
      <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/50 rounded-3xl p-6 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-purple-200">Predictive Timeline</h3>
        </div>
        <div className="space-y-3">
          {[
            { min: "+5 min", conf: "78%", msg: "Energy dip expected", hint: "→ Prepare uplifting playlist" },
            { min: "+15 min", conf: "92%", msg: "Scenic route ahead", hint: "→ Enjoy mindful driving" },
            { min: "+25 min", conf: "85%", msg: "Rest recommended", hint: "→ Plan rest stop soon" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/60 rounded-xl p-4 border-l-4 border-green-500">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-green-400 font-bold">{item.min}</span>
                <span className="text-gray-400 text-xs">{item.conf} confidence</span>
              </div>
              <p className="text-sm font-medium mb-1">{item.msg}</p>
              <p className="text-xs text-gray-400">{item.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
