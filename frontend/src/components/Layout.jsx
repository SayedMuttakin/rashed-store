import '../styles/index.css';

const Layout = ({ children }) => {
    return (
        <div className="mobile-container flex flex-col min-h-screen">
            {children}
        </div>
    );
};

export default Layout;
