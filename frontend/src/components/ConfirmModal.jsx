import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'নিশ্চিত করুন',
    message = 'আপনি কি নিশ্চিত?',
    confirmText = 'হ্যাঁ, মুছুন',
    cancelText = 'বাতিল',
    type = 'danger' // 'danger', 'info'
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-[#1f1f23] w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                >
                    <div className="p-8 text-center">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${type === 'danger'
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            }`}>
                            <FiAlertTriangle size={32} />
                        </div>

                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-0 p-4 pt-0">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 px-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-sm transition-all rounded-2xl mr-2"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-4 px-4 font-bold text-sm text-white transition-all rounded-2xl shadow-lg active:scale-95 ${type === 'danger'
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
