import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Post from '../components/Post';

export default function Home({ isLoggedIn }) {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true); // Start loading
            const token = localStorage.getItem('token');
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserId(decodedToken.id);

                const postsRes = await fetch('/api/posts', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!postsRes.ok) throw new Error('Failed to fetch posts');
                const postsData = await postsRes.json();
                setPosts(postsData);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchData();
    }, [isLoggedIn, router]);

    const fetchPosts = async () => {
        setLoading(true); // Start loading for refresh
        const token = localStorage.getItem('token');
        const res = await fetch('/api/posts', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const data = await res.json();
            setPosts(data);
        }
        setLoading(false); // Stop loading
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Start loading
            const token = localStorage.getItem('token');
            await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });
            setContent('');
            await fetchPosts();
        } catch (error) {
            console.error('Post error:', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            setLoading(true); // Start loading
            const token = localStorage.getItem('token');
            await fetch('/api/posts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ postId }),
            });
            setPosts(posts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleReply = async (postId, replyContent) => {
        try {
            setLoading(true); // Start loading
            const token = localStorage.getItem('token');
            await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: replyContent, postId }),
            });
            await fetchPosts();
        } catch (error) {
            console.error('Reply error:', error);
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            setLoading(true); // Start loading
            const token = localStorage.getItem('token');
            await fetch('/api/replies', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ replyId }),
            });
            await fetchPosts();
        } catch (error) {
            console.error('Delete reply error:', error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handlePost} className="post-form">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What’s on your mind?"
                    className="post-textarea"
                />
                <button type="submit" className="form-button">Post</button>
            </form>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div>
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                            userId={userId}
                            onDelete={handleDelete}
                            onReply={handleReply}
                            onDeleteReply={handleDeleteReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}