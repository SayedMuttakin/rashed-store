import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ image, label, onClick, fallbackIcon: Icon, color }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cursor-pointer"
            onClick={onClick}
        >
            <div className="w-full bg-gradient-to-r from-[#4a001a] to-[#1a0033] rounded-[15px] p-3 shadow-lg border border-white/5 flex flex-col items-center justify-center gap-2 min-h-[110px] transition-all hover:bg-white/5">
                <div
                    className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center ${image && !imgError ? 'p-1' : 'p-2.5'}`}
                    style={{ backgroundColor: image && !imgError ? 'rgba(255,255,255,0.05)' : color || 'rgba(255,255,255,0.1)' }}
                >
                    {image && !imgError ? (
                        <img
                            src={image}
                            alt={label}
                            className="w-full h-full object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full text-white flex items-center justify-center">
                            {Icon ? <Icon size={28} /> : <div className="w-full h-full bg-white/10 animate-pulse rounded-md" />}
                        </div>
                    )}
                </div>
                <span className="text-white font-bold text-[13px] text-center leading-tight">
                    {label}
                </span>
            </div>
        </motion.div>
    );
};

export default CategoryCard;
