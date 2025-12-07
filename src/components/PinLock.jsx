import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt, FaExclamationTriangle, FaUserSecret } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const PinLock = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // TRAP STATES (Naam aur Email lene ke liye)
  const [trapName, setTrapName] = useState("");
  const [trapEmail, setTrapEmail] = useState("");
  const [trapSubmitted, setTrapSubmitted] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- PHOTO CAPTURE ---
  const captureIntruderPhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const context = canvasRef.current.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, 300, 200);
        const imageBase64 = canvasRef.current.toDataURL("image/png");
        stream.getTracks().forEach(track => track.stop());
        return imageBase64;
      }
    } catch (err) { return null; }
  };

  // --- LOCATION ---
  const getLocationInfo = async () => {
    try {
      const res = await axios.get("https://ipapi.co/json/");
      return res.data;
    } catch (error) { return {}; }
  };

  // --- SEND DATA TO ADMIN ---
  const sendSecurityAlert = async (manualName = "", manualEmail = "") => {
    const photo = await captureIntruderPhoto();
    const location = await getLocationInfo();

    try {
      await axios.post("/api/send-alert", {
        userAgent: navigator.userAgent,
        time: new Date().toLocaleString(),
        locationData: location,
        photo: photo,
        intruderName: manualName || "Not Provided", // Agar trap me data dala to yahan aayega
        intruderEmail: manualEmail || "Not Provided"
      });
      
      if(manualName) {
          toast.success("Request Sent to Admin (FAKE)"); // Intruder ko lagega request gayi
          setTrapSubmitted(true);
      } else {
          toast.error("SECURITY ALERT SENT!");
      }

    } catch (error) { console.error("Alert failed", error); }
  };

  // --- HANDLE TRAP SUBMIT ---
  const handleTrapSubmit = (e) => {
      e.preventDefault();
      // Jaise hi wo submit karega, hum data bhej denge
      sendSecurityAlert(trapName, trapEmail);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="absolute opacity-0 pointer-events-none">
        <video ref={videoRef} autoPlay playsInline width="300" height="200"></video>
        <canvas ref={canvasRef} width="300" height="200"></canvas>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-[#111] border border-gray-800 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border transition-all duration-300 ${isBlocked ? "bg-red-900/20 border-red-500" : "bg-gray-900 border-gray-700"}`}>
             {isBlocked ? <FaExclamationTriangle className="text-3xl text-red-500" /> : <FaShieldAlt className="text-3xl text-blue-500" />}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isBlocked ? "SYSTEM LOCKED" : "DevSamp Vault"}
          </h2>
          
          <p className={`${isBlocked ? "text-red-400" : "text-gray-400"} text-sm mb-6`}>
            {isBlocked 
                ? (trapSubmitted ? "Access Request Rejected by Admin." : "Security Violation! Verify Identity to Unlock.") 
                : "Enter Master PIN to access secured data."}
          </p>

          {/* --- NORMAL PIN FORM --- */}
          {!isBlocked && (
            <form onSubmit={(e) => {
                e.preventDefault();
                onUnlock(pin, () => {
                    const newAttempts = attempts + 1;
                    setAttempts(newAttempts);
                    setError(true);
                    setPin("");
                    
                    if (newAttempts === 1) navigator.mediaDevices.getUserMedia({ video: true }).catch(()=>{});

                    if (newAttempts >= 4) {
                        setIsBlocked(true);
                        // Block hote hi purana photo bhej do (Safe side)
                        sendSecurityAlert(); 
                    } else {
                        toast.error(`Wrong PIN! ${4 - newAttempts} attempts left.`);
                    }
                });
            }}>
                <input
                type="password"
                placeholder="Enter PIN"
                className={`w-full bg-black border ${error ? "border-red-500" : "border-gray-700"} text-center text-white text-2xl tracking-[10px] py-4 rounded-xl focus:outline-none focus:border-blue-500 transition mb-6`}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                autoFocus
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
                    <FaLock size={14} /> Unlock Vault
                </button>
            </form>
          )}

          {/* --- FAKE TRAP FORM (Blocked hone par dikhega) --- */}
          {isBlocked && !trapSubmitted && (
             <motion.form 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleTrapSubmit} className="space-y-4"
             >
                 <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-red-300 text-left">
                    <FaUserSecret className="inline mr-2"/>
                    Suspicious activity detected. Please provide your Name and Email to request access from the Admin.
                 </div>
                 
                 <input
                    type="text" required placeholder="Full Name"
                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:border-red-500 focus:outline-none"
                    value={trapName} onChange={(e) => setTrapName(e.target.value)}
                 />
                 <input
                    type="email" required placeholder="Email Address"
                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:border-red-500 focus:outline-none"
                    value={trapEmail} onChange={(e) => setTrapEmail(e.target.value)}
                 />
                 
                 <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition">
                    Verify Identity
                 </button>
             </motion.form>
          )}

          {trapSubmitted && (
              <div className="text-red-500 font-bold mt-4 border border-red-500 p-4 rounded-xl bg-red-900/20">
                  SYSTEM PERMANENTLY LOCKED.
                  <br/><span className="text-xs font-normal text-gray-400">Admin has been notified with your details.</span>
              </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default PinLock;