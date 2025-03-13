import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile({ isLoggedIn }) {
    const [profile, setProfile] = useState({ email: '', username: '', bio: '' });
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/posts/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Failed to fetch profile: ${res.status} - ${errorText}`);
                }
                const data = await res.json();
                setProfile({
                    email: data.email || '',
                    username: data.username || '',
                    bio: data.bio || '',
                });
            } catch (error) {
                console.error('Fetch profile error:', error);
            }
        };
        fetchProfile();
    }, [isLoggedIn, router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/posts/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });
            alert('Profile updated!');
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="form-title">Profile</h1>
            <form onSubmit={handleUpdate} className="form">
                <input
                    value={profile.email}
                    disabled
                    className="form-input"
                />
                <input
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="Username"
                    className="form-input"
                />
                <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Bio"
                    className="post-textarea"
                />
                <button type="submit" className="form-button">Update Profile</button>
            </form>
        </div>
    );
}