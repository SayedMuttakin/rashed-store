import { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiSearch, FiClock, FiUser, FiTrash2, FiEdit2, FiX, FiCheck, FiDollarSign, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import toast from 'react-hot-toast';

const DepositPage = ({ onBack }) => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [historyItem, setHistoryItem] = useState(null);
    const [historyPage, setHistoryPage] = useState(1);
    const itemsPerPage = 10;

    // Form states
    const [newName, setNewName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [updateAmount, setUpdateAmount] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [transactionType, setTransactionType] = useState('plus'); // 'plus' for deposit, 'minus' for withdrawal

    useEffect(() => {
        fetchDeposits();
    }, []);

    useEffect(() => {
        if (historyItem) setHistoryPage(1);
    }, [historyItem]);

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/deposits');
            setDeposits(data || []);
        } catch (error) {
            toast.error('তথ্য লোড করতে সমস্যা হয়েছে');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDeposit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/deposits', {
                name: newName,
                amount: newAmount,
                description: newDescription
            });
            setDeposits(data);
            setShowAddModal(false);
            setNewName('');
            setNewAmount('');
            setNewDescription('');
            toast.success('নতুন জমা যুক্ত হয়েছে');
        } catch (error) {
            toast.error('যোগ করতে সমস্যা হয়েছে');
        }
    };

    const handleUpdateDeposit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.put(`/deposits/${selectedDeposit._id}`, {
                amount: updateAmount,
                description: updateDescription,
                transactionType
            });
            setDeposits(data);
            setShowEditModal(false);
            setUpdateAmount('');
            setUpdateDescription('');
            toast.success('জমা আপডেট হয়েছে');
        } catch (error) {
            toast.error('আপডেট করতে সমস্যা হয়েছে');
        }
    };

    const handleDeleteDeposit = async (id) => {
        if (!window.confirm('আপনি কি নিশ্চিত যে আপনি এই ব্যক্তির সব তথ্য মুছে ফেলতে চান?')) return;
        try {
            const { data } = await API.delete(`/deposits/${id}`);
            setDeposits(data);
            toast.success('সফলভাবে মুছে ফেলা হয়েছে');
        } catch (error) {
            toast.error('মুছতে সমস্যা হয়েছে');
        }
    };

    const filteredDeposits = deposits.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalDepositAmount = deposits.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="w-full min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans text-left relative">
            {/* Nav Bar */}
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
                    জমা লিস্ট
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-5 w-full max-w-md mx-auto mt-14">

                {/* Total Deposit Dashboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-[24px] sm:rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden text-white border border-white/10"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <div className="relative z-10 text-center py-1 sm:py-2">
                        <p className="text-teal-100 text-[11px] sm:text-sm font-medium mb-1 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                            মোট জমা টাকা
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight my-1 sm:my-2">
                            <span className="text-xl sm:text-3xl opacity-80 mr-1">৳</span>
                            {totalDepositAmount.toLocaleString()}
                        </h2>
                        <div className="mt-2 sm:mt-3 inline-block px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10 text-[10px] sm:text-xs font-semibold">
                            {deposits.length} জনের জমা আছে
                        </div>
                    </div>
                </motion.div>

                {/* Search and Add Action */}
                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="ব্যক্তির নাম খুঁজুন..." 
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#1f1f23] border border-gray-100 dark:border-gray-800 focus:border-[#00695c] outline-none text-sm text-gray-800 dark:text-white shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="p-3.5 rounded-2xl bg-[#00695c] text-white shadow-lg shadow-[#00695c]/30 hover:bg-[#004d40] transition-all active:scale-95 flex items-center justify-center"
                    >
                        <FiPlus size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <FiLoader className="text-[#00695c] animate-spin" size={40} />
                            <p className="text-gray-400 font-medium">লোড হচ্ছে...</p>
                        </div>
                    ) : (
                        <>
                            {filteredDeposits.length === 0 ? (
                                <div className="py-20 text-center space-y-3 opacity-50">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                        <FiUser size={32} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium italic">কোন জমার এন্ট্রি নেই</p>
                                </div>
                            ) : (
                                filteredDeposits.map((item, index) => (
                                    <motion.div 
                                        key={item._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-[#1f1f23] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#00695c] dark:text-teal-400">
                                                <FiUser size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-white capitalize">{item.name}</h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">শেষ আপডেট: {item.lastUpdate}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-lg font-black text-[#00695c] dark:text-teal-400">৳ {item.amount.toLocaleString()}</span>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => setHistoryItem(item)}
                                                    className="p-2 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-[#00695c] rounded-lg transition-colors border border-gray-100 dark:border-white/5"
                                                >
                                                    <FiClock size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedDeposit(item);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors border border-gray-100 dark:border-white/5"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteDeposit(item._id)}
                                                    className="p-2 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-gray-100 dark:border-white/5"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="w-full max-w-[400px] bg-white dark:bg-[#121212] rounded-[30px] p-6 relative z-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold dark:text-white">নতুন জমা এন্ট্রি</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleAddDeposit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c] ml-1">ব্যক্তির নাম</label>
                                    <input 
                                        required
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#00695c]"
                                        placeholder="নাম লিখুন"
                                        value={newName} onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c] ml-1">জমার পরিমাণ</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                        <input 
                                            required type="number"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 pl-8 font-black text-xl text-gray-800 dark:text-white focus:outline-none focus:border-[#00695c]"
                                            value={newAmount} onChange={(e) => setNewAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c] ml-1">বিবরণ (ঐচ্ছিক)</label>
                                    <textarea 
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#00695c] min-h-[80px]"
                                        placeholder="উদা: ক্যাশ জমা বা সার্ভিস চার্জ"
                                        value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button" onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all"
                                    >বাতিল</button>
                                    <button 
                                        type="submit"
                                        className="flex-2 grow py-4 bg-[#00695c] text-white font-bold rounded-2xl shadow-lg shadow-[#00695c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >যোগ করুন</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="w-full max-w-[400px] bg-white dark:bg-[#121212] rounded-[30px] p-6 relative z-10 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold dark:text-white mb-1">জমার পরিমাণ আপডেট</h3>
                            <p className="text-sm font-bold text-[#00695c] uppercase tracking-wider mb-6">{selectedDeposit?.name}</p>
                            
                            <form onSubmit={handleUpdateDeposit} className="space-y-6">
                                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">বর্তমান জমা</p>
                                    <div className="text-2xl font-black text-gray-800 dark:text-white flex items-baseline gap-1">
                                        <span className="text-base">৳</span> {selectedDeposit?.amount.toLocaleString()}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-2xl gap-1.5">
                                        <button 
                                            type="button"
                                            onClick={() => setTransactionType('minus')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm ${
                                                transactionType === 'minus' 
                                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]' 
                                                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${transactionType === 'minus' ? 'bg-white animate-pulse' : 'bg-amber-500'}`} />
                                            দিয়েছি
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setTransactionType('plus')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm ${
                                                transactionType === 'plus' 
                                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]' 
                                                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${transactionType === 'plus' ? 'bg-white animate-pulse' : 'bg-green-500'}`} />
                                            পেয়েছি
                                        </button>
                                    </div>

                                    <div className={`relative group transition-all duration-300 ring-2 ${
                                        transactionType === 'plus' ? 'ring-amber-500/20' : 'ring-green-600/20'
                                    } rounded-2xl overflow-hidden`}>
                                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg transition-colors ${
                                            transactionType === 'plus' ? 'text-amber-600' : 'text-green-600'
                                        }`}>
                                            {transactionType === 'plus' ? '+' : '-'}
                                        </span>
                                        <input 
                                            required type="number"
                                            className={`w-full bg-white dark:bg-white/5 py-5 pl-10 pr-4 font-black text-2xl focus:outline-none transition-colors ${
                                                transactionType === 'plus' ? 'text-amber-600' : 'text-green-600'
                                            }`}
                                            placeholder="0"
                                            value={updateAmount} onChange={(e) => setUpdateAmount(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">লেনদেনের বিবরণ</label>
                                    <input 
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00695c]"
                                        placeholder="উদা: কিস্তিতে পরিশোধ বা অতিরিক্ত ক্রয়"
                                        value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button 
                                        type="button" onClick={() => setShowEditModal(false)}
                                        className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl"
                                    >বাতিল</button>
                                    <button 
                                        type="submit"
                                        className={`flex-2 grow py-4 text-white font-bold rounded-2xl shadow-lg transition-all ${
                                            transactionType === 'plus' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-green-600 shadow-green-600/20'
                                        } hover:scale-[1.02] active:scale-[0.98]`}
                                    >আপডেট করুন</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* History Modal */}
            <AnimatePresence>
                {historyItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setHistoryItem(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-[400px] h-[80vh] bg-white dark:bg-[#121212] rounded-[30px] flex flex-col relative z-10 shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-[#004d40] to-[#00695c] p-6 text-white shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">লেনদেনের ইতিহাস</h3>
                                    <button onClick={() => setHistoryItem(null)} className="p-2 hover:bg-white/10 rounded-full">
                                        <FiX size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <FiUser size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/60 font-bold uppercase tracking-widest leading-none mb-1">ব্যক্তির নাম</p>
                                        <p className="font-bold text-lg leading-none">{historyItem.name}</p>
                                    </div>
                                </div>
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

                            {/* Footer stats */}
                            <div className="bg-gray-50 dark:bg-white/5 p-4 border-t border-gray-100 dark:border-white/5 flex gap-4">
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">বর্তমান মোট</p>
                                    <p className="text-lg font-black text-[#00695c]">৳ {historyItem.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepositPage;
