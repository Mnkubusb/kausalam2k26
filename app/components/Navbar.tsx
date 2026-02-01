
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { type Page } from '../ClientApp';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', action: () => onNavigate('home'), active: currentPage === 'home' },
    { name: 'Events', action: () => onNavigate('events'), active: currentPage === 'events' || currentPage === 'event-details' },
    { name: 'Gallery', action: () => onNavigate('gallery'), active: currentPage === 'gallery' },
    { name: 'Team', action: () => onNavigate('team'), active: currentPage === 'team' },
    { name: 'Schedule', action: () => onNavigate('schedule'), active: currentPage === 'schedule' },
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 ${scrolled || currentPage !== 'home' ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/20">
              <img src="/logo.webp" alt="logo" className='w-full h-full object-contain' />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase font-space leading-none">Kaushalam 2026</span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-red-500 uppercase leading-tight">GEC Bilaspur</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item.name} 
                onClick={() => handleNavClick(item)}
                className={`text-sm font-bold transition-colors uppercase tracking-widest ${item.active ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                {item.name}
              </button>
            ))}
            <button className="px-6 py-2.5 bg-white text-black font-black rounded-xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 text-xs uppercase tracking-widest">
              Get Passes
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#050505] z-100 p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-16">
              <div className="flex flex-col">
                <span className="text-2xl font-black font-space">KAUSHALAM</span>
                <span className="text-xs font-bold tracking-widest text-red-500 uppercase">GEC Bilaspur</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {navItems.map((item, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`text-4xl font-black cursor-pointer font-space text-left transition-colors ${item.active ? 'text-red-500' : 'text-white/40 hover:text-red-500'}`}
                >
                  {item.name}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 py-6 bg-white text-black text-2xl font-black rounded-3xl"
              >
                Get Passes
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
