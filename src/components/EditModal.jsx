import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaLock } from 'react-icons/fa';
import PlatformSelect from './PlatformSelect';

const EditModal = ({ account, isOpen, onClose, onUpdate }) => {
  const [form, setForm] = useState({ platform: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Jab modal khule, to purana data form me bhar do
  useEffect(() => {
    if (account) {
      setForm({
        platform: account.platform,
        username: account.username,
        password: account.password // Yeh decrypted password hi aayega prop se
      });
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Platform name ko format karo
    const cleanPlatform = form.platform.trim().charAt(0).toUpperCase() + form.platform.trim().slice(1).toLowerCase();
    
    await onUpdate(account._id, { ...form, platform: cleanPlatform });
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#111] border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FaLock className="text-blue-500" /> Edit Credentials
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <div>
  <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Platform</label>
  <div className="mt-1">
      <PlatformSelect 
        value={form.platform} 
        onChange={(val) => setForm({ ...form, platform: val })}
      />
  </div>
</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Username / Email</label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition mt-1"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Password</label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition mt-1 font-mono"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? "Updating..." : <><FaSave /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditModal;