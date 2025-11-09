// import React, { useRef, useState, useEffect } from "react";
// import { Camera } from "@mediapipe/camera_utils";
// import { Eye, Activity, AlertTriangle, Brain } from "lucide-react";

// const API_URL = "https://vwhackathon-1.onrender.com";
// const SEND_FPS = 10; // Send 10 frames per second

// export default function LeftPanel() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const sendCanvasRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sendIntervalRef = useRef(null);
//   const metricsIntervalRef = useRef(null);

//   const [monitoring, setMonitoring] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [metrics, setMetrics] = useState(null);
//   const [assessment, setAssessment] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState("disconnected");

//   useEffect(() => {
//     if (!sendCanvasRef.current) {
//       sendCanvasRef.current = document.createElement("canvas");
//     }
//   }, []);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { width: 640, height: 480 } 
//       });
//       videoRef.current.srcObject = stream;
//       await videoRef.current.play();

//       cameraRef.current = new Camera(videoRef.current, {
//         onFrame: async () => drawOverlay(),
//         width: 640,
//         height: 480,
//       });
//       cameraRef.current.start();
//       setCameraReady(true);
//       setConnectionStatus("camera ready");
//     } catch (err) {
//       console.error("Camera error:", err);
//       setConnectionStatus("camera error");
//       alert("Could not access camera. Please grant permission.");
//     }
//   };

//   const drawOverlay = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;
    
//     const ctx = canvas.getContext("2d");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     // Draw monitoring status
//     ctx.font = "bold 16px Inter";
//     ctx.fillStyle = monitoring ? "#10b981" : "#3b82f6";
//     ctx.fillText(monitoring ? "● MONITORING" : "● PREVIEW", 10, 30);
    
//     // Draw metrics overlay if available
//     if (metrics && monitoring) {
//       const { camera_metrics } = metrics;
      
//       // Status indicator
//       ctx.font = "bold 20px Inter";
//       if (camera_metrics.is_drowsy) {
//         ctx.fillStyle = "#ef4444";
//         ctx.fillText("😴 DROWSY ALERT", 10, 60);
//       } else if (camera_metrics.is_yawning) {
//         ctx.fillStyle = "#f59e0b";
//         ctx.fillText("🥱 YAWNING", 10, 60);
//       }
      
//       // Draw metrics
//       ctx.font = "12px Inter";
//       ctx.fillStyle = "#ffffff";
//       ctx.fillText(`Blinks: ${camera_metrics.blink_count}`, 10, canvas.height - 60);
//       ctx.fillText(`EAR: ${camera_metrics.ear.toFixed(3)}`, 10, canvas.height - 40);
//       ctx.fillText(`PERCLOS: ${camera_metrics.perclos.toFixed(1)}%`, 10, canvas.height - 20);
//     }
//   };

//   const sendCurrentFrame = async () => {
//     const video = videoRef.current;
//     const sendCanvas = sendCanvasRef.current;
    
//     if (!video || video.videoWidth === 0) return;
    
//     const w = video.videoWidth;
//     const h = video.videoHeight;
//     sendCanvas.width = w;
//     sendCanvas.height = h;
    
//     const ctx = sendCanvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, w, h);

//     try {
//       // Convert canvas to base64
//       const base64Frame = sendCanvas.toDataURL("image/jpeg", 0.8).split(",")[1];
      
//       // Send to Flask API /api/process_frame endpoint
//       const response = await fetch(`${API_URL}/api/process_frame`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ frame: base64Frame }),
//       });

//       const result = await response.json();
//       if (result.status !== "success") {
//         console.error("Frame processing error:", result.message);
//       }
//     } catch (error) {
//       console.error("Error sending frame:", error);
//       setConnectionStatus("connection error");
//     }
//   };


//   const fetchMetrics = async () => {
//   try {
//     const [metricsRes, assessmentRes] = await Promise.all([
//       fetch(`${API_URL}/api/metrics`),
//       fetch(`${API_URL}/api/assessment`),
//     ]);

//     const metricsData = await metricsRes.json();
//     const assessmentData = await assessmentRes.json();

//     if (metricsData.status === "success") setMetrics(metricsData.data);

//     if (assessmentData.status === "success") {
//       setAssessment(assessmentData.data);

//       // 🚨 Dispatch global event when risk changes
//       window.dispatchEvent(
//         new CustomEvent("riskLevelChange", {
//           detail: assessmentData.data.risk_level,
//         })
//       );
//     }
//   } catch (error) {
//     console.error("Error fetching metrics:", error);
//   }
// };


//   const startMonitoring = async () => {
//     try {
//       // Call /api/start to initialize the detection system
//       const response = await fetch(`${API_URL}/api/start`, {
//         method: "POST",
//       });
      
//       const result = await response.json();
//       if (result.status === "success" || result.status === "info") {
//         setMonitoring(true);
//         setConnectionStatus("monitoring active");

//         // Start sending frames
//         sendIntervalRef.current = setInterval(() => {
//           sendCurrentFrame();
//         }, 1000 / SEND_FPS);

//         // Start fetching metrics
//         metricsIntervalRef.current = setInterval(() => {
//           fetchMetrics();
//         }, 500); // Fetch metrics every 500ms
//       }
//     } catch (error) {
//       console.error("Error starting monitoring:", error);
//       alert("Failed to start monitoring. Check if API is running.");
//     }
//   };

//   const stopMonitoring = async () => {
//     // Clear intervals
//     if (sendIntervalRef.current) {
//       clearInterval(sendIntervalRef.current);
//       sendIntervalRef.current = null;
//     }
    
//     if (metricsIntervalRef.current) {
//       clearInterval(metricsIntervalRef.current);
//       metricsIntervalRef.current = null;
//     }

//     // Call /api/stop
//     try {
//       await fetch(`${API_URL}/api/stop`, { method: "POST" });
//     } catch (error) {
//       console.error("Error stopping monitoring:", error);
//     }

//     setMonitoring(false);
//     setConnectionStatus("camera ready");
//     setMetrics(null);
//     setAssessment(null);
//   };

//   const resetCounters = async () => {
//     try {
//       await fetch(`${API_URL}/api/reset`, { method: "POST" });
//       alert("Counters reset successfully!");
//     } catch (error) {
//       console.error("Error resetting counters:", error);
//     }
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopMonitoring();
//       if (cameraRef.current) {
//         cameraRef.current.stop();
//       }
//     };
//   }, []);

//   return (
//     <div className="flex flex-col gap-4 w-[32%]">
//       {/* Alert Status Panel */}
//       {monitoring && assessment && (
//         <div className={`rounded-2xl p-4 border-2 ${
//           assessment.risk_level === "CRITICAL"
//             ? "bg-red-900/30 border-red-500"
//             : assessment.risk_level === "HIGH"
//             ? "bg-orange-900/30 border-orange-500"
//             : assessment.risk_level === "MODERATE"
//             ? "bg-yellow-900/30 border-yellow-500"
//             : "bg-green-900/30 border-green-500"
//         }`}>
//           <div className="flex items-center gap-3 mb-2">
//             <AlertTriangle className={`w-6 h-6 ${
//               assessment.risk_level === "CRITICAL" ? "text-red-500" :
//               assessment.risk_level === "HIGH" ? "text-orange-500" :
//               assessment.risk_level === "MODERATE" ? "text-yellow-500" :
//               "text-green-500"
//             }`} />
//             <div>
//               <div className="text-xl font-bold">{assessment.risk_level}</div>
//               <div className="text-xs text-gray-300">Risk Score: {assessment.risk_score}/100</div>
//             </div>
//           </div>
//           <div className="text-sm font-semibold mb-2">{assessment.action_needed}</div>
//           {assessment.risk_factors.length > 0 && (
//             <div className="text-xs space-y-1">
//               {assessment.risk_factors.map((factor, idx) => (
//                 <div key={idx} className="text-gray-300">• {factor}</div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Camera Panel */}
//       <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-sm rounded-3xl p-4 border border-blue-500/30 flex flex-col">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-blue-300 font-bold flex items-center gap-2">
//             <Brain className="w-5 h-5" />
//             Driver Monitoring
//           </h3>
//           <div className={`w-2 h-2 rounded-full ${
//             monitoring ? "bg-green-400 animate-pulse" : 
//             cameraReady ? "bg-blue-400" : 
//             "bg-red-400"
//           }`}></div>
//         </div>

//         {/* Video Display */}
//         <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-700 bg-black">
//           <video
//             ref={videoRef}
//             playsInline
//             muted
//             className="w-full h-full object-cover"
//           />
//           <canvas
//             ref={canvasRef}
//             className="absolute inset-0 w-full h-full pointer-events-none"
//           />
//         </div>

//         {/* Control Buttons */}
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={startCamera}
//             disabled={cameraReady}
//             className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
//               cameraReady
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-500"
//             }`}
//           >
//             {cameraReady ? "✓ Camera Ready" : "Grant Camera"}
//           </button>
          
//           {!monitoring ? (
//             <button
//               onClick={startMonitoring}
//               disabled={!cameraReady}
//               className="flex-1 px-3 py-2 text-sm font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
//             >
//               Start Monitoring
//             </button>
//           ) : (
//             <button
//               onClick={stopMonitoring}
//               className="flex-1 px-3 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 rounded-lg transition-all"
//             >
//               Stop Monitoring
//             </button>
//           )}
//         </div>

//         {monitoring && (
//           <button
//             onClick={resetCounters}
//             className="w-full px-3 py-2 mt-2 text-xs bg-purple-600 hover:bg-purple-500 rounded-lg transition-all"
//           >
//             Reset Counters
//           </button>
//         )}

//         {/* Status */}
//         <div className="text-center mt-3 text-xs text-gray-400">
//           Status: <span className="text-cyan-400 font-semibold">{connectionStatus}</span>
//         </div>

//         {/* Real-time Metrics Display */}
//         {metrics && (
//           <div className="mt-4 border-t border-slate-700 pt-4">
//             {/* Eye Metrics */}
//             <div className="mb-4">
//               <h4 className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-2">
//                 <Eye className="w-4 h-4" />
//                 Eye Tracking
//               </h4>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Status</div>
//                   <div className={`text-sm font-bold ${
//                     metrics.camera_metrics.is_drowsy ? "text-red-400" :
//                     metrics.camera_metrics.is_yawning ? "text-yellow-400" :
//                     "text-green-400"
//                   }`}>
//                     {metrics.camera_metrics.camera_status.toUpperCase()}
//                   </div>
//                 </div>
                
//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Blinks</div>
//                   <div className="text-cyan-400 font-bold text-sm">
//                     {metrics.camera_metrics.blink_count}
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">EAR</div>
//                   <div className={`text-sm font-bold ${
//                     metrics.camera_metrics.ear < 0.21 ? "text-red-400" : "text-green-400"
//                   }`}>
//                     {metrics.camera_metrics.ear.toFixed(3)}
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">MAR</div>
//                   <div className={`text-sm font-bold ${
//                     metrics.camera_metrics.mar > 0.6 ? "text-yellow-400" : "text-green-400"
//                   }`}>
//                     {metrics.camera_metrics.mar.toFixed(3)}
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">PERCLOS</div>
//                   <div className={`text-sm font-bold ${
//                     metrics.camera_metrics.perclos > 20 ? "text-red-400" :
//                     metrics.camera_metrics.perclos > 10 ? "text-yellow-400" :
//                     "text-green-400"
//                   }`}>
//                     {metrics.camera_metrics.perclos.toFixed(1)}%
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Head Rot.</div>
//                   <div className="text-blue-400 font-bold text-sm">
//                     {metrics.camera_metrics.head_rotation.toFixed(0)}°
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Steering Metrics */}
//             <div>
//               <h4 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-2">
//                 <Activity className="w-4 h-4" />
//                 Steering Analysis
//               </h4>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Lane Dev.</div>
//                   <div className={`text-sm font-bold ${
//                     metrics.steering_metrics.lane_deviation_score > 60 ? "text-red-400" :
//                     metrics.steering_metrics.lane_deviation_score > 40 ? "text-yellow-400" :
//                     "text-green-400"
//                   }`}>
//                     {metrics.steering_metrics.lane_deviation_score.toFixed(0)}
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Corrections</div>
//                   <div className="text-cyan-400 font-bold text-sm">
//                     {metrics.steering_metrics.micro_correction_rate}
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Smoothness</div>
//                   <div className="text-blue-400 font-bold text-sm">
//                     {metrics.steering_metrics.steering_smoothness.toFixed(0)}%
//                   </div>
//                 </div>

//                 <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
//                   <div className="text-[10px] text-slate-400">Alert Level</div>
//                   <div className={`text-xs font-bold ${
//                     metrics.steering_metrics.steering_alert_level === "CRITICAL" ? "text-red-400" :
//                     metrics.steering_metrics.steering_alert_level === "WARNING" ? "text-orange-400" :
//                     metrics.steering_metrics.steering_alert_level === "CAUTION" ? "text-yellow-400" :
//                     "text-green-400"
//                   }`}>
//                     {metrics.steering_metrics.steering_alert_level}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Performance */}
//             <div className="mt-3 bg-slate-800/30 rounded-lg p-2 border border-slate-700">
//               <div className="flex justify-between items-center text-xs">
//                 <span className="text-slate-400">Processing FPS</span>
//                 <span className="text-blue-400 font-bold">{metrics.performance.fps}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState, useEffect } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Eye, Activity, AlertTriangle, Brain, Wifi, WifiOff } from "lucide-react";

const API_URL = "https://vwhackathon-1.onrender.com";
const SEND_FPS = 10;

export default function LeftPanel() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sendCanvasRef = useRef(null);
  const cameraRef = useRef(null);
  const sendIntervalRef = useRef(null);
  const metricsIntervalRef = useRef(null);
  const sessionIdRef = useRef(null);

  const [monitoring, setMonitoring] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    checkAPIHealth();
    const healthInterval = setInterval(checkAPIHealth, 10000);
    return () => clearInterval(healthInterval);
  }, []);

  useEffect(() => {
    if (!sendCanvasRef.current) {
      sendCanvasRef.current = document.createElement("canvas");
    }
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      const data = await response.json();
      if (data.status === 'healthy') {
        setApiConnected(true);
        console.log("✅ API connection healthy");
      }
    } catch (error) {
      setApiConnected(false);
      console.error("❌ API health check failed:", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => drawOverlay(),
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
      setCameraReady(true);
      setConnectionStatus("camera ready");
    } catch (err) {
      console.error("Camera error:", err);
      setConnectionStatus("camera error");
      alert("Could not access camera. Please grant permission.");
    }
  };

  const drawOverlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold 16px Inter";
    ctx.fillStyle = monitoring ? "#10b981" : "#3b82f6";
    ctx.fillText(monitoring ? "● MONITORING" : "● PREVIEW", 10, 30);
    
    if (metrics && monitoring) {
      const { camera_metrics } = metrics;
      
      ctx.font = "bold 20px Inter";
      if (camera_metrics.is_drowsy) {
        ctx.fillStyle = "#ef4444";
        ctx.fillText("😴 DROWSY ALERT", 10, 60);
      } else if (camera_metrics.is_yawning) {
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("🥱 YAWNING", 10, 60);
      }
      
      ctx.font = "12px Inter";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`Blinks: ${camera_metrics.blink_count}`, 10, canvas.height - 60);
      ctx.fillText(`EAR: ${camera_metrics.ear.toFixed(3)}`, 10, canvas.height - 40);
      ctx.fillText(`PERCLOS: ${camera_metrics.perclos.toFixed(1)}%`, 10, canvas.height - 20);
    }
  };

  const sendCurrentFrame = async () => {
    const video = videoRef.current;
    const sendCanvas = sendCanvasRef.current;
    
    if (!video || video.videoWidth === 0) return;
    
    const w = video.videoWidth;
    const h = video.videoHeight;
    sendCanvas.width = w;
    sendCanvas.height = h;
    
    const ctx = sendCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    try {
      const base64Frame = sendCanvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      
      const response = await fetch(`${API_URL}/api/process_frame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          frame: base64Frame,
          session_id: sessionIdRef.current 
        }),
        signal: AbortSignal.timeout(5000)
      });

      const result = await response.json();
      if (result.status !== "success") {
        console.error("Frame processing error:", result.message);
      }
    } catch (error) {
      console.error("Error sending frame:", error);
      setConnectionStatus("connection error");
    }
  };

  const fetchMetrics = async () => {
    try {
      const sessionParam = sessionIdRef.current ? `?session_id=${sessionIdRef.current}` : '';
      
      const [metricsRes, assessmentRes] = await Promise.all([
        fetch(`${API_URL}/api/metrics${sessionParam}`, {
          signal: AbortSignal.timeout(5000)
        }),
        fetch(`${API_URL}/api/assessment${sessionParam}`, {
          signal: AbortSignal.timeout(5000)
        }),
      ]);

      const metricsData = await metricsRes.json();
      const assessmentData = await assessmentRes.json();

      if (metricsData.status === "success") setMetrics(metricsData.data);

      if (assessmentData.status === "success") {
        setAssessment(assessmentData.data);

        window.dispatchEvent(
          new CustomEvent("riskLevelChange", {
            detail: assessmentData.data.risk_level,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const startMonitoring = async () => {
    if (!apiConnected) {
      alert("Cannot start monitoring: API is not connected. Please check if the backend is running.");
      return;
    }

    try {
      setConnectionStatus("starting...");
      
      const response = await fetch(`${API_URL}/api/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      const result = await response.json();
      console.log("Start response:", result);
      
      if (result.status === "success" || result.status === "info") {
        if (result.session_id) {
          sessionIdRef.current = result.session_id;
          console.log("Session ID:", sessionIdRef.current);
        }
        
        setMonitoring(true);
        setConnectionStatus("monitoring active");

        sendIntervalRef.current = setInterval(() => {
          sendCurrentFrame();
        }, 1000 / SEND_FPS);

        metricsIntervalRef.current = setInterval(() => {
          fetchMetrics();
        }, 500);
        
        console.log("✅ Monitoring started successfully");
      } else {
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error starting monitoring:", error);
      setConnectionStatus("error");
      alert(`Failed to start monitoring: ${error.message}\n\nPlease check:\n1. Backend is running on ${API_URL}\n2. CORS is enabled\n3. Network connection is stable`);
    }
  };

  const stopMonitoring = async () => {
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }

    try {
      await fetch(`${API_URL}/api/stop`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current
        }),
        signal: AbortSignal.timeout(5000)
      });
    } catch (error) {
      console.error("Error stopping monitoring:", error);
    }

    setMonitoring(false);
    setConnectionStatus("camera ready");
    setMetrics(null);
    setAssessment(null);
  };

  const resetCounters = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reset`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current
        }),
        signal: AbortSignal.timeout(5000)
      });
      
      const result = await response.json();
      if (result.status === "success") {
        alert("Counters reset successfully!");
      } else {
        alert("Failed to reset counters: " + result.message);
      }
    } catch (error) {
      console.error("Error resetting counters:", error);
      alert("Error resetting counters: " + error.message);
    }
  };

  useEffect(() => {
    return () => {
      stopMonitoring();
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-[32%]">
      <div className={`rounded-lg p-3 border flex items-center gap-3 ${
        apiConnected 
          ? "bg-green-900/20 border-green-500/30" 
          : "bg-red-900/20 border-red-500/30"
      }`}>
        {apiConnected ? (
          <Wifi className="w-5 h-5 text-green-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-400" />
        )}
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {apiConnected ? "API Connected" : "API Disconnected"}
          </div>
          <div className="text-xs text-gray-400">{API_URL}</div>
        </div>
      </div>

      {monitoring && assessment && (
        <div className={`rounded-2xl p-4 border-2 ${
          assessment.risk_level === "CRITICAL"
            ? "bg-red-900/30 border-red-500"
            : assessment.risk_level === "HIGH"
            ? "bg-orange-900/30 border-orange-500"
            : assessment.risk_level === "MODERATE"
            ? "bg-yellow-900/30 border-yellow-500"
            : "bg-green-900/30 border-green-500"
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className={`w-6 h-6 ${
              assessment.risk_level === "CRITICAL" ? "text-red-500" :
              assessment.risk_level === "HIGH" ? "text-orange-500" :
              assessment.risk_level === "MODERATE" ? "text-yellow-500" :
              "text-green-500"
            }`} />
            <div>
              <div className="text-xl font-bold">{assessment.risk_level}</div>
              <div className="text-xs text-gray-300">Risk Score: {assessment.risk_score}/100</div>
            </div>
          </div>
          <div className="text-sm font-semibold mb-2">{assessment.action_needed}</div>
          {assessment.risk_factors.length > 0 && (
            <div className="text-xs space-y-1">
              {assessment.risk_factors.map((factor, idx) => (
                <div key={idx} className="text-gray-300">• {factor}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-sm rounded-3xl p-4 border border-blue-500/30 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-blue-300 font-bold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Driver Monitoring
          </h3>
          <div className={`w-2 h-2 rounded-full ${
            monitoring ? "bg-green-400 animate-pulse" : 
            cameraReady ? "bg-blue-400" : 
            "bg-red-400"
          }`}></div>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-700 bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={startCamera}
            disabled={cameraReady}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              cameraReady
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {cameraReady ? "✓ Camera Ready" : "Grant Camera"}
          </button>
          
          {!monitoring ? (
            <button
              onClick={startMonitoring}
              disabled={!cameraReady || !apiConnected}
              className="flex-1 px-3 py-2 text-sm font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
            >
              Start Monitoring
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="flex-1 px-3 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 rounded-lg transition-all"
            >
              Stop Monitoring
            </button>
          )}
        </div>

        {monitoring && (
          <button
            onClick={resetCounters}
            className="w-full px-3 py-2 mt-2 text-xs bg-purple-600 hover:bg-purple-500 rounded-lg transition-all"
          >
            Reset Counters
          </button>
        )}

        <div className="text-center mt-3 text-xs text-gray-400">
          Status: <span className="text-cyan-400 font-semibold">{connectionStatus}</span>
          {sessionIdRef.current && (
            <div className="text-[10px] mt-1">Session: {sessionIdRef.current.substring(0, 8)}...</div>
          )}
        </div>

        {metrics && (
          <div className="mt-4 border-t border-slate-700 pt-4">
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Eye Tracking
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Status</div>
                  <div className={`text-sm font-bold ${
                    metrics.camera_metrics.is_drowsy ? "text-red-400" :
                    metrics.camera_metrics.is_yawning ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {metrics.camera_metrics.camera_status.toUpperCase()}
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Blinks</div>
                  <div className="text-cyan-400 font-bold text-sm">
                    {metrics.camera_metrics.blink_count}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">EAR</div>
                  <div className={`text-sm font-bold ${
                    metrics.camera_metrics.ear < 0.21 ? "text-red-400" : "text-green-400"
                  }`}>
                    {metrics.camera_metrics.ear.toFixed(3)}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">MAR</div>
                  <div className={`text-sm font-bold ${
                    metrics.camera_metrics.mar > 0.6 ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {metrics.camera_metrics.mar.toFixed(3)}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">PERCLOS</div>
                  <div className={`text-sm font-bold ${
                    metrics.camera_metrics.perclos > 20 ? "text-red-400" :
                    metrics.camera_metrics.perclos > 10 ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {metrics.camera_metrics.perclos.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Head Rot.</div>
                  <div className="text-blue-400 font-bold text-sm">
                    {metrics.camera_metrics.head_rotation.toFixed(0)}°
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Steering Analysis
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Lane Dev.</div>
                  <div className={`text-sm font-bold ${
                    metrics.steering_metrics.lane_deviation_score > 60 ? "text-red-400" :
                    metrics.steering_metrics.lane_deviation_score > 40 ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {metrics.steering_metrics.lane_deviation_score.toFixed(0)}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Corrections</div>
                  <div className="text-cyan-400 font-bold text-sm">
                    {metrics.steering_metrics.micro_correction_rate}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Smoothness</div>
                  <div className="text-blue-400 font-bold text-sm">
                    {metrics.steering_metrics.steering_smoothness.toFixed(0)}%
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Alert Level</div>
                  <div className={`text-xs font-bold ${
                    metrics.steering_metrics.steering_alert_level === "CRITICAL" ? "text-red-400" :
                    metrics.steering_metrics.steering_alert_level === "WARNING" ? "text-orange-400" :
                    metrics.steering_metrics.steering_alert_level === "CAUTION" ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {metrics.steering_metrics.steering_alert_level}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-slate-800/30 rounded-lg p-2 border border-slate-700">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Processing FPS</span>
                <span className="text-blue-400 font-bold">{metrics.performance.fps}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
