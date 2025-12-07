import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const PinLock = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan hum PIN parent ko bhejenge check karne ke liye
    if (pin.length > 0) {
      onUnlock(pin);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-[#111] border border-gray-800 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden"
      >
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <FaShieldAlt className="text-3xl text-blue-500" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">DevSamp Vault</h2>
          <p className="text-gray-400 text-sm mb-6">Enter Master PIN to access secured data.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Enter PIN"
              className={`w-full bg-black border ${error ? "border-red-500" : "border-gray-700"} text-center text-white text-2xl tracking-[10px] py-4 rounded-xl focus:outline-none focus:border-blue-500 transition mb-6 placeholder:tracking-normal placeholder:text-lg`}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              autoFocus
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <FaLock size={14} /> Unlock Vault
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PinLock;