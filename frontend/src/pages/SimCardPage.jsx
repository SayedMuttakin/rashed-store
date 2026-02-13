import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiSmartphone, FiCreditCard, FiEdit2, FiTrash2, FiClock, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';

const OPERATORS = [
    { id: 'gp', name: 'Grameenphone', color: 'bg-[#007cc3]', logo: '/sim/gp.png' },
    { id: 'bl', name: 'Banglalink', color: 'bg-[#ff6600]', logo: '/sim/bl.png' },
    { id: 'robi', name: 'Robi', color: 'bg-[#e30613]', logo: '/sim/robi.png' },
    { id: 'airtel', name: 'Airtel', color: 'bg-[#ed1c24]', logo: '/sim/airtel.png' },
    { id: 'skitto', name: 'Skitto', color: 'bg-[#fff200]', textColor: 'text-black', logo: '/sim/skitto.png' },
    { id: 'teletalk', name: 'Teletalk', color: 'bg-[#3fb44a]', logo: '/sim/teletalk.png' },
    { id: 'recharge', name: 'Recharge Card', color: 'bg-purple-600', isCard: true }
];

const SimCardPage = ({ onBack }) => {
    const [simBalances, setSimBalances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(null);

    // Form states
    const [selectedOp, setSelectedOp] = useState(OPERATORS[0]);
    const [nickname, setNickname] = useState('');
    const [initialAmount, setInitialAmount] = useState('');
    const [updateAmount, setUpdateAmount] = useState('');

    useEffect(() => {
        fetchSimBalances();
    }, []);

    const fetchSimBalances = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/accounts?service=sim');
            if (Array.isArray(data)) {
                setSimBalances(data);
            } else {
                setSimBalances([]);
            }
        } catch (error) {
            console.error('Error fetching sim balances:', error);
            toast.error('সিম ব্যালেন্স তথ্য লোড করতে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    const totalBalance = Array.isArray(simBalances)
        ? simBalances.reduce((sum, item) => sum + (Number(item.balance) || 0), 0)
        : 0;

    if (!Array.isArray(simBalances) && simBalances !== undefined) {
        console.error('Sim balances is not an array:', simBalances);
    }

    const handleAddSim = async () => {
        if (!nickname || !initialAmount) return;
        try {
            setIsSubmitting(true);
            const { data } = await API.post('/accounts', {
                serviceType: 'sim', // Standardized to serviceType
                accountName: selectedOp.id,
                accountNumber: nickname,
                balance: parseFloat(initialAmount)
            });
            if (Array.isArray(data)) {
                setSimBalances(data);
            }
            toast.success('সিম কার্ড সফলভাবে যোগ করা হয়েছে।');
            setNickname('');
            setInitialAmount('');
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding sim:', error);
            alert('যোগ করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBalance = async (id) => {
        const amount = parseFloat(updateAmount);
        if (isNaN(amount)) return;

        try {
            setIsSubmitting(true);
            const { data } = await API.put(`/accounts/${id}`, { newBalance: amount });
            if (Array.isArray(data)) {
                setSimBalances(data);
            }
            toast.success('ব্যালেন্স আপডেট করা হয়েছে।');
            setUpdateAmount('');
            setShowUpdateModal(null);
        } catch (error) {
            console.error('Error updating sim balance:', error);
            toast.error('আপডেট করতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSim = async (id) => {
        if (window.confirm('এই সিম রেকর্ডি মুছে ফেলতে চান?')) {
            try {
                setIsLoading(true);
                const { data } = await API.delete(`/accounts/${id}`);
                if (Array.isArray(data)) {
                    setSimBalances(data);
                }
                toast.success('সিম রেকর্ড মুছে ফেলা হয়েছে।');
            } catch (error) {
                console.error('Error deleting sim:', error);
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
                    সিম কার্ড ও রিচার্জ
                </span>
                <div className="w-9" />
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-8 space-y-5 w-full max-w-md mx-auto mt-14">

                {/* Total Dashboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#6b21a8] to-[#3b0764] rounded-[24px] sm:rounded-3xl p-6 shadow-xl relative overflow-hidden text-white"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <div className="relative z-10 text-center py-2">
                        <p className="text-purple-200 text-sm font-medium mb-1 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                            মোট সিম ব্যালেন্স
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight my-2">
                            <span className="text-2xl sm:text-3xl opacity-80 mr-1">৳</span>
                            {totalBalance.toLocaleString()}
                        </h2>
                    </div>
                </motion.div>

                {/* Add Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full bg-white dark:bg-[#1f1f23] rounded-2xl p-4 flex items-center justify-center gap-3 border border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group shadow-sm active:scale-[0.98]"
                >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPlus className="text-purple-600 dark:text-purple-400" size={20} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-bold text-sm">নতুন সিম/কার্ড যোগ করুন</span>
                </button>

                {/* Sim List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <FiLoader className="text-purple-500 animate-spin" size={40} />
                            <p className="text-gray-400 font-medium">লোড হচ্ছে...</p>
                        </div>
                    ) : (
                        <>
                            {Array.isArray(simBalances) && simBalances.map((item, index) => {
                                const operator = OPERATORS.find(op => op.id === item.accountName);
                                return (
                                    <motion.div
                                        key={item._id || index}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-[#1f1f23] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3 text-left">
                                                <div className={`w-12 h-12 rounded-2xl ${operator?.color || 'bg-gray-200'} flex items-center justify-center p-2`}>
                                                    {operator?.logo ? (
                                                        <img src={operator.logo} alt={operator.name} className="w-full h-full object-contain brightness-100" />
                                                    ) : (
                                                        <FiCreditCard className="text-white" size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{item.accountNumber}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{operator?.name || 'Unknown'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-purple-600 dark:text-purple-400">৳ {item.balance.toLocaleString()}</p>
                                                <p className="text-[9px] text-gray-400 flex items-center justify-end gap-0.5 mt-1 font-bold">
                                                    <FiClock size={10} /> {new Date(item.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                            <button
                                                onClick={() => setShowUpdateModal(item)}
                                                className="flex-1 py-3 px-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-100 transition-all active:scale-[0.98]"
                                            >
                                                <FiEdit2 size={14} /> ব্যালেন্স আপডেট
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSim(item._id)}
                                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all active:scale-95 border border-red-100 dark:border-red-900/20"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {simBalances.length === 0 && (
                                <div className="py-12 text-center bg-white dark:bg-[#1f1f23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <p className="text-gray-400 italic font-medium">কোন সিম পাওয়া যায়নি</p>
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
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
                        >
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">নতুন সিম/কার্ড এন্ট্রি</h3>
                            <div className="space-y-4">
                                {/* Operator Grid */}
                                <div className="grid grid-cols-4 gap-2">
                                    {OPERATORS.map(op => (
                                        <button
                                            key={op.id}
                                            onClick={() => {
                                                setSelectedOp(op);
                                                setNickname(`${op.name}${op.isCard ? '' : ' Main'}`);
                                            }}
                                            className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${selectedOp.id === op.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-800'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${op.color} flex items-center justify-center overflow-hidden`}>
                                                {op.logo ? <img src={op.logo} alt="" className="w-full h-full object-contain" /> : <FiCreditCard className="text-white" size={16} />}
                                            </div>
                                            <span className="text-[8px] font-bold dark:text-gray-300">{op.name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="text-left space-y-4 pt-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">নিকনেম (যেমন: GP Main)</label>
                                        <input
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder="নাম লিখুন"
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-purple-500 text-gray-900 dark:text-white font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">শুরু ব্যালেন্স</label>
                                        <input
                                            type="number"
                                            value={initialAmount}
                                            onChange={(e) => setInitialAmount(e.target.value)}
                                            placeholder="৳ 0"
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-purple-500 text-gray-900 dark:text-white font-mono font-bold text-xl text-center"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 transition-all">বাতিল</button>
                                    <button
                                        onClick={handleAddSim}
                                        disabled={isSubmitting || !nickname || !initialAmount}
                                        className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowUpdateModal(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">ব্যালেন্স আপডেট</h3>
                            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-6">{showUpdateModal.nickname}</p>

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold text-left">বর্তমান ব্যালেন্স</span>
                                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300">৳ {showUpdateModal.amount.toLocaleString()}</span>
                                </div>

                                <div className="text-left text-center">
                                    <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">আজকের ব্যালেন্স (নতুন পরিমাণ লিখুন)</label>
                                    <input
                                        type="number"
                                        value={updateAmount}
                                        onChange={(e) => setUpdateAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-5 py-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 outline-none focus:border-purple-500 text-gray-900 dark:text-white font-mono text-3xl text-center font-bold transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setShowUpdateModal(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 transition-all">বাতিল</button>
                                    <button
                                        onClick={() => handleUpdateBalance(showUpdateModal._id)}
                                        disabled={!updateAmount || parseFloat(updateAmount) === 0 || isSubmitting}
                                        className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
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

export default SimCardPage;
