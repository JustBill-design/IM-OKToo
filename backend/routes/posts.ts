import express from 'express'
import getConnection from '../src/db'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await getConnection();
        const [rows] = await db.query(`SELECT POST.post_id, POST.title, POST.content, POST.views, POST.likes_count, POST.comments_count, POST.created_at, 
u.username, cat.name, coms.comment_id, coms.content, coms.created_at, COMUSER.username
FROM
    POSTS POST
    INNER JOIN USERS u ON POST.user_id = u.user_id
    INNER JOIN CATEGORIES cat ON POST.category_id = cat.category_id
    LEFT JOIN POSTLIKES likes ON POST.post_id = likes.post_id
    LEFT JOIN COMMENTS coms ON POST.post_id = coms.post_id
    LEFT JOIN USERS COMUSER ON COMUSER.user_id = coms.user_id
ORDER BY POST.created_at DESC;`);
        await db.end(); // Close the connection
        res.json(rows)
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database Error' })
    }
})

export default router