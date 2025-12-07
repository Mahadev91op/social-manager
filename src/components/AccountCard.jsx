import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTrash, FaCopy, FaPen } from 'react-icons/fa';
import { getBrandStyle } from '../utils/getBrandStyle';
import toast from 'react-hot-toast';

const AccountCard = ({ account, onDelete, onEdit }) => {
  const [showPass, setShowPass] = useState(false);
  const style = getBrandStyle(account.platform);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Password Copied!");
  };

  return (
    <motion.div
      // 1. LAYOUT PROP: Ye magic hai. Ye card ko smooth move karata hai.
      layout
      
      // 2. ANIMATION: Smooth entry and exit
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      
      // 3. PHYSICS: Soft Spring (Jhatka nahi lagega)
      transition={{ 
        layout: { type: "spring", stiffness: 100, damping: 15 }, // Movement ke liye
        opacity: { duration: 0.2 } // Gayab hone ke liye
      }}
      
      className={`relative p-5 rounded-2xl border ${style.border} ${style.bg} hover:border-opacity-50 transition-colors duration-300 group`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-2xl ${style.color} p-2 bg-black/20 rounded-lg`}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-200 capitalize truncate">{account.platform}</h3>
          <p className="text-xs text-gray-400 truncate">{account.username}</p>
        </div>
        
        {/* Edit Button */}
        <button 
            onClick={() => onEdit(account)}
            className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
            title="Edit Details"
        >
            <FaPen size={12} />
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-black/40 p-3 rounded-lg flex justify-between items-center border border-white/5">
        <div className="font-mono text-sm text-gray-300 overflow-hidden text-ellipsis w-32">
          {showPass ? account.password : "••••••••••••••"}
        </div>
        
        <div className="flex gap-2 shrink-0">
           <button onClick={() => copyToClipboard(account.password)} className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-green-400 transition">
            <FaCopy />
           </button>
          <button onClick={() => setShowPass(!showPass)} className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition">
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Delete Button (Hover pe dikhega) */}
      <button 
        onClick={() => onDelete(account._id)}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1.5 rounded-full shadow-lg transition-all scale-75 hover:scale-100"
        title="Delete Account"
      >
        <FaTrash size={10} />
      </button>
    </motion.div>
  );
};

export default AccountCard;