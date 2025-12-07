import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaLock, FaMagic } from 'react-icons/fa';
import PlatformSelect from './PlatformSelect';

const AddAccountForm = ({ onAdd, loading, onClose }) => {
  const [form, setForm] = useState({ platform: "", username: "", password: "" });
  const formRef = useRef(null);

  // --- CLICK OUTSIDE LOGIC (Updated for UX Fix) ---
  useEffect(() => {
    function handleClickOutside(event) {
      // Check karte hain ki click form ke andar hua ya bahar
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    }

    // YAHAN CHANGE KIYA HAI: 'mousedown' hata kar 'click' lagaya
    // Isse dusre buttons ka click pehle register hoga, fir form band hoga.
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.platform || !form.password) return;
    onAdd(form);
    setForm({ platform: "", username: "", password: "" });
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password: pass });
  };

  return (
    <motion.div 
      ref={formRef}
      layout
      initial={{ opacity: 0, y: -40, filter: "blur(10px)", scale: 0.98 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.98, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      // Z-Index aur Overflow set kiya
      className="bg-gray-900/90 border border-gray-800 p-6 rounded-2xl shadow-2xl backdrop-blur-md mb-10 relative z-50 overflow-visible"
      
      // Ye line jaruri hai: Agar form ke andar click ho to wo bahar (document) tak na pahuche
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <FaLock className="text-blue-500" /> Add New Credentials
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        
        <div className="flex-1 min-w-full md:min-w-[200px] relative z-[60]">
             <PlatformSelect value={form.platform} onChange={(val) => setForm({ ...form, platform: val })} />
        </div>

        <input
          type="text"
          placeholder="Username / Email"
          className="flex-1 w-full bg-gray-950 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition shadow-inner relative z-10"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <div className="flex-1 w-full relative z-10">
            <input
            type="text"
            placeholder="Password"
            className="w-full bg-gray-950 border border-gray-800 text-white pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition font-mono shadow-inner"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
                type="button"
                onClick={generatePassword}
                className="absolute right-2 top-2 p-1.5 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition"
                title="Generate Strong Password"
            >
                <FaMagic />
            </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 min-w-[100px] shadow-lg shadow-blue-900/20 relative z-10"
        >
          {loading ? "..." : <><FaPlus /> Add</>}
        </button>
      </form>
    </motion.div>
  );
};

export default AddAccountForm;