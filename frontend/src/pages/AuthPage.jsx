import React, { useState } from 'react';
import { FiUser, FiPhone, FiLock, FiArrowRight, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';

const AuthPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { data } = await API.post('/auth/login', { phone, password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                onLoginSuccess(data);
            } else {
                const { data } = await API.post('/auth/register', { name, phone, password });
                toast.success('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -ml-32 -mt-32 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full -mr-40 -mb-40 blur-3xl animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-2xl relative z-10"
            >
                {/* Branding / Logo Area */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4"
                    >
                        <span className="text-3xl font-black text-white italic">RS</span>
                    </motion.div>
                    <h1 className="text-2xl font-black text-white tracking-tight">রাশেদ স্টোর</h1>
                    <p className="text-indigo-200/60 text-sm mt-1">আপনার বিশ্বস্ত ডিজিটাল হিসাবঘর</p>
                </div>

                {/* Form Toggle Tabs */}
                <div className="flex bg-black/30 p-1.5 rounded-2xl mb-8 border border-white/5">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        লগইন
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        রেজিস্ট্রেশন
                    </button>
                </div>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2 mb-2"
                        >
                            <FiAlertCircle size={16} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                key="name-field"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="relative group"
                            >
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="আপনার পুরো নাম"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-500"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="tel"
                            required
                            placeholder="মোবাইল নম্বর"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-500"
                        />
                    </div>

                    <div className="relative group">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="পাসওয়ার্ড"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-4 font-bold text-lg shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>{isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
                                <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-8 font-medium">
                    {isLogin ? 'আপনি কি নতুন?' : 'ইতিমধ্যেই অ্যাকাউন্ট আছে?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-400 ml-1.5 font-bold hover:underline"
                    >
                        {isLogin ? 'রেজিস্ট্রেশন করুন' : 'লগইন করুন'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default AuthPage;
