import express from 'express'
import getConnection from '../src/db'
import { get } from 'http';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await getConnection();
        const [rows] = await db.query(`SELECT 
    POST.post_id, 
    POST.title, 
    POST.content, 
    POST.views, 
    POST.likes_count, 
    POST.comments_count, 
    POST.created_at,
    U.username,
    CAT.name
FROM Posts POST
JOIN Users U ON POST.user_id = U.user_id
JOIN Categories CAT ON POST.category_id = CAT.category_id
ORDER BY POST.created_at DESC;`);
        await db.end(); 
        res.json(rows)
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database Error' })
    }
})

router.get("/:id/comments", async (req, res) => {
    const post_id = req.params.id;
    try {
        const db = await getConnection();
        const query = await db.query('SELECT * FROM comments WHERE post_id = ?', [post_id]);
        res.json(query);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/")

export default router