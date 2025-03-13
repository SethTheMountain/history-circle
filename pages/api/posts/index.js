import db from '../../../lib/db';
import jwt from 'jsonwebtoken';

const authenticate = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [posts] = await db.query(`
                SELECT p.*, u.username AS post_username,
                       r.id AS reply_id, r.content AS reply_content, r.created_at AS reply_created_at, 
                       ru.username AS reply_username, r.user_id AS reply_user_id
                FROM posts p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN replies r ON p.id = r.post_id
                LEFT JOIN users ru ON r.user_id = ru.id
                ORDER BY p.created_at DESC, r.created_at ASC
            `);

            const postsWithReplies = posts.reduce((acc, row) => {
                const post = acc.find((p) => p.id === row.id);
                if (!post) {
                    acc.push({
                        id: row.id,
                        user_id: row.user_id,
                        content: row.content,
                        created_at: row.created_at,
                        username: row.post_username,
                        replies: row.reply_id
                            ? [{
                                id: row.reply_id,
                                content: row.reply_content,
                                created_at: row.reply_created_at,
                                username: row.reply_username,
                                user_id: row.reply_user_id // Ensure this is included
                            }]
                            : [],
                    });
                } else if (row.reply_id) {
                    post.replies.push({
                        id: row.reply_id,
                        content: row.reply_content,
                        created_at: row.reply_created_at,
                        username: row.reply_username,
                        user_id: row.reply_user_id // Ensure this is included
                    });
                }
                return acc;
            }, []);

            res.status(200).json(postsWithReplies);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching posts' });
        }
    } else if (req.method === 'POST') {
        try {
            const { id } = authenticate(req);
            const { content, postId } = req.body;
            if (postId) {
                await db.query('INSERT INTO replies (post_id, user_id, content) VALUES (?, ?, ?)', [postId, id, content]);
                res.status(201).json({ message: 'Reply created' });
            } else {
                await db.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [id, content]);
                res.status(201).json({ message: 'Post created' });
            }
        } catch (error) {
            res.status(401).json({ error: error.message || 'Error creating post or reply' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id: userId } = authenticate(req);
            const { postId } = req.body;
            if (!postId) return res.status(400).json({ error: 'Post ID required' });
            const [posts] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
            if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
            if (posts[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized to delete this post' });
            await db.query('DELETE FROM posts WHERE id = ?', [postId]);
            res.status(200).json({ message: 'Post deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message || 'Error deleting post' });
        }
    } else {
        res.status(405).end();
    }
}