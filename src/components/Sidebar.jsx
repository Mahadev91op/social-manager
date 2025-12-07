import React from 'react';
import { getBrandStyle } from '../utils/getBrandStyle';
import { FaLayerGroup, FaPlus, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ accounts, selectedCategory, onSelectCategory, onOpenModal, isOpen, onClose }) => {
  
  const groups = accounts.reduce((acc, item) => {
    const platformName = item.platform.trim().charAt(0).toUpperCase() + item.platform.trim().slice(1).toLowerCase();
    if (!acc[platformName]) acc[platformName] = 0;
    acc[platformName]++;
    return acc;
  }, {});
  const platforms = Object.keys(groups);

  // Common content for Sidebar
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            DevSamp
            </h1>
            <p className="text-xs text-gray-500 mt-1">Password Vault</p>
        </div>
        {/* Close Button (Only visible on Mobile) */}
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-2">
            <FaTimes size={20} />
        </button>
      </div>

      <div className="p-4">
        <button 
          onClick={() => { onOpenModal(); onClose(); }} // Mobile me click karke sidebar band kar do
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition shadow-lg shadow-blue-900/20"
        >
          <FaPlus /> New Account
        </button>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => { onSelectCategory("All"); onClose(); }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            selectedCategory === "All" 
              ? "bg-gray-800 text-white border border-gray-700" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <FaLayerGroup /> <span>All Accounts</span>
          </div>
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
            {accounts.length}
          </span>
        </button>

        <div className="my-4 border-t border-gray-800 mx-2"></div>
        <p className="px-4 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Groups</p>

        {platforms.map((platform) => {
            const style = getBrandStyle(platform);
            return (
              <button
                key={platform}
                onClick={() => { onSelectCategory(platform); onClose(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  selectedCategory === platform 
                    ? `bg-gray-800 text-white border border-gray-700` 
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={selectedCategory === platform ? style.color : "text-gray-500"}>
                    {style.icon}
                  </span>
                  <span>{platform}</span>
                </div>
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400 border border-gray-700">
                  {groups[platform]}
                </span>
              </button>
            );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Static) */}
      <aside className="hidden md:flex w-64 bg-[#111] border-r border-gray-800 h-screen flex-col fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE SIDEBAR (Overlay + Slide in) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (Kala Parda) */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 z-[60] md:hidden backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-[#111] border-r border-gray-800 z-[70] md:hidden flex flex-col h-full shadow-2xl"
            >
                <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;