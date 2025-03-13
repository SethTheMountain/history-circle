import db from '../../../lib/db';
import jwt from 'jsonwebtoken';

const authenticate = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { id: userId } = authenticate(req);
            const { replyId } = req.body; // Expect replyId in the request body
            if (!replyId) return res.status(400).json({ error: 'Reply ID required' });

            // Verify the user owns the reply
            const [replies] = await db.query('SELECT user_id FROM replies WHERE id = ?', [replyId]);
            if (replies.length === 0) return res.status(404).json({ error: 'Reply not found' });
            if (replies[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized to delete this reply' });

            await db.query('DELETE FROM replies WHERE id = ?', [replyId]);
            res.status(200).json({ message: 'Reply deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message || 'Error deleting reply' });
        }
    } else {
        res.status(405).end();
    }
}