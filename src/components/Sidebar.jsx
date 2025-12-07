import React from 'react';
import { getBrandStyle } from '../utils/getBrandStyle';
import { FaLayerGroup, FaPlus, FaTimes, FaDownload } from 'react-icons/fa'; // FaDownload added
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ accounts, selectedCategory, onSelectCategory, onOpenModal, isOpen, onClose }) => {
  
  // 1. Group Logic (Platform ke hisab se count nikalna)
  const groups = accounts.reduce((acc, item) => {
    const platformName = item.platform.trim().charAt(0).toUpperCase() + item.platform.trim().slice(1).toLowerCase();
    if (!acc[platformName]) acc[platformName] = 0;
    acc[platformName]++;
    return acc;
  }, {});
  const platforms = Object.keys(groups);

  // 2. Export to CSV Function
  const handleExport = () => {
    if (accounts.length === 0) {
        alert("No passwords to export!");
        return;
    }
    
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,Platform,Username,Password,Updated At\n";
    
    // CSV Rows
    accounts.forEach(acc => {
        const cleanDate = new Date(acc.updatedAt).toLocaleDateString();
        // Commas ko handle karne ke liye data ko quotes me rakhna behtar hai
        csvContent += `"${acc.platform}","${acc.username}","${acc.password}","${cleanDate}"\n`;
    });

    // Download Link Create karna
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DevSamp_Vault_Backup_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- COMMON SIDEBAR CONTENT (Desktop + Mobile) ---
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
        <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            DevSamp
            </h1>
            <p className="text-xs text-gray-500 mt-1">Password Vault</p>
        </div>
        {/* Close Button (Only for Mobile) */}
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-2">
            <FaTimes size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        {/* Add Account Button */}
        <button 
          onClick={() => { onOpenModal(); onClose(); }} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition shadow-lg shadow-blue-900/20"
        >
          <FaPlus /> New Account
        </button>

        {/* Export Backup Button */}
        <button 
          onClick={handleExport}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition border border-gray-700"
        >
          <FaDownload size={14} /> Backup Data
        </button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        
        {/* 'All Accounts' Tab */}
        <button
          onClick={() => { onSelectCategory("All"); onClose(); }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            selectedCategory === "All" 
              ? "bg-gray-800 text-white border border-gray-700 shadow-md" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <FaLayerGroup /> <span>All Accounts</span>
          </div>
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300 border border-gray-600">
            {accounts.length}
          </span>
        </button>

        <div className="my-4 border-t border-gray-800 mx-2"></div>
        <p className="px-4 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Groups</p>

        {/* Dynamic Platform List */}
        {platforms.map((platform) => {
            const style = getBrandStyle(platform);
            return (
              <button
                key={platform}
                onClick={() => { onSelectCategory(platform); onClose(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  selectedCategory === platform 
                    ? `bg-gray-800 text-white border border-gray-700 shadow-md` 
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={selectedCategory === platform ? style.color : "text-gray-500"}>
                    {style.icon}
                  </span>
                  <span className="truncate max-w-[120px] text-left">{platform}</span>
                </div>
                <span className="text-xs bg-gray-900 px-2 py-0.5 rounded-full text-gray-400 border border-gray-800 min-w-[24px] text-center">
                  {groups[platform]}
                </span>
              </button>
            );
        })}
      </div>

      {/* Footer (Optional) */}
      <div className="p-4 border-t border-gray-800 text-center">
        <p className="text-[10px] text-gray-600">DevSamp Secure System v1.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Always Visible) */}
      <aside className="hidden md:flex w-64 bg-[#0a0a0a] border-r border-gray-800 h-screen flex-col fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE SIDEBAR (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (Click outside to close) */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 z-[60] md:hidden backdrop-blur-sm"
            />
            {/* Sliding Drawer */}
            <motion.div 
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} 
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-[#0a0a0a] border-r border-gray-800 z-[70] md:hidden h-full shadow-2xl"
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