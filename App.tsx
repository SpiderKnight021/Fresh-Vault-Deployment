
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from './store';
import { AuthScreen } from './components/Auth';
import { FarmerDashboard } from './components/FarmerDashboard';
import { RetailerDashboard } from './components/RetailerDashboard';
import { ServiceDashboard } from './components/ServiceDashboard';
import { UserRole } from './types';
import { LogOut, Leaf, ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Account Dropdown Component
const AccountDropdown = () => {
  const { userProfile, currentUserRole, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = userProfile?.name || (currentUserRole === UserRole.FARMER ? 'John Doe' : 'FreshMart Manager');
  const roleDisplay = currentUserRole ? (currentUserRole.charAt(0) + currentUserRole.slice(1).toLowerCase()) : 'User';
  const location = userProfile?.district || 'Kerala';
  const contact = userProfile?.email || userProfile?.phone || 'user@freshvault.com';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 md:gap-3 p-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
      >
        <div className="h-9 w-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
          {initials}
        </div>
        <div className="hidden md:block text-left mr-1">
            <p className="text-sm font-bold text-gray-800 leading-none">{displayName}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
              <p className="text-base font-bold text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">{roleDisplay}</p>
            </div>
            
            <div className="px-5 py-3 space-y-4">
               <div className="flex items-center gap-3 text-sm text-gray-700 min-h-[24px]">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <span>{location}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-700 min-h-[24px]">
                  {contact.includes('@') ? <Mail size={18} className="text-gray-400 shrink-0"/> : <Phone size={18} className="text-gray-400 shrink-0"/>}
                  <span className="truncate">{contact}</span>
               </div>
            </div>

            <div className="border-t border-gray-50 mt-2 pt-2">
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full text-left px-5 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const { isAuthenticated, currentUserRole } = useStore();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Service App has its own dedicated layout - UNTOUCHED
  if (currentUserRole === UserRole.SERVICE) {
    return <ServiceDashboard />;
  }

  // Farmer & Retailer Layout (No Sidebar, Top Nav with Account Dropdown)
  return (
    <div className="min-h-screen bg-neutral flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Leaf size={20} strokeWidth={3} />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900 tracking-tight">FreshVault</span>
          </div>

          {/* Account Dropdown */}
          <AccountDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {currentUserRole === UserRole.FARMER && <FarmerDashboard />}
        {currentUserRole === UserRole.RETAILER && <RetailerDashboard />}
      </main>
    </div>
  );
}
