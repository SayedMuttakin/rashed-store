import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiUser, FiEdit2, FiTrash2, FiSearch, FiDollarSign, FiClock, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';
import ConfirmModal from '../components/ConfirmModal';

const DuePage = ({ onBack }) => {
    const [dues, setDues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form states
    const [newName, setNewName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [updateAmount, setUpdateAmount] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [transactionType, setTransactionType] = useState('plus'); // 'plus' for Dilam, 'minus' for Pelam

    // History Modal state
    const [historyItem, setHistoryItem] = useState(null);
    const [historyPage, setHistoryPage] = useState(1);
    const itemsPerPage = 10;

    // Confirm Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        message: ''
    });

    useEffect(() => {
        if (historyItem) setHistoryPage(1);
    }, [historyItem]);

    useEffect(() => {
        if (!showEditModal) {
            setUpdateAmount('');
            setUpdateDescription('');
            setTransactionType('plus');
        }
    }, [showEditModal]);

    useEffect(() => {
        fetchDues();
    }, []);

    const fetchDues = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/dues');
            if (Array.isArray(data)) {
                setDues(data);
            } else {
                setDues([]);
            }
        } catch (error) {
            console.error('Error fetching dues:', error);
            toast.error('বকেয়া তথ্য লোড করতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDue = async () => {
        if (!newName || !newAmount) return;
        try {
            setIsSubmitting(true);
            const { data } = await API.post('/dues', {
                name: newName,
                amount: parseFloat(newAmount),
                description: newDescription
            });
            if (Array.isArray(data)) {
                setDues(data);
            }
            setNewName('');
            setNewAmount('');
            setNewDescription('');
            setShowAddModal(false);
            toast.success('বকেয়া চমৎকারভাবে যোগ করা হয়েছে।');
        } catch (error) {
            console.error('Error adding due:', error);
            toast.error('যোগ করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateDue = async (id) => {
        let amount = parseFloat(updateAmount);
        if (isNaN(amount)) return;

        // If 'Pelam' (Received) is selected, make the amount negative to subtract from total due
        if (transactionType === 'minus') {
            amount = -Math.abs(amount);
        } else {
            amount = Math.abs(amount);
        }

        try {
            setIsSubmitting(true);
            const { data } = await API.put(`/dues/${id}`, { 
                amount,
                description: updateDescription
            });
            if (Array.isArray(data)) {
                setDues(data);
            }
            setUpdateAmount('');
            setUpdateDescription('');
            setShowEditModal(null);
            toast.success('বকেয়া আপডেট করা হয়েছে।');
        } catch (error) {
            console.error('Error updating due:', error);
            toast.error('আপডেট করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalDue = Array.isArray(dues)
        ? dues.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
        : 0;

    const filteredDues = Array.isArray(dues) ? dues.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleDeleteDue = async (id) => {
        setConfirmModal({
            isOpen: true,
            id,
            title: 'বকেয়া মুছুন',
            message: 'আপনি কি নিশ্চিত যে এই তথ্যটি মুছে ফেলতে চান?'
        });
    };

    const confirmDelete = async () => {
        const id = confirmModal.id;
        try {
            setIsLoading(true);
            const { data } = await API.delete(`/dues/${id}`);
            if (Array.isArray(data)) {
                setDues(data);
            }
            toast.success('তথ্য মুছে ফেলা হয়েছে।');
        } catch (error) {
            console.error('Error deleting due:', error);
            toast.error('মুছে ফেলতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
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
                    বকেয়া লিস্ট
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-5 w-full max-w-md mx-auto mt-14">

                {/* Total Due Dashboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#f59e0b] to-[#92400e] rounded-[24px] sm:rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden text-white border border-white/10"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <div className="relative z-10 text-center py-1 sm:py-2">
                        <p className="text-amber-100 text-[11px] sm:text-sm font-medium mb-1 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            মোট বকেয়া পাওনা
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight my-1 sm:my-2">
                            <span className="text-xl sm:text-3xl opacity-80 mr-1">৳</span>
                            {totalDue.toLocaleString()}
                        </h2>
                        <div className="mt-2 sm:mt-3 inline-block px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10 text-[10px] sm:text-xs font-semibold">
                            {Array.isArray(dues) ? dues.length : 0} জনের কাছে পাওনা
                        </div>
                    </div>
                </motion.div>

                {/* Search and Add Action */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="নাম দিয়ে খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#1f1f23] border border-gray-100 dark:border-gray-800 focus:border-amber-500 outline-none text-sm text-gray-800 dark:text-white shadow-sm transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center"
                    >
                        <FiPlus size={24} />
                    </button>
                </div>

                {/* Due List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <FiLoader className="text-amber-500 animate-spin" size={40} />
                            <p className="text-gray-400 font-medium">লোড হচ্ছে...</p>
                        </div>
                    ) : (
                        <>
                            {Array.isArray(filteredDues) && filteredDues.map((item, index) => (
                                <motion.div
                                    key={item._id || index}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-[#1f1f23] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                <FiUser size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h4>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <FiClock /> শেষ আপডেট: {item.lastUpdate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-amber-600 dark:text-amber-500">৳ {item.amount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                        <button
                                            onClick={() => setHistoryItem(item)}
                                            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all active:scale-95"
                                            title="হিস্টোরি দেখুন"
                                        >
                                            <FiClock size={16} />
                                        </button>
                                        <button
                                            onClick={() => setShowEditModal(item)}
                                            className="flex-1 py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all active:scale-[0.98]"
                                        >
                                            <FiEdit2 size={14} /> বকেয়া আপডেট
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDue(item._id)}
                                            className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {filteredDues.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-400 italic">কোন তথ্য পাওয়া যায়নি</p>
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">নতুন বকেয়া এন্ট্রি</h3>
                            <div className="space-y-5">
                                <div className="text-left">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider pl-1">ব্যক্তির নাম</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="নাম লিখুন"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-amber-500 text-gray-900 dark:text-white font-medium transition-all"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider pl-1">বকেয়া পরিমাণ</label>
                                    <input
                                        type="number"
                                        value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                        placeholder="৳ 0"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-amber-500 text-gray-900 dark:text-white font-mono text-xl font-bold transition-all"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider pl-1">বিবরণ (ঐচ্ছিক)</label>
                                    <input
                                        type="text"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="উদা: মাল ক্রয় বা নগদ বাকি"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-amber-500 text-gray-900 dark:text-white font-medium transition-all"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200">বাতিল</button>
                                    <button
                                        onClick={handleAddDue}
                                        disabled={isSubmitting || !newName || !newAmount}
                                        className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'যোগ করুন'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit/Update Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowEditModal(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">বকেয়া পরিমাণ আপডেট</h3>
                            <p className="text-sm font-bold text-amber-500 mb-6">{showEditModal.name}</p>

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase font-bold">বর্তমান বকেয়া</span>
                                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300">৳ {showEditModal.amount.toLocaleString()}</span>
                                </div>

                                <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-2xl gap-1.5">
                                    <button 
                                        onClick={() => setTransactionType('plus')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm ${
                                            transactionType === 'plus' 
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]' 
                                            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${transactionType === 'plus' ? 'bg-white animate-pulse' : 'bg-amber-500'}`} />
                                        দিয়েছি
                                    </button>
                                    <button 
                                        onClick={() => setTransactionType('minus')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm ${
                                            transactionType === 'minus' 
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]' 
                                            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${transactionType === 'minus' ? 'bg-white animate-pulse' : 'bg-green-500'}`} />
                                        পেয়েছি
                                    </button>
                                </div>

                                <div className="text-left">
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider text-center">
                                        {transactionType === 'plus' ? 'কত টাকা দিলেন?' : 'কত টাকা পেলেন?'}
                                    </label>
                                    <div className="relative">
                                        <span className={`absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold ${transactionType === 'plus' ? 'text-amber-500' : 'text-green-500'}`}>
                                            {transactionType === 'plus' ? '+' : '-'}
                                        </span>
                                        <input
                                            type="number"
                                            value={updateAmount}
                                            onChange={(e) => setUpdateAmount(e.target.value)}
                                            placeholder="0"
                                            className={`w-full pl-12 pr-5 py-5 rounded-2xl bg-gray-50 dark:bg-black/30 border-2 outline-none text-gray-900 dark:text-white font-mono text-3xl font-bold transition-all ${
                                                transactionType === 'plus' 
                                                ? 'border-amber-100 dark:border-amber-900/30 focus:border-amber-500' 
                                                : 'border-green-100 dark:border-green-900/30 focus:border-green-500'
                                            }`}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider pl-1">লেনদেনের বিবরণ</label>
                                    <input
                                        type="text"
                                        value={updateDescription}
                                        onChange={(e) => setUpdateDescription(e.target.value)}
                                        placeholder="উদা: কিস্তিতে পরিশোধ বা অতিরিক্ত ক্রয়"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-amber-500 text-gray-900 dark:text-white font-medium transition-all"
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setShowEditModal(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300">বাতিল</button>
                                    <button
                                        onClick={() => handleUpdateDue(showEditModal._id)}
                                        disabled={!updateAmount || parseFloat(updateAmount) === 0 || isSubmitting}
                                        className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/30 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'আপডেট করুন'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* History Modal */}
            <AnimatePresence>
                {historyItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setHistoryItem(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh]"
                        >
                            {/* History Header */}
                            <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">লেনদেনের ইতিহাস</h3>
                                    <p className="text-xs text-amber-100 font-medium">{historyItem.name}</p>
                                </div>
                                <button 
                                    onClick={() => setHistoryItem(null)}
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* History List */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative">
                                {(!historyItem.history || historyItem.history.length === 0) ? (
                                    <div className="py-12 text-center text-gray-400 italic">কোন ইতিহাস পাওয়া যায়নি</div>
                                ) : (
                                    (() => {
                                        const reversedHistory = [...historyItem.history].reverse();
                                        const totalPages = Math.ceil(reversedHistory.length / itemsPerPage);
                                        const startIndex = (historyPage - 1) * itemsPerPage;
                                        const visibleItems = reversedHistory.slice(startIndex, startIndex + itemsPerPage);

                                        return (
                                            <>
                                                {visibleItems.map((record, idx) => (
                                                    <div key={idx} className="flex gap-4 items-start relative">
                                                        {idx !== visibleItems.length - 1 && (
                                                            <div className="absolute left-5 top-10 bottom-[-20px] w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                                                        )}
                                                        
                                                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border-2 border-white dark:border-gray-900 z-10 ${
                                                            record.type === 'plus' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                                                            record.type === 'minus' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                                                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                            {record.type === 'plus' ? <FiPlus size={16} /> : 
                                                            record.type === 'minus' ? <FiDollarSign size={16} /> : 
                                                            <FiUser size={16} />}
                                                        </div>

                                                        <div className="flex-1 bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className={`text-sm font-bold ${
                                                                    record.type === 'plus' ? 'text-amber-600' : 
                                                                    record.type === 'minus' ? 'text-green-600' : 'text-gray-500'
                                                                }`}>
                                                                    {record.type === 'initial' ? 'শুরু' : 
                                                                    record.type === 'plus' ? 'দিয়েছি' : 'পেয়েছি'}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{record.date}</span>
                                                            </div>
                                                            <div className="text-lg font-black text-gray-800 dark:text-white mb-1">
                                                                ৳ {record.amount.toLocaleString()}
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                                {record.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Pagination Controls */}
                                                {totalPages > 1 && (
                                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                                        <button 
                                                            onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                                                            disabled={historyPage === 1}
                                                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200"
                                                        >
                                                            আগের পেজ
                                                        </button>
                                                        <span className="text-xs font-bold text-gray-400">
                                                            Page {historyPage} of {totalPages}
                                                        </span>
                                                        <button 
                                                            onClick={() => setHistoryPage(p => Math.min(totalPages, p + 1))}
                                                            disabled={historyPage === totalPages}
                                                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200"
                                                        >
                                                            পরের পেজ
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()
                                )}
                            </div>
                            
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">বর্তমান মোট</span>
                                <span className="text-xl font-black text-amber-500">৳ {historyItem.amount.toLocaleString()}</span>
                            </div>
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

export default DuePage;

