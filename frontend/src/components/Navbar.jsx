import React, { useState } from 'react';
import { FiSearch, FiGrid, FiChevronRight, FiSun, FiMoon, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';

const Navbar = () => {
    const [isDark, setIsDark] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        const themeStr = newTheme ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', themeStr);
        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <>
            <div className="h-[70px] w-full" /> {/* Spacer for fixed navbar */}
            <nav
                className="fixed top-0 left-0 right-0 w-full min-h-[70px] bg-gradient-to-r from-[#4a001a] to-[#1a0033] px-4 sm:pl-10 sm:pr-20 flex items-center transition-all duration-500 z-50 rounded-b-[15px] shadow-lg"
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                <div className="w-full flex items-center justify-between">
                    {/* Left: Avatar & Website Name */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full border border-white/20 p-0.5 overflow-hidden shadow-md">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="flex items-center gap-0.5 cursor-pointer group">
                            <span className="text-white font-bold text-lg tracking-tight group-hover:text-pink-400 transition-colors">
                                Rashed<span className="text-pink-500">Store</span>
                            </span>
                            <FiChevronRight size={14} className="text-white/60 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Right: Action Icons */}
                    <div className="flex items-center gap-4 sm:gap-7">
                        <button className="p-2 rounded-full !bg-transparent text-white hover:bg-white/10 transition-all duration-200">
                            <FiSearch size={18} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full !bg-transparent text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-full transition-all duration-200 ${isMenuOpen ? 'bg-pink-600 text-white shadow-lg' : '!bg-transparent text-white hover:bg-white/10'}`}
                        >
                            {isMenuOpen ? <FiX size={19} /> : <FiGrid size={19} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-[70px] left-1/2 -translate-x-1/2 w-[95%] max-w-[460px] bg-[#1a0033]/95 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-2xl z-40 overflow-hidden"
                    >
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {CATEGORIES.map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer group transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white/5 p-1">
                                        {cat.image ? (
                                            <img src={cat.image} alt={cat.label} className="w-full h-full object-contain" />
                                        ) : (
                                            <cat.fallbackIcon className="text-white/60" size={16} />
                                        )}
                                    </div>
                                    <span className="text-white font-medium text-sm group-hover:text-pink-400 transition-colors">
                                        {cat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="bg-white/5 p-3 border-t border-white/5 text-center">
                            <span className="text-white/40 text-[11px] font-medium tracking-widest uppercase">
                                Rashed Store Menu
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;
