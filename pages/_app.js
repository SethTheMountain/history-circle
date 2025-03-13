import { useState, useEffect } from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

// Add to pages/_app.js or a custom _document.js
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />

function MyApp({ Component, pageProps }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div className="min-h-screen">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Component {...pageProps} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
    );
}

export default MyApp;