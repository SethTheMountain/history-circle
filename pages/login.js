import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error('Login failed');
            const { token } = await res.json();
            localStorage.setItem('token', token);
            setIsLoggedIn(true); // Update state on successful login
            router.push('/home');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleLogin} className="form">
                <h1 className="form-title">Log In</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="form-input"
                />
                <button type="submit" className="form-button">Log In</button>
            </form>
        </div>
    );
}