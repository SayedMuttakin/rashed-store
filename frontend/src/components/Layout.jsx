import { FiLogOut } from 'react-icons/fi';
import '../styles/index.css';

const Layout = ({ children }) => {
    return (
        <div className="mobile-container flex flex-col min-h-screen relative">
            {children}
        </div>
    );
};

export default Layout;
