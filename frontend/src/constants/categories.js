import {
    FiDollarSign,
    FiClock,
    FiCreditCard,
    FiBriefcase,
    FiSmartphone,
    FiMap
} from 'react-icons/fi';

export const CATEGORIES = [
    { id: 1, label: 'ক্যাশ', image: '/src/assets/images/cash.png', fallbackIcon: FiDollarSign, color: '#4CAF50' },
    { id: 2, label: 'বকেয়া', image: '/src/assets/images/due.png', fallbackIcon: FiClock, color: '#FF9800' },
    { id: 3, label: 'বিকাশ', image: '/src/assets/images/bkash.png', fallbackIcon: FiCreditCard, color: '#D61F5D' },
    { id: 4, label: 'নগদ', image: '/src/assets/images/nagad.png', fallbackIcon: FiBriefcase, color: '#F44336' },
    { id: 5, label: 'রকেট', image: '/src/assets/images/rocket.png', fallbackIcon: FiSmartphone, color: '#8C27B0' },
    { id: 6, label: 'উপায়', image: '/src/assets/images/upay.png', fallbackIcon: FiSmartphone, color: '#FFD600' },
    { id: 7, label: 'ব্যাংক', image: '/src/assets/images/bank.svg', fallbackIcon: FiMap, color: '#2196F3' },
    { id: 8, label: 'সিম কার্ড', image: '/src/assets/images/sim.svg', fallbackIcon: FiSmartphone, color: '#607D8B' },
];
