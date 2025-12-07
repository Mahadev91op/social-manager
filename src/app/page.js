"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSearch, FaBars, FaLock } from "react-icons/fa";

// Components Import
import Sidebar from "@/components/Sidebar";
import AddAccountForm from "@/components/AddAccountForm";
import AccountCard from "@/components/AccountCard";
import EditModal from "@/components/EditModal";
import PinLock from "@/components/PinLock";

export default function Home() {
  // --- UI STATES ---
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // --- EDIT STATES ---
  const [editingAccount, setEditingAccount] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- SECURITY STATES ---
  const [isLocked, setIsLocked] = useState(true); // Default Locked
  const [masterPin, setMasterPin] = useState("");

  // 1. Session Check (Refresh karne par baar-baar PIN na mange)
  useEffect(() => {
    const savedPin = sessionStorage.getItem("vault_pin");
    if (savedPin) {
      setMasterPin(savedPin);
      setIsLocked(false);
    }
  }, []);

  // 2. Auto-Lock System (2 Minutes Inactivity)
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (isLocked) return;
      clearTimeout(timer);
      // 2 Minutes = 120000 ms
      timer = setTimeout(() => {
        toast.error("Auto-locked due to inactivity");
        handleLock();
      }, 120000); 
    };

    // Events to detect user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // Start timer

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [isLocked]);

  // 3. Fetch Accounts (Jab Unlock ho jaye)
  useEffect(() => {
    if (!isLocked && masterPin) {
      fetchAccounts();
    }
  }, [isLocked, masterPin]);

  // --- API CALLS ---
  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/api/accounts", {
        headers: { "x-vault-pin": masterPin }
      });
      setAccounts(res.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired or Wrong PIN");
        handleLock();
      }
    }
  };

  // --- SECURITY HANDLERS ---
  const handleUnlock = async (pin, onErrorCallback) => {
    try {
      // Dummy request to verify PIN
      await axios.get("/api/accounts", {
        headers: { "x-vault-pin": pin }
      });

      // Agar success hua:
      setMasterPin(pin);
      sessionStorage.setItem("vault_pin", pin);
      setIsLocked(false);
      toast.success("Vault Unlocked!");

    } catch (error) {
      // Agar fail hua (Wrong PIN):
      if (onErrorCallback) {
        onErrorCallback(); // Ye PinLock ke counter ko badha dega
      }
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem("vault_pin");
    setMasterPin("");
    setAccounts([]);
    setIsLocked(true);
  };

  // --- CRUD HANDLERS ---
  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      const cleanPlatform = formData.platform.trim().charAt(0).toUpperCase() + formData.platform.trim().slice(1).toLowerCase();
      
      await axios.post("/api/accounts", 
        { ...formData, platform: cleanPlatform }, 
        { headers: { "x-vault-pin": masterPin } }
      );
      toast.success("Account Added!");
      fetchAccounts();
      setIsFormOpen(false);
    } catch (e) { toast.error("Failed to add account"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    
    // Optimistic Update
    const oldAccounts = [...accounts];
    setAccounts(accounts.filter(acc => acc._id !== id));
    
    try {
      await axios.delete(`/api/accounts?id=${id}`, {
        headers: { "x-vault-pin": masterPin }
      });
      toast.success("Deleted!");
    } catch (error) {
      setAccounts(oldAccounts); // Revert
      toast.error("Failed to delete");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const updatedAccounts = accounts.map(acc => acc._id === id ? { ...acc, ...updatedData } : acc);
      setAccounts(updatedAccounts);
      
      await axios.put("/api/accounts", 
        { id, ...updatedData },
        { headers: { "x-vault-pin": masterPin } }
      );
      toast.success("Updated Successfully!");
      fetchAccounts();
    } catch (error) { 
      toast.error("Update Failed"); 
      fetchAccounts(); 
    }
  };

  // --- HELPER FUNCTIONS ---
  const openEditModal = (account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  // --- FILTER LOGIC ---
  const filteredAccounts = accounts.filter(acc => {
    const matchesCategory = selectedCategory === "All" ? true : acc.platform.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = acc.platform.toLowerCase().includes(searchTerm.toLowerCase()) || acc.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- MAIN RENDER ---

  // 1. Lock Screen
  if (isLocked) {
    return <PinLock onUnlock={handleUnlock} />;
  }

  // 2. Main Dashboard
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditModal 
            account={editingAccount} 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdate}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <Sidebar 
        accounts={accounts} 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory}
        onOpenModal={() => setIsFormOpen(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 h-screen overflow-y-auto relative w-full">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 sticky top-0 bg-[#050505]/90 backdrop-blur-md py-4 z-30 border-b border-gray-800 md:border-none gap-4">
            
            <div className="flex items-center gap-4 md:block">
                {/* Hamburger for Mobile */}
                <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-2 text-gray-300 hover:bg-gray-800 rounded-lg">
                    <FaBars size={24} />
                </button>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold truncate max-w-[200px] md:max-w-none">{selectedCategory}</h2>
                    <p className="text-gray-500 text-xs md:text-sm hidden md:block">Manage your passwords</p>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative w-full md:w-auto">
                    <FaSearch className="absolute left-3 top-3.5 text-gray-500"/>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full md:w-64 bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none transition"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Lock Button */}
                <button 
                    onClick={handleLock}
                    className="bg-gray-800 hover:bg-red-500/20 hover:text-red-500 text-gray-400 p-3 rounded-xl transition"
                    title="Lock Vault"
                >
                    <FaLock />
                </button>
            </div>
        </div>

        {/* ADD ACCOUNT FORM WRAPPER */}
        <AnimatePresence mode="popLayout">
            {isFormOpen && (
                <div className="mb-8">
                    <AddAccountForm 
                        onAdd={handleAdd} 
                        loading={loading} 
                        onClose={() => setIsFormOpen(false)} // Pass kiya onClose
                    />
                </div>
            )}
        </AnimatePresence>

        {/* ACCOUNTS GRID (Animated Layout) */}
        <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredAccounts.map((acc) => (
              <AccountCard 
                key={acc._id} 
                account={acc} 
                onDelete={handleDelete} 
                onEdit={openEditModal} 
              />
            ))}
          </AnimatePresence>

          {/* EMPTY STATE */}
          {filteredAccounts.length === 0 && (
            <motion.div 
                layout
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full py-10 md:py-20 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl mx-2"
            >
              <p className="text-center">No accounts found in {selectedCategory}.</p>
              <button onClick={() => setIsFormOpen(true)} className="mt-4 text-blue-500 hover:underline">
                Add Account
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}