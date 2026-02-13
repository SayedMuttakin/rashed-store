import { useState, useEffect } from 'react';
import { FiSearch, FiGrid, FiChevronRight, FiSun, FiMoon, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';

const Navbar = ({ onLogout }) => {
    const [isDark, setIsDark] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [settings, setSettings] = useState({ headerLogoUrl: '/app-logo/logo.png', appName: 'Rashed Store' });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/settings');
            if (data) setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleLogoClick = () => {
        document.getElementById('logo-upload').click();
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setIsUploading(true);
            // Assuming we have a general image upload endpoint or using a helper
            // For now, let's pretend we have an endpoint that returns the URL
            // Or we convert it to base64 for simplicity in this demo if no storage is setup
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                try {
                    const { data } = await API.post('/settings', { headerLogoUrl: base64String });
                    setSettings(data);
                    toast.success('লোগো আপডেট করা হয়েছে।');
                } catch (err) {
                    toast.error('আপডেট করতে সমস্যা হয়েছে।');
                } finally {
                    setIsUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('আপলোড করতে সমস্যা হয়েছে।');
            setIsUploading(false);
        }
    };

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
            <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
            />
            <div className="h-[70px] w-full" /> {/* Spacer for fixed navbar */}
            <nav
                className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[var(--mobile-width)] min-h-[70px] bg-gradient-to-r from-[#4a001a] to-[#1a0033] px-4 flex items-center transition-all duration-500 z-50 rounded-b-[15px] shadow-lg"
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                <div className="w-full flex items-center justify-between">
                    {/* Left: Avatar & Website Name */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-md flex items-center justify-center bg-white/5 cursor-pointer relative group"
                            onClick={handleLogoClick}
                            title="Click to change logo"
                        >
                            <img
                                src={settings.headerLogoUrl}
                                alt="Logo"
                                className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold">Edit</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 cursor-pointer group">
                            <span className="text-white font-bold text-lg tracking-tight group-hover:text-pink-400 transition-colors">
                                {settings.appName.split(' ')[0]}<span className="text-pink-500">{settings.appName.split(' ')[1] || ''}</span>
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
                        <div className="bg-white/5 p-4 border-t border-white/5 flex flex-col gap-3">
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all font-bold text-sm border border-red-500/20"
                            >
                                <FiLogOut size={16} /> লগআউট করুন
                            </button>
                            <div className="text-center">
                                <span className="text-white/40 text-[11px] font-medium tracking-widest uppercase">
                                    Rashed Store Menu
                                </span>
                            </div>
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
