import express from 'express'
import getConnection from '../src/db'


const router = express.Router();

router.post('/validate', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        const db = await getConnection();
        const query = await db.query(`SELECT USERNAME FROM USERS WHERE username = ? AND password_hash = ?`, [username, password]);

        // Close connection first
        await db.end();

        // console.log('Username searched:', username);
        // console.log('Password searched:', password);
        // console.log('Query result:', query);
        console.log('Query length:', query.length);

        // Then send ONE response
        if (query[0] && query[0].length > 0) {
            console.log('Query result:', query[0])
            return res.json({ success: true, user: query[0] });
        } else {
            return res.json({ success: false, message: 'Invalid username or password' });
        }

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

export default router