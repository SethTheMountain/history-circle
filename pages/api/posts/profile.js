import db from '../../../lib/db.js';
import jwt from 'jsonwebtoken';

const authenticate = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
    try {
        const { id } = authenticate(req);
        if (req.method === 'GET') {
            const [users] = await db.query('SELECT email, username, bio FROM users WHERE id = ?', [id]);
            res.status(200).json(users[0]);
        } else if (req.method === 'PUT') {
            const { username, bio } = req.body;
            await db.query('UPDATE users SET username = ?, bio = ? WHERE id = ?', [username, bio, id]);
            res.status(200).json({ message: 'Profile updated' });
        } else {
            res.status(405).end();
        }
    } catch (error) {
        console.error('Error processing profile request:', error);
        res.status(401).json({ error: error.message || 'Error processing request' });
    }
}