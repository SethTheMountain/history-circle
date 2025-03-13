import db from '../../../lib/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Oops! It looks like that email is already in use. Try a different email, or log in if you already have an account.' });
        } else {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Something went wrong while creating your account. Please try again later.' });
        }
    }
}