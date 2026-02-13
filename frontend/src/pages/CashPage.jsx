import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiTrendingUp, FiTrendingDown, FiClock, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';

const CashPage = ({ onBack }) => {
    const [cashBalance, setCashBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newBalanceInput, setNewBalanceInput] = useState('');

    useEffect(() => {
        fetchCashData();
    }, []);

    const fetchCashData = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/cash');
            setCashBalance(data.currentBalance || 0);
            setHistory(Array.isArray(data.history) ? data.history : []);
        } catch (error) {
            console.error('Error fetching cash data:', error);
            toast.error('ক্যাশ ডাটা লোড করতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateBalance = async () => {
        const newBalance = parseFloat(newBalanceInput);
        if (isNaN(newBalance)) return;

        try {
            setIsUpdating(true);
            const { data } = await API.post('/cash', {
                newBalance,
                date: new Date().toISOString().split('T')[0]
            });
            setCashBalance(data.currentBalance || 0);
            setHistory(Array.isArray(data.history) ? data.history : []);
            setNewBalanceInput('');
            setShowUpdateModal(false);
            toast.success('ক্যাশ ব্যালেন্স সফলভাবে আপডেট করা হয়েছে।');
        } catch (error) {
            console.error('Error updating cash balance:', error);
            toast.error(error.response?.data?.message || 'আপডেট করতে সমস্যা হয়েছে।');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="w-full min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Header */}
            <div
                className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1f1f23]/80 px-4 sm:px-5 py-2 flex items-center justify-between z-20 shadow-sm dark:shadow-xl backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 max-w-[480px] mx-auto"
                style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
            >
                <button
                    onClick={onBack}
                    className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all active:scale-95 border border-gray-200 dark:border-white/5"
                >
                    <FiArrowLeft size={20} />
                </button>
                <span className="text-gray-900 dark:text-white font-bold text-lg tracking-wide">
                    ক্যাশ ম্যানেজমেন্ট
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-5 w-full max-w-md mx-auto mt-14">

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <FiLoader className="text-emerald-500 animate-spin" size={40} />
                        <p className="text-gray-400 font-medium">লোড হচ্ছে...</p>
                    </div>
                ) : (
                    <>
                        {/* Dashboard Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-[#059669] to-[#064e3b] rounded-[24px] sm:rounded-3xl p-6 shadow-xl relative overflow-hidden text-white"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                            <div className="relative z-10 text-center py-2">
                                <p className="text-emerald-100 text-sm font-medium mb-1 flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    বর্তমান ক্যাশ ব্যালেন্স
                                </p>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight my-2">
                                    <span className="text-2xl sm:text-3xl opacity-80 mr-1">৳</span>
                                    {cashBalance.toLocaleString()}
                                </h2>
                            </div>
                        </motion.div>

                        {/* Update Button */}
                        <button
                            onClick={() => setShowUpdateModal(true)}
                            className="w-full bg-white dark:bg-[#1f1f23] rounded-2xl p-4 flex items-center justify-center gap-3 border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group shadow-sm active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FiPlus className="text-emerald-600 dark:text-emerald-400" size={20} />
                            </div>
                            <span className="text-gray-700 dark:text-gray-200 font-bold text-sm">নতুন ক্যাশ এন্ট্রি করুন</span>
                        </button>

                        {/* History Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">সাম্প্রতিক লেনদেন</h3>
                            {Array.isArray(history) && history.map((entry, index) => (
                                <motion.div
                                    key={entry._id || entry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-[#1f1f23] rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                            {entry.type === 'credit' ? <FiTrendingUp size={20} /> : <FiTrendingDown size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-mono">{entry.date}</p>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                                {entry.type === 'credit' ? 'ক্যাশ জমা' : 'ক্যাশ খরচ'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${entry.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {entry.type === 'credit' ? '+' : ''}৳ {entry.change.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium">ব্য্যালেন্স: ৳ {entry.newBalance.toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {history.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 italic">এখনো কোন লেনদেন হয়নি</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Update Balance Modal */}
            <AnimatePresence>
                {showUpdateModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowUpdateModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 text-center tracking-tight">ক্যাশ আপডেট</h3>
                            <p className="text-sm text-gray-500 text-center mb-8">নতুন ক্যাশ ব্যালেন্সটি লিখুন</p>

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">পূর্বের ক্যাশ</p>
                                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">৳ {cashBalance.toLocaleString()}</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider text-center">নতুন ক্যাশ ব্যালেন্স</label>
                                    <input
                                        type="number"
                                        value={newBalanceInput}
                                        onChange={(e) => setNewBalanceInput(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white font-mono text-3xl text-center font-bold transition-all"
                                        autoFocus
                                    />
                                </div>

                                {newBalanceInput && (
                                    <div className="text-center animate-fade-in">
                                        <p className="text-xs text-gray-400 mb-1">পরিবর্তন</p>
                                        <p className={`text-xl font-bold ${parseFloat(newBalanceInput) - cashBalance > 0 ? 'text-emerald-500' : parseFloat(newBalanceInput) - cashBalance < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {parseFloat(newBalanceInput) - cashBalance > 0 ? '+' : ''}
                                            ৳ {(parseFloat(newBalanceInput) - cashBalance).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setShowUpdateModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">বাতিল</button>
                                    <button
                                        onClick={handleUpdateBalance}
                                        disabled={!newBalanceInput || parseFloat(newBalanceInput) === cashBalance || isUpdating}
                                        className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? <FiLoader className="animate-spin" size={20} /> : 'আপডেট করুন'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CashPage;
