import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Landing() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address to sign up.');
            return;
        }
        if (!password || password.length < 6) {
            setError('Your password should be at least 6 characters long.');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');
            router.push('/login');
        } catch (error) {
            setError(error.message);
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSignup} className="form">
                <h1 className="form-title">Sign Up</h1>
                {error && (
                    <p className="form-error">{error}</p>
                )}
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
                <button type="submit" className="form-button">Sign Up</button>
                <p className="form-text">
                    Already have an account? <Link href="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
}