import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryCard from './components/CategoryCard';
import MobileBankingPage from './pages/MobileBankingPage';
import CashPage from './pages/CashPage';
import DuePage from './pages/DuePage';
import BankPage from './pages/BankPage';
import SimCardPage from './pages/SimCardPage';
import AuthPage from './pages/AuthPage';
import { CATEGORIES } from './constants/categories';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import API from './api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
  const [totalCash, setTotalCash] = useState(0);
  const categories = CATEGORIES;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchTotalCash();
    }
  }, [isAuthenticated]);

  const fetchTotalCash = async () => {
    try {
      // Fetch the aggregated summary (Cash + Accounts + Dues)
      const { data } = await API.get('/cash-balance/summary');
      setTotalCash(data.currentBalance || 0);
    } catch (error) {
      console.error('Error fetching total cash:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleCategoryClick = (category) => {
    const serviceMap = {
      'বিকাশ': 'bkash',
      'নগদ': 'nagad',
      'রকেট': 'rocket',
      'উপায়': 'upay',
      'ক্যাশ': 'cash',
      'বকেয়া': 'due',
      'ব্যাংক': 'bank',
      'সিম কার্ড': 'sim'
    };

    if (serviceMap[category.label]) {
      setCurrentPage(serviceMap[category.label]);
    } else {
      console.log(`${category.label} clicked`);
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {currentPage === 'home' ? (
        <>
          <Navbar onLogout={handleLogout} />
          {/* Dedicated spacer to ensure gap is visible */}
          <div className="h-5 w-full" />

          <main className="content flex flex-col gap-6 px-2 pb-10">
            {/* Balance Card Section */}
            <section className="relative z-10 w-full px-1">
              <div className="w-full bg-gradient-to-r from-[#4a001a] to-[#1a0033] rounded-[10px] p-6 shadow-lg border border-white/5 flex items-center justify-between">
                <div className="flex flex-col flex-1 items-center">
                  <span className="text-4xl font-extrabold text-white flex items-baseline gap-1">
                    <span className="text-xl">৳</span> {totalCash.toLocaleString()}
                  </span>
                </div>
                <button className="btn-gradient px-7 py-2.5 rounded-[2px] font-bold text-[13px] shadow-lg pointer-events-none">
                  মোট ক্যাশ
                </button>
              </div>
            </section>

            {/* Categories Grid */}
            <motion.section
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-4 px-1"
            >
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  label={cat.label}
                  image={cat.image}
                  fallbackIcon={cat.fallbackIcon}
                  color={cat.color}
                  onClick={() => handleCategoryClick(cat)}
                />
              ))}
            </motion.section>

            {/* Gap before Footer */}
            <div className="h-4 w-full" />
          </main>
        </>
      ) : (
        <>
          {currentPage === 'cash' && <CashPage onBack={() => { setCurrentPage('home'); fetchTotalCash(); }} />}
          {currentPage === 'due' && <DuePage onBack={() => { setCurrentPage('home'); fetchTotalCash(); }} />}
          {currentPage === 'bank' && <BankPage onBack={() => { setCurrentPage('home'); fetchTotalCash(); }} />}
          {currentPage === 'sim' && <SimCardPage onBack={() => { setCurrentPage('home'); fetchTotalCash(); }} />}
          {!['home', 'cash', 'due', 'bank', 'sim'].includes(currentPage) && (
            <MobileBankingPage
              serviceType={currentPage}
              onBack={() => { setCurrentPage('home'); fetchTotalCash(); }}
            />
          )}
        </>
      )}
      <Footer />
    </Layout>
  );
}

export default App;
