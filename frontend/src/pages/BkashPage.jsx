import React, { useState } from 'react';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiEdit2, FiTrash2, FiArrowLeft, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const BkashPage = ({ onBack }) => {
    const [accounts, setAccounts] = useState([
        {
            id: 1,
            accountNumber: '01712345678',
            balance: 15000,
            transactions: [
                { id: 1, date: '2026-02-07', amount: 5000, type: 'credit' },
                { id: 2, date: '2026-02-07', amount: -2000, type: 'debit' },
                { id: 3, date: '2026-02-06', amount: 3000, type: 'credit' },
                { id: 4, date: '2026-02-05', amount: -1000, type: 'debit' },
                { id: 5, date: '2026-02-04', amount: 2000, type: 'credit' },
                { id: 6, date: '2026-02-03', amount: -500, type: 'debit' },
                { id: 7, date: '2026-02-02', amount: 1500, type: 'credit' },
                { id: 8, date: '2026-02-01', amount: -200, type: 'debit' },
            ]
        },
        {
            id: 2,
            accountNumber: '01798765432',
            balance: 8500,
            transactions: [
                { id: 1, date: '2026-02-07', amount: 3000, type: 'credit' },
                { id: 2, date: '2026-02-06', amount: -500, type: 'debit' },
                { id: 3, date: '2026-02-05', amount: 1000, type: 'credit' },
            ]
        }
    ]);

    const [showAddAccount, setShowAddAccount] = useState(false);
    const [showAddTransaction, setShowAddTransaction] = useState(null);
    const [expandedAccount, setExpandedAccount] = useState(null);

    // Form states
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newAccountBalance, setNewAccountBalance] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionType, setTransactionType] = useState('credit');

    // Confirm Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        message: ''
    });

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Calculate today's change for an account
    const getTodayChange = (account) => {
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = account.transactions.filter(t => t.date === today);
        return todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    };

    // Add new account
    const handleAddAccount = () => {
        if (!newAccountNumber || !newAccountBalance) return;

        const newAccount = {
            id: Date.now(),
            accountNumber: newAccountNumber,
            balance: parseFloat(newAccountBalance),
            transactions: []
        };

        setAccounts([...accounts, newAccount]);
        setNewAccountNumber('');
        setNewAccountBalance('');
        setShowAddAccount(false);
    };

    // Add transaction
    const handleAddTransaction = (accountId) => {
        if (!transactionAmount) return;

        const amount = transactionType === 'credit'
            ? parseFloat(transactionAmount)
            : -parseFloat(transactionAmount);

        const newTransaction = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            amount: amount,
            type: transactionType
        };

        setAccounts(accounts.map(acc => {
            if (acc.id === accountId) {
                return {
                    ...acc,
                    balance: acc.balance + amount,
                    transactions: [...acc.transactions, newTransaction]
                };
            }
            return acc;
        }));

        setTransactionAmount('');
        setShowAddTransaction(null);
    };

    // Delete account
    const handleDeleteAccount = (accountId) => {
        setConfirmModal({
            isOpen: true,
            id: accountId,
            title: 'অ্যাকাউন্ট মুছুন',
            message: 'আপনি কি নিশ্চিত যে এই বিকাশ অ্যাকাউন্টটি মুছে ফেলতে চান?'
        });
    };

    const confirmDelete = () => {
        setAccounts(accounts.filter(acc => acc.id !== confirmModal.id));
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
                    বিকাশ সার্ভিস
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content Container - Adjusted for Fixed Header */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-4 w-full max-w-md mx-auto mt-14">

                {/* Dashboard Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#e2136e] to-[#8f0c4a] rounded-[24px] sm:rounded-3xl p-5 shadow-xl relative overflow-hidden text-white"
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
                    className="w-full bg-white dark:bg-[#1f1f23] rounded-2xl p-4 flex items-center justify-center gap-3 border border-dashed border-gray-300 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group shadow-sm active:scale-[0.98]"
                >
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPlus className="text-pink-600 dark:text-pink-400" size={20} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-bold text-sm">নতুন অ্যাকাউন্ট যোগ করুন</span>
                </button>

                {/* Accounts List */}
                <div className="space-y-4">
                    {accounts.map((account, index) => {
                        const todayChange = getTodayChange(account);
                        const isExpanded = expandedAccount === account.id;

                        return (
                            <motion.div
                                key={account.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-[#1f1f23] rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[200px]"
                            >
                                {/* Card Body */}
                                <div className="p-6 sm:p-7">
                                    {/* Account Header: Left (Number) & Right (Balance) with more spacing */}
                                    <div className="flex justify-between items-end mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                                        <div className="text-left w-1/2 pl-2 sm:pl-4">
                                            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1.5">অ্যাকাউন্ট নম্বর</p>
                                            <h3 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl font-mono tracking-wide">
                                                {account.accountNumber}
                                            </h3>
                                        </div>
                                        <div className="text-right w-1/2">
                                            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 leading-tight">
                                                ৳ {account.balance.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Row - Larger Size & Spacing */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setShowAddTransaction(account.id);
                                                setTransactionAmount(''); // Reset input
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-bold text-base hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors shadow-sm active:scale-[0.98]"
                                        >
                                            <FiEdit2 size={18} /> লেনদেন
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAccount(account.id)}
                                            className="flex-none w-16 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm active:scale-[0.95]"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Modals - Cleaned up styling */}
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
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-gray-900 dark:text-white font-mono text-lg transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">প্রাথমিক ব্যালেন্স</label>
                                    <input
                                        type="number"
                                        value={newAccountBalance}
                                        onChange={(e) => setNewAccountBalance(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-gray-900 dark:text-white font-mono text-lg transition-all"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowAddAccount(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">বাতিল</button>
                                    <button onClick={handleAddAccount} className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:shadow-pink-500/30 text-white rounded-2xl font-bold transition-all transform active:scale-95">যোগ করুন</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Transaction Modal - Updated Logic */}
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
                                const account = accounts.find(a => a.id === showAddTransaction);
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
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-gray-900 dark:text-white font-mono text-3xl text-center font-bold transition-all"
                                            />
                                        </div>

                                        {transactionAmount && (
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
                                                onClick={() => {
                                                    const newBalance = parseFloat(transactionAmount);
                                                    const diff = newBalance - account.balance;
                                                    if (isNaN(diff) || diff === 0) return;

                                                    // Add transaction logic inline or define handler above
                                                    setAccounts(accounts.map(acc => {
                                                        if (acc.id === account.id) {
                                                            return {
                                                                ...acc,
                                                                balance: newBalance,
                                                                transactions: [...acc.transactions, {
                                                                    id: Date.now(),
                                                                    date: new Date().toISOString().split('T')[0],
                                                                    amount: diff,
                                                                    type: diff > 0 ? 'credit' : 'debit'
                                                                }]
                                                            };
                                                        }
                                                        return acc;
                                                    }));
                                                    setShowAddTransaction(null);
                                                    setTransactionAmount('');
                                                }}
                                                disabled={!transactionAmount || parseFloat(transactionAmount) === account.balance}
                                                className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:shadow-pink-500/30 text-white rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                                            >
                                                আপডেট করুন
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 10px;
                }
            `}</style>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div >
    );
};

export default BkashPage;