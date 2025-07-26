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
    POST.username AS post_author,
    CAT.name AS category_name
FROM POSTS POST
JOIN USERS U ON POST.username = U.username
JOIN CATEGORIES CAT ON POST.category_id = CAT.category_id
ORDER BY POST.created_at DESC;`);
        await db.end(); // Close the connection
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

router.get("/categories", async (req, res) => {
    try {
        const db = await getConnection()
        const [categories] = await db.execute('SELECT * FROM CATEGORIES')
        res.json(categories)
    } catch (error) {
        res.status(500).json({ error: "Could not fetch categories" })
    }
})

router.post("/addposts", async (req, res) => {
    const username = req.body.username;
    const categoryName = req.body.category;
    const title = req.body.title;
    const content = req.body.content;


    try {
        const db = await getConnection()

        const [categoryquery] = await db.execute('SELECT CATEGORY_ID FROM CATEGORIES WHERE NAME = ?', [categoryName])

        if (categoryquery.length === 0) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const cat_id = categoryquery[0].CATEGORY_ID;
        
        const [insertResult] = await db.execute('INSERT INTO POSTS (username, category_id, title, content) VALUES (?, ?, ?, ?)', [username, cat_id, title, content])  // ← Use cat_id

        const [newPost] = await db.execute('SELECT * FROM POSTS WHERE post_id = ?', [insertResult.insertId]);
        res.json(newPost[0]);

    } catch (error) {
        console.log("Error, could not add post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router