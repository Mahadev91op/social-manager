import React, { useState, useRef, useEffect } from "react";
import { platformsList } from "../utils/platformsList";
import { getBrandStyle } from "../utils/getBrandStyle"; // Icon lane ke liye
import { FaChevronDown, FaSearch, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PlatformSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0); // Keyboard nav ke liye
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredPlatforms = platformsList.filter((platform) =>
    platform.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (platform) => {
    setQuery(platform);
    onChange(platform);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  // Keyboard Navigation Logic (Pro Feature)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredPlatforms.length - 1 ? prev + 1 : prev
      );
      // Auto scroll
      if(listRef.current) listRef.current.scrollTop += 40;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      if(listRef.current) listRef.current.scrollTop -= 40;
    } else if (e.key === "Enter" && isOpen) {
      e.preventDefault();
      if (filteredPlatforms[highlightedIndex]) {
        handleSelect(filteredPlatforms[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Current selected style for Icon preview in input
  const currentStyle = getBrandStyle(query);

  return (
    <div className="relative w-full group" ref={wrapperRef}>
      {/* Input Box Area */}
      <div className="relative flex items-center">
        {/* Left Icon (Jo type kiya uska icon dikhega) */}
        <div className="absolute left-4 z-10 text-lg pointer-events-none">
            {query ? <span className={currentStyle.color}>{currentStyle.icon}</span> : <FaSearch className="text-gray-600"/>}
        </div>

        <input
          type="text"
          placeholder="Select Platform..."
          className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 pl-12 pr-10 py-3.5 rounded-xl shadow-inner focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 font-medium"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        
        {/* Right Arrow Icon */}
        <div className={`absolute right-4 text-gray-500 transition-transform duration-300 pointer-events-none ${isOpen ? "rotate-180" : ""}`}>
          <FaChevronDown size={12} />
        </div>
      </div>

      {/* Dropdown List (Premium Glass Look) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[60] w-full mt-2 bg-[#0F0F0F]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div 
                ref={listRef}
                className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-1"
            >
              {filteredPlatforms.length > 0 ? (
                filteredPlatforms.map((platform, index) => {
                  // Har item ke liye uska icon nikalo
                  const brandStyle = getBrandStyle(platform);
                  const isActive = index === highlightedIndex;
                  const isSelected = platform === query;

                  return (
                    <div
                      key={index}
                      onClick={() => handleSelect(platform)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 border border-transparent
                        ${isActive ? "bg-white/10 border-white/5" : "hover:bg-white/5 text-gray-400"}
                        ${isSelected ? "bg-blue-600/20 !border-blue-500/50" : ""}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Brand Icon Box */}
                        <div className={`p-2 rounded-md bg-[#000] border border-white/5 shadow-sm ${brandStyle.color} text-lg`}>
                            {brandStyle.icon}
                        </div>
                        
                        {/* Brand Name */}
                        <span className={`font-medium ${isActive || isSelected ? "text-white" : "text-gray-400"}`}>
                            {platform}
                        </span>
                      </div>

                      {/* Checkmark if selected */}
                      {isSelected && <FaCheck className="text-blue-500 text-xs" />}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p className="text-sm">No platform found.</p>
                  <p className="text-xs mt-1 text-gray-600">Press Enter to use "<span className="text-blue-400">{query}</span>"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlatformSelect;