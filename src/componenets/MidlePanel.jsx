// // // import React, { useState } from "react";
// // // import { Brain, Mic } from "lucide-react";

// // // export default function CenterPanel() {
// // //   const [active, setActive] = useState(false);

// // //   const handleActivate = () => {
// // //     setActive(true);
// // //     setTimeout(() => setActive(false), 3000); // simulate activation
// // //   };

// // //   return (
// // //     <div className="flex flex-col gap-4 w-[36%]">
// // //       {/* Optimal Flow State Card */}
// // //       <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 rounded-3xl p-8 border border-purple-500/20 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
// // //         {/* Glowing Animated Ring */}
// // //         <div className="relative flex items-center justify-center mb-6">
// // //           <div
// // //             className={`w-56 h-56 rounded-full flex items-center justify-center border-4 ${
// // //               active ? "border-cyan-400 shadow-cyan-500/60" : "border-cyan-700 shadow-cyan-500/20"
// // //             } shadow-2xl transition-all duration-500`}
// // //           >
// // //             <button
// // //               onClick={handleActivate}
// // //               className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-semibold text-sm tracking-wider uppercase transition-all ${
// // //                 active
// // //                   ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/50 scale-105"
// // //                   : "bg-gradient-to-br from-slate-800 to-slate-900 hover:from-cyan-700/50 hover:to-blue-800/40 border border-cyan-600/30"
// // //               }`}
// // //             >
// // //               <Mic className={`w-8 h-8 mb-2 ${active ? "animate-pulse" : ""}`} />
// // //              <h4 className="font-bold text-pretty">AURA</h4> 
// // //             AI Companion
// // //               {active && (
// // //                 <>
// // //                   <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping opacity-40"></div>
// // //                   <div
// // //                     className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-30"
// // //                     style={{ animationDelay: "0.3s" }}
// // //                   ></div>
// // //                 </>
// // //               )}
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <h2 className="text-3xl font-bold text-cyan-400 mb-2">Optimal Flow State</h2>
// // //         <p className="text-gray-300 text-sm">Multi-modal AI processing</p>
// // //       </div>

// // //       {/* Predictive Timeline */}
// // //       <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/50 rounded-3xl p-6 border border-indigo-500/20">
// // //         <div className="flex items-center gap-2 mb-4">
// // //           <Brain className="w-5 h-5 text-purple-400" />
// // //           <h3 className="font-bold text-purple-200">Predictive Timeline</h3>
// // //         </div>

// // //         <div className="space-y-3">
// // //           {[
// // //             {
// // //               min: "+5 min",
// // //               conf: "78%",
// // //               color: "green",
// // //               msg: "Energy dip expected",
// // //               hint: "→ Prepare uplifting playlist",
// // //             },
// // //             {
// // //               min: "+15 min",
// // //               conf: "95%",
// // //               color: "blue",
// // //               msg: "Scenic route ahead",
// // //               hint: "→ Suggest mindful observation",
// // //             },
// // //             {
// // //               min: "+25 min",
// // //               conf: "82%",
// // //               color: "amber",
// // //               msg: "Rest recommended",
// // //               hint: "→ Route to premium rest stop",
// // //             },
// // //           ].map((item, i) => (
// // //             <div
// // //               key={i}
// // //               className={`bg-slate-800/60 rounded-xl p-4 border-l-4 border-${item.color}-500`}
// // //             >
// // //               <div className="flex justify-between items-start mb-2">
// // //                 <span className={`text-${item.color}-400 font-bold text-sm`}>
// // //                   {item.min}
// // //                 </span>
// // //                 <span className="text-xs text-gray-400">
// // //                   {item.conf} confidence
// // //                 </span>
// // //               </div>
// // //               <p className="text-sm font-medium mb-1">{item.msg}</p>
// // //               <p className="text-xs text-gray-400">{item.hint}</p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import React, { useState, useEffect, useRef } from "react";
// // import { Brain, Mic, Volume2 } from "lucide-react";

// // const API_URL = "https://vwhackathon-1.onrender.com";
// // const GEMINI_API_KEY = "AIzaSyD-3gS77e9hTe6ryVxsK1rCdXr6mvxkG4U"; // Replace with your actual API key
// // const ALERT_COOLDOWN = 30000; // 30 seconds between alerts (increased)
// // const CRITICAL_ALERT_COOLDOWN = 20000; // 20 seconds for critical alerts
// // const WARNING_PERSISTENCE_THRESHOLD = 3; // Number of consecutive warnings before alerting

// // export default function CenterPanel() {
// //   const [active, setActive] = useState(false);
// //   const [metrics, setMetrics] = useState(null);
// //   const [assessment, setAssessment] = useState(null);
// //   const [isSpeaking, setIsSpeaking] = useState(false);
// //   const [lastAlertTime, setLastAlertTime] = useState(0);
// //   const [lastAlertType, setLastAlertType] = useState("");
// //   const [isMonitoring, setIsMonitoring] = useState(false);
// //   const [consecutiveWarnings, setConsecutiveWarnings] = useState({});
// //   const consecutiveWarningsRef = useRef({});
// //   const metricsIntervalRef = useRef(null);

// //   // Check if monitoring is active by checking if metrics are being updated
// //   const checkMonitoringStatus = async () => {
// //     try {
// //       const response = await fetch(`${API_URL}/api/metrics`);
// //       const data = await response.json();
      
// //       // If we get valid metrics, monitoring is active
// //       if (data.status === "success" && data.data) {
// //         if (!isMonitoring) {
// //           setIsMonitoring(true);
// //           startPolling();
// //         }
// //       } else {
// //         if (isMonitoring) {
// //           setIsMonitoring(false);
// //           stopPolling();
// //         }
// //       }
// //     } catch (error) {
// //       // API not responding, monitoring is not active
// //       if (isMonitoring) {
// //         setIsMonitoring(false);
// //         stopPolling();
// //       }
// //     }
// //   };

// //   // Fetch metrics from backend API
// //   const fetchMetrics = async () => {
// //     try {
// //       const [metricsRes, assessmentRes] = await Promise.all([
// //         fetch(`${API_URL}/api/metrics`),
// //         fetch(`${API_URL}/api/assessment`),
// //       ]);

// //       const metricsData = await metricsRes.json();
// //       const assessmentData = await assessmentRes.json();

// //       if (metricsData.status === "success") {
// //         setMetrics(metricsData.data);
// //       } else {
// //         // No valid metrics, stop polling
// //         setIsMonitoring(false);
// //         stopPolling();
// //         setMetrics(null);
// //         setAssessment(null);
// //         return;
// //       }

// //       if (assessmentData.status === "success") {
// //         setAssessment(assessmentData.data);
// //       }

// //       // Check if we should trigger an alert
// //       if (metricsData.status === "success" && assessmentData.status === "success") {
// //         checkAndTriggerAlert(metricsData.data, assessmentData.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching metrics:", error);
// //       // Error fetching, monitoring might be stopped
// //       setIsMonitoring(false);
// //       stopPolling();
// //     }
// //   };

// //   // Start polling for metrics
// //   const startPolling = () => {
// //     if (metricsIntervalRef.current) return; // Already polling
    
// //     console.log("Starting metrics polling...");
// //     metricsIntervalRef.current = setInterval(() => {
// //       fetchMetrics();
// //     }, 2000);
    
// //     // Initial fetch
// //     fetchMetrics();
// //   };

// //   // Stop polling for metrics
// //   const stopPolling = () => {
// //     if (metricsIntervalRef.current) {
// //       console.log("Stopping metrics polling...");
// //       clearInterval(metricsIntervalRef.current);
// //       metricsIntervalRef.current = null;
// //     }
// //   };

// //   // Check monitoring status periodically (every 5 seconds)
// //   useEffect(() => {
// //     const statusCheckInterval = setInterval(() => {
// //       checkMonitoringStatus();
// //     }, 5000);

// //     // Initial check
// //     checkMonitoringStatus();

// //     return () => {
// //       clearInterval(statusCheckInterval);
// //       stopPolling();
// //     };
// //   }, []);

// //   // Check conditions and trigger voice alert if needed (with smart filtering)
// //   const checkAndTriggerAlert = (metricsData, assessmentData) => {
// //     const now = Date.now();
// //     const { camera_metrics, steering_metrics } = metricsData;
    
// //     // Determine alert priority and type
// //     let alertType = "";
// //     let alertPriority = 0; // 0=none, 1=low, 2=medium, 3=high, 4=critical
// //     let shouldAlert = false;

// //     console.log("Checking alerts - Risk Level:", assessmentData.risk_level, "Drowsy:", camera_metrics.is_drowsy);

// //     // CRITICAL ALERTS (always speak after cooldown)
// //     if (camera_metrics.is_drowsy) {
// //       alertType = "drowsy";
// //       alertPriority = 4;
// //       const timeSinceLastAlert = now - lastAlertTime;
      
// //       console.log("Drowsiness detected! Time since last alert:", timeSinceLastAlert);
      
// //       // For critical drowsiness, use shorter cooldown
// //       if (timeSinceLastAlert > CRITICAL_ALERT_COOLDOWN) {
// //         shouldAlert = true;
// //         console.log("✓ TRIGGERING DROWSY ALERT");
// //       }
// //     } else if (assessmentData.risk_level === "CRITICAL") {
// //       alertType = "critical_risk";
// //       alertPriority = 4;
// //       const timeSinceLastAlert = now - lastAlertTime;
      
// //       console.log("Critical risk detected! Time since last alert:", timeSinceLastAlert);
      
// //       if (timeSinceLastAlert > CRITICAL_ALERT_COOLDOWN) {
// //         shouldAlert = true;
// //         console.log("✓ TRIGGERING CRITICAL ALERT");
// //       }
// //     }
// //     // HIGH PRIORITY ALERTS (speak only if persistent)
// //     else if (assessmentData.risk_level === "HIGH") {
// //       alertType = "high_risk";
// //       alertPriority = 3;
// //       shouldAlert = checkPersistentWarning("high_risk", now);
// //     } else if (camera_metrics.perclos > 25) { // Increased threshold
// //       alertType = "perclos_high";
// //       alertPriority = 3;
// //       shouldAlert = checkPersistentWarning("perclos_high", now);
// //     } else if (steering_metrics.steering_alert_level === "CRITICAL") {
// //       alertType = "steering_critical";
// //       alertPriority = 3;
// //       shouldAlert = checkPersistentWarning("steering_critical", now);
// //     }
// //     // MEDIUM PRIORITY ALERTS (require more persistence)
// //     else if (camera_metrics.is_yawning) {
// //       alertType = "yawning";
// //       alertPriority = 2;
// //       shouldAlert = checkPersistentWarning("yawning", now, 5); // Need 5 consecutive
// //     } else if (steering_metrics.steering_alert_level === "WARNING") {
// //       alertType = "steering_warning";
// //       alertPriority = 2;
// //       shouldAlert = checkPersistentWarning("steering_warning", now, 5);
// //     }
// //     // LOW PRIORITY - Generally don't alert unless severe
// //     else {
// //       // Reset warnings if everything is okay
// //       consecutiveWarningsRef.current = {};
// //       setConsecutiveWarnings({});
// //       return;
// //     }

// //     // Trigger alert if conditions are met
// //     if (shouldAlert) {
// //       console.log("🔊 GENERATING VOICE ALERT FOR:", alertType);
// //       generateVoiceAlert(metricsData, assessmentData, alertType);
// //       setLastAlertTime(now);
// //       setLastAlertType(alertType);
// //       // Reset warning counters after alerting
// //       consecutiveWarningsRef.current = {};
// //       setConsecutiveWarnings({});
// //     }
// //   };

// //   // Check if a warning has been persistent enough to warrant an alert
// //   const checkPersistentWarning = (warningType, currentTime, requiredCount = WARNING_PERSISTENCE_THRESHOLD) => {
// //     const timeSinceLastAlert = currentTime - lastAlertTime;
    
// //     // Must respect cooldown period
// //     if (timeSinceLastAlert < ALERT_COOLDOWN) {
// //       console.log(`${warningType}: Still in cooldown (${Math.floor(timeSinceLastAlert/1000)}s / ${ALERT_COOLDOWN/1000}s)`);
// //       return false;
// //     }

// //     // Increment consecutive warning count using ref for immediate access
// //     const currentCount = (consecutiveWarningsRef.current[warningType] || 0) + 1;
// //     consecutiveWarningsRef.current = {
// //       [warningType]: currentCount
// //     };
    
// //     // Update state for display
// //     setConsecutiveWarnings({ [warningType]: currentCount });

// //     console.log(`${warningType}: Count ${currentCount}/${requiredCount}`);

// //     // Check if we've reached the threshold
// //     if (currentCount >= requiredCount) {
// //       console.log(`✓ ${warningType}: Threshold reached!`);
// //       return true;
// //     }
    
// //     return false;
// //   };

// //   // Generate and play voice alert using Gemini AI
// //   const generateVoiceAlert = async (metricsData, assessmentData, alertType) => {
// //     if (isSpeaking) return; // Don't interrupt ongoing speech

// //     try {
// //       setIsSpeaking(true);
// //       setActive(true);

// //       // Create a prompt for Gemini based on current metrics
// //       const prompt = `You are AURA, a caring AI driving companion. Generate a brief, natural voice alert (2-3 sentences max) based on these driver monitoring metrics:

// // Alert Type: ${alertType}
// // Risk Level: ${assessmentData.risk_level}
// // Risk Score: ${assessmentData.risk_score}/100
// // Action Needed: ${assessmentData.action_needed}

// // Eye Metrics:
// // - Drowsy: ${metricsData.camera_metrics.is_drowsy}
// // - Yawning: ${metricsData.camera_metrics.is_yawning}
// // - PERCLOS: ${metricsData.camera_metrics.perclos.toFixed(1)}%
// // - Eye Aspect Ratio (EAR): ${metricsData.camera_metrics.ear.toFixed(3)}
// // - Blink count: ${metricsData.camera_metrics.blink_count}

// // Steering:
// // - Alert Level: ${metricsData.steering_metrics.steering_alert_level}
// // - Lane Deviation Score: ${metricsData.steering_metrics.lane_deviation_score.toFixed(0)}
// // - Steering Smoothness: ${metricsData.steering_metrics.steering_smoothness.toFixed(0)}%

// // IMPORTANT: You must provide ACTIONABLE SUGGESTIONS based on the alert type:

// // For drowsiness/critical alerts:
// // - Suggest taking an immediate break or pulling over safely
// // - Recommend finding a rest area or safe parking spot
// // - Suggest a 15-20 minute power nap
// // - Advise opening windows for fresh air
// // - Recommend stopping at the next exit

// // For high risk/PERCLOS alerts:
// // - Suggest taking a short 10-minute break soon
// // - Recommend stretching or walking around
// // - Suggest having a cold drink or light snack
// // - Advise stopping within the next few miles

// // For yawning/moderate alerts:
// // - Suggest planning a break in the next 15-20 minutes
// // - Recommend listening to upbeat music or engaging content
// // - Suggest doing some neck/shoulder stretches at the next opportunity
// // - Advise maintaining good posture and ventilation

// // For steering alerts:
// // - Suggest refocusing attention on the road
// // - Recommend checking mirrors and lane position
// // - Advise slowing down if needed
// // - Suggest taking a brief break to refresh focus

// // Generate a caring, direct alert that:
// // 1. Acknowledges what you're detecting
// // 2. Provides a SPECIFIC actionable suggestion (break time, rest stop, fresh air, etc.)
// // 3. Sounds natural and conversational

// // Don't use emojis, asterisks, or markdown. Just plain conversational speech.`;

// //       // Call Gemini API for text generation
// //       const textResponse = await fetch(
// //         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             contents: [{
// //               parts: [{ text: prompt }]
// //             }]
// //           })
// //         }
// //       );

// //       if (!textResponse.ok) {
// //         throw new Error("Gemini API request failed");
// //       }

// //       const textData = await textResponse.json();
// //       const alertText = textData.candidates[0].content.parts[0].text;

// //       console.log("AURA Alert:", alertText);

// //       // Use Web Speech API for text-to-speech
// //       if ('speechSynthesis' in window) {
// //         const utterance = new SpeechSynthesisUtterance(alertText);
// //         utterance.rate = 0.95;
// //         utterance.pitch = 1.0;
// //         utterance.volume = 1.0;
        
// //         utterance.onend = () => {
// //           setIsSpeaking(false);
// //           setActive(false);
// //         };

// //         utterance.onerror = () => {
// //           setIsSpeaking(false);
// //           setActive(false);
// //         };

// //         window.speechSynthesis.speak(utterance);
// //       } else {
// //         console.error("Speech synthesis not supported");
// //         setIsSpeaking(false);
// //         setActive(false);
// //       }

// //     } catch (error) {
// //       console.error("Error generating voice alert:", error);
// //       setIsSpeaking(false);
// //       setActive(false);
      
// //       // Fallback to actionable speech without Gemini
// //       if ('speechSynthesis' in window) {
// //         let fallbackText = "";
        
// //         // Provide specific suggestions based on alert type
// //         switch (alertType) {
// //           case "drowsy":
// //           case "critical_risk":
// //             fallbackText = "Critical alert: You're showing signs of drowsiness. Please pull over at the next safe location and take a 15-minute break.";
// //             break;
// //           case "high_risk":
// //           case "perclos_high":
// //             fallbackText = "I'm detecting reduced alertness. Please consider taking a 10-minute break at the next rest stop.";
// //             break;
// //           case "yawning":
// //             fallbackText = "You're yawning frequently. Plan to take a short break in the next 15 minutes to refresh.";
// //             break;
// //           case "steering_critical":
// //             fallbackText = "Your steering needs attention. Please refocus on the road and consider taking a break soon.";
// //             break;
// //           default:
// //             fallbackText = "Please stay alert. Consider taking a short break to maintain focus.";
// //         }
        
// //         const utterance = new SpeechSynthesisUtterance(fallbackText);
// //         utterance.onend = () => {
// //           setIsSpeaking(false);
// //           setActive(false);
// //         };
// //         window.speechSynthesis.speak(utterance);
// //       }
// //     }
// //   };

// //   // Manual activation for testing
// //   const handleManualActivate = () => {
// //     if (isSpeaking) return;

// //     if (!metrics || !assessment) {
// //       // Demo mode - test the voice
// //       setActive(true);
// //       setIsSpeaking(true);
// //       const utterance = new SpeechSynthesisUtterance(
// //         "Hello, I am AURA, your AI driving companion. I'm here to keep you safe and alert on your journey."
// //       );
// //       utterance.rate = 0.95;
// //       utterance.onend = () => {
// //         setActive(false);
// //         setIsSpeaking(false);
// //       };
// //       window.speechSynthesis.speak(utterance);
// //     } else {
// //       // Generate alert based on current metrics
// //       const alertType = assessment.risk_level === "CRITICAL" ? "critical" : "manual";
// //       generateVoiceAlert(metrics, assessment, alertType);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col gap-4 w-[36%]">
// //       {/* Optimal Flow State Card */}
// //       <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 rounded-3xl p-8 border border-purple-500/20 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
// //         {/* Glowing Animated Ring */}
// //         <div className="relative flex items-center justify-center mb-6">
// //           <div
// //             className={`w-56 h-56 rounded-full flex items-center justify-center border-4 ${
// //               active || isSpeaking ? "border-cyan-400 shadow-cyan-500/60" : "border-cyan-700 shadow-cyan-500/20"
// //             } shadow-2xl transition-all duration-500`}
// //           >
// //             <button
// //               onClick={handleManualActivate}
// //               disabled={isSpeaking}
// //               className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-semibold text-sm tracking-wider uppercase transition-all ${
// //                 active || isSpeaking
// //                   ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/50 scale-105"
// //                   : "bg-gradient-to-br from-slate-800 to-slate-900 hover:from-cyan-700/50 hover:to-blue-800/40 border border-cyan-600/30"
// //               } ${isSpeaking ? "cursor-not-allowed" : "cursor-pointer"}`}
// //             >
// //               {isSpeaking ? (
// //                 <Volume2 className="w-8 h-8 mb-2 animate-pulse" />
// //               ) : (
// //                 <Mic className={`w-8 h-8 mb-2 ${active ? "animate-pulse" : ""}`} />
// //               )}
// //               <h4 className="font-bold text-pretty border-cyan-400">AURA</h4>
// //               <span className="text-xs">AI Companion</span>
// //               {(active || isSpeaking) && (
// //                 <>
// //                   <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping opacity-40"></div>
// //                   <div
// //                     className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-30"
// //                     style={{ animationDelay: "0.3s" }}
// //                   ></div>
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </div>

// //         <h2 className="text-3xl font-bold text-cyan-400 mb-2">
// //           {isSpeaking ? "Speaking..." : "Optimal Flow State"}
// //         </h2>
// //         <p className="text-gray-300 text-sm">
// //           {isSpeaking ? "AURA is alerting you" : "Multi-modal AI processing"}
// //         </p>

// //         {/* Status Info */}
// //         {metrics && assessment && (
// //           <div className="mt-4 space-y-1">
// //             <div className="text-xs text-gray-400">
// //               Monitoring: <span className={`font-bold ${
// //                 assessment.risk_level === "CRITICAL" ? "text-red-400" :
// //                 assessment.risk_level === "HIGH" ? "text-orange-400" :
// //                 assessment.risk_level === "MODERATE" ? "text-yellow-400" :
// //                 "text-green-400"
// //               }`}>{assessment.risk_level}</span>
// //             </div>
// //             <div className="text-xs text-gray-400">
// //               Last Alert: {lastAlertType ? `${lastAlertType} (${Math.floor((Date.now() - lastAlertTime) / 1000)}s ago)` : "None"}
// //             </div>
// //             {Object.keys(consecutiveWarnings).length > 0 && (
// //               <div className="text-xs text-amber-400">
// //                 Tracking: {Object.entries(consecutiveWarnings).map(([key, val]) => `${key}(${val})`).join(', ')}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {!metrics && (
// //           <div className="mt-4 text-xs text-gray-400">
// //             {isMonitoring ? "Loading monitoring data..." : "Waiting for monitoring to start..."}
// //           </div>
// //         )}
// //       </div>

// //       {/* Predictive Timeline */}
// //       <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/50 rounded-3xl p-6 border border-indigo-500/20">
// //         <div className="flex items-center gap-2 mb-4">
// //           <Brain className="w-5 h-5 text-purple-400" />
// //           <h3 className="font-bold text-purple-200">Predictive Timeline</h3>
// //         </div>

// //         <div className="space-y-3">
// //           {[
// //             {
// //               min: "+5 min",
// //               conf: "78%",
// //               color: "green",
// //               msg: "Energy dip expected",
// //               hint: "→ Prepare uplifting playlist",
// //             },
// //             {
// //               min: "+15 min",
// //               conf: "95%",
// //               color: "blue",
// //               msg: "Scenic route ahead",
// //               hint: "→ Suggest mindful observation",
// //             },
// //             {
// //               min: "+25 min",
// //               conf: "82%",
// //               color: "amber",
// //               msg: "Rest recommended",
// //               hint: "→ Route to premium rest stop",
// //             },
// //           ].map((item, i) => (
// //             <div
// //               key={i}
// //               className="bg-slate-800/60 rounded-xl p-4 border-l-4 border-green-500"
// //             >
// //               <div className="flex justify-between items-start mb-2">
// //                 <span className="text-green-400 font-bold text-sm">
// //                   {item.min}
// //                 </span>
// //                 <span className="text-xs text-gray-400">
// //                   {item.conf} confidence
// //                 </span>
// //               </div>
// //               <p className="text-sm font-medium mb-1">{item.msg}</p>
// //               <p className="text-xs text-gray-400">{item.hint}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef } from "react";
// import { Brain, Mic, Volume2 } from "lucide-react";

// const API_URL = "https://vwhackathon-1.onrender.com";
// const GEMINI_API_KEY = "AIzaSyD-3gS77e9hTe6ryVxsK1rCdXr6mvxkG4U"; // Add your Gemini API key here if available
// const ALERT_COOLDOWN = 5000; // 5 seconds (for testing)
// const CRITICAL_ALERT_COOLDOWN = 3000; // 3 seconds (for critical)
// const WARNING_PERSISTENCE_THRESHOLD = 3; // Number of consecutive warnings before alerting

// export default function CenterPanel() {
//   const [active, setActive] = useState(false);
//   const [metrics, setMetrics] = useState(null);
//   const [assessment, setAssessment] = useState(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [lastAlertTime, setLastAlertTime] = useState(0);
//   const [lastAlertType, setLastAlertType] = useState("");
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [consecutiveWarnings, setConsecutiveWarnings] = useState({});
//   const consecutiveWarningsRef = useRef({});
//   const metricsIntervalRef = useRef(null);

//   // 🟩 Enable speech on first click (browser requirement)
//   useEffect(() => {
//     const unlockSpeech = () => {
//       const u = new SpeechSynthesisUtterance("System initialized.");
//       window.speechSynthesis.speak(u);
//       document.removeEventListener("click", unlockSpeech);
//       console.log("✅ Speech synthesis unlocked by user interaction.");
//     };
//     document.addEventListener("click", unlockSpeech);
//   }, []);

//   // 🟩 Check if monitoring is active
//   const checkMonitoringStatus = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/metrics`);
//       const data = await response.json();

//       if (data.status === "success" && data.data) {
//         if (!isMonitoring) {
//           setIsMonitoring(true);
//           startPolling();
//         }
//       } else {
//         if (isMonitoring) {
//           setIsMonitoring(false);
//           stopPolling();
//         }
//       }
//     } catch (error) {
//       if (isMonitoring) {
//         setIsMonitoring(false);
//         stopPolling();
//       }
//     }
//   };

//   // 🟩 Fetch metrics and assessment
//   const fetchMetrics = async () => {
//     try {
//       const [metricsRes, assessmentRes] = await Promise.all([
//         fetch(`${API_URL}/api/metrics`),
//         fetch(`${API_URL}/api/assessment`),
//       ]);

//       const metricsData = await metricsRes.json();
//       const assessmentData = await assessmentRes.json();

//       if (metricsData.status === "success") {
//         setMetrics(metricsData.data);
//       } else {
//         stopPolling();
//         setMetrics(null);
//         setAssessment(null);
//         return;
//       }

//       if (assessmentData.status === "success") {
//         setAssessment(assessmentData.data);
//       }

//       if (metricsData.status === "success" && assessmentData.status === "success") {
//         checkAndTriggerAlert(metricsData.data, assessmentData.data);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching metrics:", error);
//       setIsMonitoring(false);
//       stopPolling();
//     }
//   };

//   const startPolling = () => {
//     if (metricsIntervalRef.current) return;
//     console.log("▶️ Starting metrics polling...");
//     metricsIntervalRef.current = setInterval(fetchMetrics, 2000);
//     fetchMetrics();
//   };

//   const stopPolling = () => {
//     if (metricsIntervalRef.current) {
//       console.log("⏹️ Stopping metrics polling...");
//       clearInterval(metricsIntervalRef.current);
//       metricsIntervalRef.current = null;
//     }
//   };

//   useEffect(() => {
//     const statusCheckInterval = setInterval(() => {
//       checkMonitoringStatus();
//     }, 5000);

//     checkMonitoringStatus();
//     return () => {
//       clearInterval(statusCheckInterval);
//       stopPolling();
//     };
//   }, []);

//   // 🟩 Check and trigger alerts
//   const checkAndTriggerAlert = (metricsData, assessmentData) => {
//     const now = Date.now();
//     const { camera_metrics, steering_metrics } = metricsData;

//     let alertType = "";
//     let shouldAlert = false;

//     console.log("⚙️ Checking alerts:", assessmentData.risk_level, "Drowsy:", camera_metrics.is_drowsy);

//     if (camera_metrics.is_drowsy || assessmentData.risk_level === "CRITICAL") {
//       alertType = "drowsy";
//       if (now - lastAlertTime > CRITICAL_ALERT_COOLDOWN) shouldAlert = true;
//     } else if (assessmentData.risk_level === "HIGH") {
//       alertType = "high_risk";
//       shouldAlert = checkPersistentWarning("high_risk", now);
//     } else if (camera_metrics.perclos > 25) {
//       alertType = "perclos_high";
//       shouldAlert = checkPersistentWarning("perclos_high", now);
//     } else if (camera_metrics.is_yawning) {
//       alertType = "yawning";
//       shouldAlert = checkPersistentWarning("yawning", now, 5);
//     } else if (steering_metrics.steering_alert_level === "CRITICAL") {
//       alertType = "steering_critical";
//       shouldAlert = checkPersistentWarning("steering_critical", now);
//     } else {
//       consecutiveWarningsRef.current = {};
//       setConsecutiveWarnings({});
//       return;
//     }

//     if (shouldAlert) {
//       console.log("🔊 Triggering voice alert:", alertType);
//       generateVoiceAlert(metricsData, assessmentData, alertType);
//       setLastAlertTime(now);
//       setLastAlertType(alertType);
//       consecutiveWarningsRef.current = {};
//       setConsecutiveWarnings({});
//     }
//   };

//   // 🟩 Fix: Accumulate warnings properly
//   const checkPersistentWarning = (type, currentTime, requiredCount = WARNING_PERSISTENCE_THRESHOLD) => {
//     const timeSinceLastAlert = currentTime - lastAlertTime;
//     if (timeSinceLastAlert < ALERT_COOLDOWN) return false;

//     const currentCount = (consecutiveWarningsRef.current[type] || 0) + 1;
//     consecutiveWarningsRef.current = {
//       ...consecutiveWarningsRef.current,
//       [type]: currentCount,
//     };
//     setConsecutiveWarnings({ ...consecutiveWarningsRef.current });

//     console.log(`${type}: ${currentCount}/${requiredCount}`);
//     return currentCount >= requiredCount;
//   };

//   // 🟩 Voice Alert (Gemini + fallback)
//   const generateVoiceAlert = async (metricsData, assessmentData, alertType) => {
//     if (isSpeaking) return;
//     setIsSpeaking(true);
//     setActive(true);

//     let alertText = "";

//     try {
//       if (!GEMINI_API_KEY) throw new Error("Missing Gemini API key");

//       const prompt = `
//       You are AURA, an AI driving companion.
//       Generate a short alert (2 sentences) for ${alertType}.
//       Risk Level: ${assessmentData.risk_level}
//       Risk Score: ${assessmentData.risk_score}
//       Suggest one direct action for safety.`;

//       const textResponse = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
//         }
//       );

//       const textData = await textResponse.json();
//       alertText = textData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     } catch (error) {
//       console.warn("⚠️ Using fallback text:", error.message);
//       switch (alertType) {
//         case "drowsy":
//           alertText = "You're showing signs of drowsiness. Please pull over safely and take a 15-minute rest.";
//           break;
//         case "high_risk":
//         case "perclos_high":
//           alertText = "You're losing focus. Take a quick 10-minute break at the next rest stop.";
//           break;
//         case "yawning":
//           alertText = "You seem tired. Plan a short break in 15 minutes and stretch a bit.";
//           break;
//         case "steering_critical":
//           alertText = "Your steering is inconsistent. Please refocus or stop for a moment to refresh.";
//           break;
//         default:
//           alertText = "Stay alert and drive safely. Consider taking a brief pause if needed.";
//       }
//     }

//     console.log("AURA says:", alertText);
//     playSpeech(alertText);
//   };

//   // 🟩 Handle Text-to-Speech playback
//   const playSpeech = (text) => {
//     if (!("speechSynthesis" in window)) {
//       console.error("❌ Speech synthesis not supported in this browser.");
//       setIsSpeaking(false);
//       setActive(false);
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.95;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     utterance.onend = () => {
//       setIsSpeaking(false);
//       setActive(false);
//     };
//     utterance.onerror = (e) => {
//       console.error("Speech synthesis error:", e.error);
//       setIsSpeaking(false);
//       setActive(false);
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   // 🟩 Manual test trigger
//   const handleManualActivate = () => {
//     if (isSpeaking) return;
//     if (!metrics || !assessment) {
//       playSpeech("Hello, I am AURA, your AI driving companion. I will alert you if you appear drowsy or distracted.");
//     } else {
//       generateVoiceAlert(metrics, assessment, "manual");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 w-[36%]">
//       <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 rounded-3xl p-8 border border-purple-500/20 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
//         <div className="relative flex items-center justify-center mb-6">
//           <div
//             className={`w-56 h-56 rounded-full flex items-center justify-center border-4 ${
//               active || isSpeaking ? "border-cyan-400 shadow-cyan-500/60" : "border-cyan-700 shadow-cyan-500/20"
//             } shadow-2xl transition-all duration-500`}
//           >
//             <button
//               onClick={handleManualActivate}
//               disabled={isSpeaking}
//               className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-semibold text-sm tracking-wider uppercase transition-all ${
//                 active || isSpeaking
//                   ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/50 scale-105"
//                   : "bg-gradient-to-br from-slate-800 to-slate-900 hover:from-cyan-700/50 hover:to-blue-800/40 border border-cyan-600/30"
//               } ${isSpeaking ? "cursor-not-allowed" : "cursor-pointer"}`}
//             >
//               {isSpeaking ? (
//                 <Volume2 className="w-8 h-8 mb-2 animate-pulse" />
//               ) : (
//                 <Mic className={`w-8 h-8 mb-2 ${active ? "animate-pulse" : ""}`} />
//               )}
//               <h4 className="font-bold">AURA</h4>
//               <span className="text-xs">AI Companion</span>
//               {(active || isSpeaking) && (
//                 <>
//                   <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping opacity-40"></div>
//                   <div
//                     className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-30"
//                     style={{ animationDelay: "0.3s" }}
//                   ></div>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         <h2 className="text-3xl font-bold text-cyan-400 mb-2">
//           {isSpeaking ? "Speaking..." : "Optimal Flow State"}
//         </h2>
//         <p className="text-gray-300 text-sm">
//           {isSpeaking ? "AURA is alerting you" : "Multi-modal AI processing"}
//         </p>

//         {metrics && assessment && (
//           <div className="mt-4 space-y-1 text-xs text-gray-400">
//             <div>
//               Monitoring:{" "}
//               <span
//                 className={`font-bold ${
//                   assessment.risk_level === "CRITICAL"
//                     ? "text-red-400"
//                     : assessment.risk_level === "HIGH"
//                     ? "text-orange-400"
//                     : assessment.risk_level === "MODERATE"
//                     ? "text-yellow-400"
//                     : "text-green-400"
//                 }`}
//               >
//                 {assessment.risk_level}
//               </span>
//             </div>
//             <div>
//               Last Alert:{" "}
//               {lastAlertType
//                 ? `${lastAlertType} (${Math.floor((Date.now() - lastAlertTime) / 1000)}s ago)`
//                 : "None"}
//             </div>
//             {Object.keys(consecutiveWarnings).length > 0 && (
//               <div className="text-amber-400">
//                 Tracking:{" "}
//                 {Object.entries(consecutiveWarnings)
//                   .map(([key, val]) => `${key}(${val})`)
//                   .join(", ")}
//               </div>
//             )}
//           </div>
//         )}

//         {!metrics && (
//           <div className="mt-4 text-xs text-gray-400">
//             {isMonitoring ? "Loading monitoring data..." : "Waiting for monitoring to start..."}
//           </div>
//         )}
//       </div>

//       {/* Predictive Timeline (Static Example) */}
//       <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/50 rounded-3xl p-6 border border-indigo-500/20">
//         <div className="flex items-center gap-2 mb-4">
//           <Brain className="w-5 h-5 text-purple-400" />
//           <h3 className="font-bold text-purple-200">Predictive Timeline</h3>
//         </div>
//         <div className="space-y-3">
//           {[
//             { min: "+5 min", conf: "78%", msg: "Energy dip expected", hint: "→ Prepare uplifting playlist" },
//             { min: "+15 min", conf: "95%", msg: "Scenic route ahead", hint: "→ Enjoy mindful driving" },
//             { min: "+25 min", conf: "82%", msg: "Rest recommended", hint: "→ Plan rest stop soon" },
//           ].map((item, i) => (
//             <div key={i} className="bg-slate-800/60 rounded-xl p-4 border-l-4 border-green-500">
//               <div className="flex justify-between mb-2 text-sm">
//                 <span className="text-green-400 font-bold">{item.min}</span>
//                 <span className="text-gray-400 text-xs">{item.conf} confidence</span>
//               </div>
//               <p className="text-sm font-medium mb-1">{item.msg}</p>
//               <p className="text-xs text-gray-400">{item.hint}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }