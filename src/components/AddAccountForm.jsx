import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaLock } from 'react-icons/fa';
import PlatformSelect from './PlatformSelect';

const AddAccountForm = ({ onAdd, loading }) => {
  const [form, setForm] = useState({ platform: "", username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.platform || !form.password) return;
    onAdd(form);
    setForm({ platform: "", username: "", password: "" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm mb-10 relative z-40"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <FaLock className="text-blue-500" /> Add New Credentials
      </h2>
      
      {/* Updated Layout Classes here */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        
        <div className="flex-1 min-w-full md:min-w-[200px]">
             <PlatformSelect 
                value={form.platform} 
                onChange={(val) => setForm({ ...form, platform: val })} 
             />
        </div>

        <input
          type="text"
          placeholder="Username / Email"
          className="flex-1 w-full bg-gray-950 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Password"
          className="flex-1 w-full bg-gray-950 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 min-w-[100px]"
        >
          {loading ? "..." : <><FaPlus /> Add</>}
        </button>
      </form>
    </motion.div>
  );
};

export default AddAccountForm;