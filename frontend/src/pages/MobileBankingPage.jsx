import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';
import ConfirmModal from '../components/ConfirmModal';

const MobileBankingPage = ({ onBack, serviceType = 'bkash' }) => {
    // Theme Configuration based on serviceType
    const themes = {
        bkash: {
            gradient: 'from-[#e2136e] to-[#8f0c4a]',
            title: 'বিকাশ সার্ভিস',
            textTitle: 'বিকাশ',
            amountColor: 'from-pink-600 to-purple-600',
            buttonBg: 'bg-pink-50 dark:bg-pink-900/20',
            buttonText: 'text-pink-600 dark:text-pink-400',
            buttonHover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40',
            iconColor: 'text-pink-600 dark:text-pink-400',
            iconBg: 'bg-pink-100 dark:bg-pink-900/30',
            plusIcon: 'text-pink-600 dark:text-pink-400',
            borderColor: 'border-pink-500',
            ringColor: 'focus:ring-pink-500/20',
            actionBtn: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-pink-500/30',
            hoverBorder: 'hover:border-pink-500 dark:hover:border-pink-500',
            hoverBg: 'hover:bg-pink-50 dark:hover:bg-pink-900/10',
            inputFocus: 'focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
        },
        nagad: {
            gradient: 'from-[#ec1c24] to-[#f7941d]', // Nagad Red/Orange
            title: 'নগদ সার্ভিস',
            textTitle: 'নগদ',
            amountColor: 'from-orange-600 to-red-600',
            buttonBg: 'bg-orange-50 dark:bg-orange-900/20',
            buttonText: 'text-orange-600 dark:text-orange-400',
            buttonHover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40',
            iconColor: 'text-orange-600 dark:text-orange-400',
            iconBg: 'bg-orange-100 dark:bg-orange-900/30',
            plusIcon: 'text-orange-600 dark:text-orange-400',
            borderColor: 'border-orange-500',
            ringColor: 'focus:ring-orange-500/20',
            actionBtn: 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/30',
            hoverBorder: 'hover:border-orange-500 dark:hover:border-orange-500',
            hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10',
            inputFocus: 'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
        },
        rocket: {
            gradient: 'from-[#8c27b0] to-[#4a148c]', // Rocket Purple
            title: 'রকেট সার্ভিস',
            textTitle: 'রকেট',
            amountColor: 'from-purple-600 to-indigo-600',
            buttonBg: 'bg-purple-50 dark:bg-purple-900/20',
            buttonText: 'text-purple-600 dark:text-purple-400',
            buttonHover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-100 dark:bg-purple-900/30',
            plusIcon: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-500',
            ringColor: 'focus:ring-purple-500/20',
            actionBtn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/30',
            hoverBorder: 'hover:border-purple-500 dark:hover:border-purple-500',
            hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/10',
            inputFocus: 'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
        },
        upay: {
            gradient: 'from-[#ffc107] to-[#f57f17]', // Upay Yellow/Amber
            title: 'উপায় সার্ভিস',
            textTitle: 'উপায়',
            amountColor: 'from-yellow-600 to-orange-600',
            buttonBg: 'bg-yellow-50 dark:bg-yellow-900/20',
            buttonText: 'text-yellow-700 dark:text-yellow-400',
            buttonHover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            plusIcon: 'text-yellow-600 dark:text-yellow-400',
            borderColor: 'border-yellow-500',
            ringColor: 'focus:ring-yellow-500/20',
            actionBtn: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-yellow-500/30 text-white',
            hoverBorder: 'hover:border-yellow-500 dark:hover:border-yellow-500',
            hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/10',
            inputFocus: 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20'
        }
    };

    const theme = themes[serviceType] || themes.bkash;

    // Accounts state
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAddAccount, setShowAddAccount] = useState(false);
    const [showAddTransaction, setShowAddTransaction] = useState(null);

    // Form states
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newAccountBalance, setNewAccountBalance] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');

    // Confirm Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        message: ''
    });

    useEffect(() => {
        fetchAccounts();
    }, [serviceType]);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get(`/accounts?service=${serviceType}`);
            if (Array.isArray(data)) {
                setAccounts(data);
            } else {
                console.error('Non-array data received for accounts:', data);
                setAccounts([]);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            toast.error('অ্যাকাউন্ট তথ্য লোড করতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total balance
    const totalBalance = Array.isArray(accounts)
        ? accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0)
        : 0;

    if (!Array.isArray(accounts) && accounts !== undefined) {
        console.error('Accounts is not an array:', accounts);
    }

    // Add new account
    const handleAddAccount = async () => {
        if (!newAccountNumber || !newAccountBalance) return;
        try {
            setIsSubmitting(true);
            const { data } = await API.post('/accounts', {
                serviceType: serviceType, // Corrected from service to serviceType
                accountNumber: newAccountNumber,
                balance: parseFloat(newAccountBalance)
            });
            if (Array.isArray(data)) {
                setAccounts(data);
            }
            toast.success('অ্যাকাউন্ট সফলভাবে যোগ করা হয়েছে।');
            setNewAccountNumber('');
            setNewAccountBalance('');
            setShowAddAccount(false);
        } catch (error) {
            console.error('Error adding account:', error);
            toast.error('অ্যাকাউন্ট যোগ করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add transaction logic
    const handleUpdateBalance = async (accountId) => {
        const amount = parseFloat(transactionAmount);
        if (isNaN(amount)) return;

        try {
            setIsSubmitting(true);
            const { data } = await API.put(`/accounts/${accountId}`, { newBalance: amount });
            if (Array.isArray(data)) {
                setAccounts(data);
            }
            toast.success('ব্যালেন্স আপডেট করা হয়েছে।');
            setShowAddTransaction(null);
            setTransactionAmount('');
        } catch (error) {
            console.error('Error updating balance:', error);
            toast.error('ব্যালেন্স আপডেট করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete account
    const handleDeleteAccount = async (accountId) => {
        setConfirmModal({
            isOpen: true,
            id: accountId,
            title: 'অ্যাকাউন্ট মুছুন',
            message: `আপনি কি নিশ্চিত যে এই ${theme.textTitle} অ্যাকাউন্টটি মুছে ফেলতে চান?`
        });
    };

    const confirmDelete = async () => {
        const accountId = confirmModal.id;
        try {
            setIsLoading(true);
            const { data } = await API.delete(`/accounts/${accountId}`);
            if (Array.isArray(data)) {
                setAccounts(data);
            }
            toast.success('অ্যাকাউন্ট মুছে ফেলা হয়েছে।');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('মুছে ফেলতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Minimal Header with Back Button - Theme Aware & Mobile-Safe */}
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
                    {theme.title}
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content Container */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-4 w-full max-w-md mx-auto mt-14">

                {/* Dashboard Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-gradient-to-br ${theme.gradient} rounded-[24px] sm:rounded-3xl p-5 shadow-xl relative overflow-hidden text-white`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <div className="relative z-10 text-center">
                        <p className="text-white/90 text-sm font-medium mb-1 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            মোট ব্যালেন্স
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight my-1.5">
                            <span className="text-xl sm:text-2xl opacity-80 mr-1">৳</span>
                            {totalBalance.toLocaleString()}
                        </h2>
                        <div className="mt-3 inline-block px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10 text-xs font-semibold tracking-wide">
                            {accounts.length} টি অ্যাকাউন্ট একটিভ
                        </div>
                    </div>
                </motion.div>

                {/* Add New Account Button */}
                <button
                    onClick={() => setShowAddAccount(true)}
                    className={`w-full bg-white dark:bg-[#1f1f23] rounded-2xl p-4 flex items-center justify-center gap-3 border border-dashed border-gray-300 dark:border-gray-700 ${theme.hoverBorder} ${theme.hoverBg} transition-all group shadow-sm active:scale-[0.98]`}
                >
                    <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <FiPlus className={theme.plusIcon} size={20} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-bold text-sm">নতুন অ্যাকাউন্ট যোগ করুন</span>
                </button>

                {/* Accounts List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <FiLoader className={`${theme.iconColor} animate-spin`} size={40} />
                            <p className="text-gray-400 font-medium">লোড হচ্ছে...</p>
                        </div>
                    ) : (
                        <>
                            {Array.isArray(accounts) && accounts.map((account, index) => (
                                <motion.div
                                    key={account._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-[#1f1f23] rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[200px]"
                                >
                                    {/* Card Body */}
                                    <div className="p-6 sm:p-7">
                                        {/* Account Header */}
                                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                                            <div className="text-left w-1/2 pl-2 sm:pl-4">
                                                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1.5">অ্যাকাউন্ট নম্বর</p>
                                                <h3 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl font-mono tracking-wide">
                                                    {account.accountNumber}
                                                </h3>
                                            </div>
                                            <div className="text-right w-1/2">
                                                <div className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme.amountColor} leading-tight`}>
                                                    ৳ {account.balance.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setShowAddTransaction(account._id);
                                                    setTransactionAmount('');
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl ${theme.buttonBg} ${theme.buttonText} font-bold text-base ${theme.buttonHover} transition-colors shadow-sm active:scale-[0.98]`}
                                            >
                                                <FiEdit2 size={18} /> লেনদেন
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAccount(account._id)}
                                                className="flex-none w-16 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm active:scale-[0.95]"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {accounts.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-400 italic font-medium">কোন অ্যাকাউন্ট পাওয়া যায়নি</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            {/* Add Account Modal */}
            <AnimatePresence>
                {showAddAccount && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowAddAccount(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center tracking-tight">নতুন অ্যাকাউন্ট</h3>
                            <div className="space-y-5 sm:space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">অ্যাকাউন্ট নম্বর</label>
                                    <input
                                        type="text"
                                        value={newAccountNumber}
                                        onChange={(e) => setNewAccountNumber(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 ${theme.inputFocus} outline-none text-gray-900 dark:text-white font-mono text-lg transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">প্রাথমিক ব্যালেন্স</label>
                                    <input
                                        type="number"
                                        value={newAccountBalance}
                                        onChange={(e) => setNewAccountBalance(e.target.value)}
                                        placeholder="0"
                                        className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 ${theme.inputFocus} outline-none text-gray-900 dark:text-white font-mono text-lg transition-all`}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowAddAccount(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">বাতিল</button>
                                    <button
                                        onClick={handleAddAccount}
                                        disabled={isSubmitting || !newAccountNumber || !newAccountBalance}
                                        className={`flex-1 py-4 ${theme.actionBtn} text-white rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2`}
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'যোগ করুন'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Transaction Modal */}
            <AnimatePresence>
                {showAddTransaction && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowAddTransaction(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center tracking-tight">নতুন ব্যালেন্স আপডেট</h3>

                            {(() => {
                                const account = accounts.find(a => a._id === showAddTransaction);
                                return (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">পূর্বের ব্যালেন্স</p>
                                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">৳ {account?.balance.toLocaleString()}</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider text-center">আজকের নতুন ব্যালেন্স</label>
                                            <input
                                                type="number"
                                                value={transactionAmount}
                                                onChange={(e) => setTransactionAmount(e.target.value)}
                                                placeholder="0"
                                                className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 ${theme.inputFocus} outline-none text-gray-900 dark:text-white font-mono text-3xl text-center font-bold transition-all`}
                                            />
                                        </div>

                                        {transactionAmount && account && (
                                            <div className="text-center animate-fade-in">
                                                <p className="text-xs text-gray-400 mb-1">পরিবর্তন (অটোমেটিক হিসাব)</p>
                                                <p className={`text-lg font-bold ${parseFloat(transactionAmount) - account.balance > 0 ? 'text-green-500' : parseFloat(transactionAmount) - account.balance < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                                    {parseFloat(transactionAmount) - account.balance > 0 ? '+' : ''}
                                                    ৳ {(parseFloat(transactionAmount) - account.balance).toLocaleString()}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-2">
                                            <button onClick={() => setShowAddTransaction(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">বাতিল</button>
                                            <button
                                                onClick={() => handleUpdateBalance(account?._id)}
                                                disabled={!transactionAmount || parseFloat(transactionAmount) === account?.balance || isSubmitting}
                                                className={`flex-1 py-4 ${theme.actionBtn} text-white rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}
                                            >
                                                {isSubmitting ? <FiLoader className="animate-spin" /> : 'আপডেট করুন'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default MobileBankingPage;
