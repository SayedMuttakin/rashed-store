import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-10 bg-gradient-to-r from-[#4a001a] to-[#1a0033] rounded-t-[20px] shadow-2xl overflow-hidden border-t border-white/5">
            <div className="p-8 pb-10 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-white font-bold text-lg tracking-tight">
                        Rashed<span className="text-pink-500">Store</span>
                    </div>
                    <p className="text-white/40 text-[11px] text-center max-w-[200px] leading-relaxed">
                        Safe & Secure Digital Service for your Daily Needs.
                    </p>
                </div>

                <div className="w-12 h-[3px] bg-pink-600 rounded-full opacity-50" />

                <div className="w-full flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-[1px] bg-white/10" />
                        <span className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">
                            Verified Platform
                        </span>
                        <span className="w-4 h-[1px] bg-white/10" />
                    </div>
                    <p className="text-white/20 text-[10px] font-medium">
                        &copy; {currentYear} RashedStore. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
