import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiBriefcase, FiEdit2, FiTrash2, FiSearch, FiCreditCard, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';

const BankPage = ({ onBack }) => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form states
    const [newBankName, setNewBankName] = useState('');
    const [newAccNumber, setNewAccNumber] = useState('');
    const [newBalance, setNewBalance] = useState('');
    const [updateBalanceAmount, setUpdateBalanceAmount] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/accounts?service=bank');
            if (Array.isArray(data)) {
                setAccounts(data);
            } else {
                setAccounts([]);
            }
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            toast.error('ব্যাংক অ্যাকাউন্ট তথ্য লোড করতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    const totalBalance = Array.isArray(accounts)
        ? accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0)
        : 0;

    if (!Array.isArray(accounts) && accounts !== undefined) {
        console.error('Bank accounts is not an array:', accounts);
    }

    const filteredAccounts = accounts.filter(acc =>
        (acc.accountName && acc.accountName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (acc.accountNumber && acc.accountNumber.includes(searchQuery))
    );

    const handleAddAccount = async () => {
        if (!newBankName || !newAccNumber || !newBalance) return;
        try {
            setIsSubmitting(true);
            const { data } = await API.post('/accounts', {
                serviceType: 'bank', // Standardized field name
                accountName: newBankName,
                accountNumber: newAccNumber,
                balance: parseFloat(newBalance)
            });
            if (Array.isArray(data)) {
                setAccounts(data);
            }
            toast.success('অ্যাকাউন্ট সফলভাবে যোগ করা হয়েছে।');
            setNewBankName('');
            setNewAccNumber('');
            setNewBalance('');
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding bank account:', error);
            toast.error('অ্যাকাউন্ট যোগ করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBalance = async (id) => {
        const amount = parseFloat(updateBalanceAmount);
        if (isNaN(amount)) return;

        try {
            setIsSubmitting(true);
            const { data } = await API.put(`/accounts/${id}`, { balance: amount });
            if (Array.isArray(data)) {
                setAccounts(data);
            }
            toast.success('ব্যালেন্স আপডেট করা হয়েছে।');
            setUpdateBalanceAmount('');
            setShowUpdateModal(null);
        } catch (error) {
            console.error('Error updating bank balance:', error);
            toast.error('আপডেট করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async (id) => {
        if (window.confirm('এই ব্যাংক অ্যাকাউন্টটি মুছে ফেলতে চান?')) {
            try {
                setIsLoading(true);
                const { data } = await API.delete(`/accounts/${id}`);
                if (Array.isArray(data)) {
                    setAccounts(data);
                }
                toast.success('অ্যাকাউন্ট মুছে ফেলা হয়েছে।');
            } catch (error) {
                console.error('Error deleting bank account:', error);
                toast.error('মুছে ফেলতে সমস্যা হয়েছে।');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans text-left">
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
                    ব্যাংক অ্যাকাউন্ট ম্যানেজমেন্ট
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-5 w-full max-w-md mx-auto mt-14">

                {/* Total Balance Dashboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#1e3a8a] to-[#1e1b4b] rounded-[24px] sm:rounded-3xl p-6 shadow-xl relative overflow-hidden text-white border border-white/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <div className="relative z-10 text-center py-2">
                        <p className="text-blue-200 text-sm font-medium mb-1 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            মোট ব্যাংক ব্যালেন্স
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight my-2">
                            <span className="text-2xl sm:text-3xl opacity-80 mr-1">৳</span>
                            {totalBalance.toLocaleString()}
                        </h2>
                        <div className="mt-3 inline-block px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 text-xs font-semibold">
                            {Array.isArray(accounts) ? accounts.length : 0} টি অ্যাকাউন্ট
                        </div>
                    </div>
                </motion.div>

                {/* Search and Add Action */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="ব্যাংক বা অ্যাকাউন্ট খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#1f1f23] border border-gray-100 dark:border-gray-800 focus:border-blue-500 outline-none text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center border border-blue-500/50"
                    >
                        <FiPlus size={24} />
                    </button>
                </div>

                {/* Account List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <FiLoader className="text-blue-500 animate-spin" size={40} />
                            <p className="text-gray-400 font-medium">লোড হচ্ছে...</p>
                        </div>
                    ) : (
                        <>
                            {Array.isArray(filteredAccounts) && filteredAccounts.map((acc, index) => (
                                <motion.div
                                    key={acc._id || index}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-[#1f1f23] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden relative group"
                                >
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                                                <FiBriefcase size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{acc.accountName}</h4>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono tracking-wider">{acc.accountNumber}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-blue-600 dark:text-blue-500">৳ {acc.balance.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-5 mt-4 border-t border-gray-50 dark:border-gray-800/50 relative z-10">
                                        <button
                                            onClick={() => setShowUpdateModal(acc)}
                                            className="flex-2 py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all active:scale-[0.98] border border-blue-100 dark:border-blue-800/20"
                                        >
                                            <FiCreditCard size={14} /> ব্যালেন্স আপডেট
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAccount(acc._id)}
                                            className="flex-1 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 border border-red-100 dark:border-red-900/20"
                                        >
                                            <FiTrash2 size={16} className="mx-auto" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {filteredAccounts.length === 0 && (
                                <div className="py-12 text-center bg-white dark:bg-[#1f1f23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <p className="text-gray-400 italic">কোন অ্যাকাউন্ট পাওয়া যায়নি</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">নতুন ব্যাংক অ্যাকাউন্ট</h3>
                            <div className="space-y-4">
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ব্যাংকের নাম</label>
                                    <input
                                        type="text"
                                        value={newBankName}
                                        onChange={(e) => setNewBankName(e.target.value)}
                                        placeholder="ব্যাংকের নাম লিখুন"
                                        className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">অ্যাকাউন্ট নম্বর</label>
                                    <input
                                        type="text"
                                        value={newAccNumber}
                                        onChange={(e) => setNewAccNumber(e.target.value)}
                                        placeholder="000 000 000"
                                        className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 text-gray-900 dark:text-white font-mono transition-all"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">শুরু ব্যালেন্স</label>
                                    <input
                                        type="number"
                                        value={newBalance}
                                        onChange={(e) => setNewBalance(e.target.value)}
                                        placeholder="৳ 0"
                                        className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 text-gray-900 dark:text-white font-mono font-bold transition-all text-xl"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300">বাতিল</button>
                                    <button
                                        onClick={handleAddAccount}
                                        disabled={isSubmitting || !newBankName || !newAccNumber || !newBalance}
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'অ্যাড করুন'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Update Balance Modal */}
            <AnimatePresence>
                {showUpdateModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                            onClick={() => setShowUpdateModal(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">ব্যালেন্স আপডেট</h3>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6">{showUpdateModal.bankName}</p>

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">বর্তমান ব্যালেন্স</span>
                                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300">৳ {showUpdateModal.balance.toLocaleString()}</span>
                                </div>

                                <div className="text-left">
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider text-center">আজকের ব্যালেন্স (নতুন পরিমাণ লিখুন)</label>
                                    <input
                                        type="number"
                                        value={updateBalanceAmount}
                                        onChange={(e) => setUpdateBalanceAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-5 py-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 text-gray-900 dark:text-white font-mono text-3xl text-center font-bold transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setShowUpdateModal(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300">বাতিল</button>
                                    <button
                                        onClick={() => handleUpdateBalance(showUpdateModal._id)}
                                        disabled={!updateBalanceAmount || parseFloat(updateBalanceAmount) === 0 || isSubmitting}
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'আপডেট করুন'}
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

export default BankPage;
