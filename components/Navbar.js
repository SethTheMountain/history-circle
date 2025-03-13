import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const router = useRouter();
    const isAuthPage = router.pathname === '/' || router.pathname === '/login';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/home" className="navbar-title">History Circle</Link>
                {!isAuthPage && isLoggedIn && (
                    <div>
                        <Link href="/profile" className="navbar-link">Profile</Link>
                        <Link
                            href="/"
                            className="navbar-link"
                            onClick={() => {
                                localStorage.removeItem('token');
                                setIsLoggedIn(false);
                            }}
                        >
                            Logout
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}