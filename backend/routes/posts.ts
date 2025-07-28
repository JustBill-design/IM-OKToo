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
FROM Posts POST
JOIN Users U ON POST.username = U.username
JOIN Categories CAT ON POST.category_id = CAT.category_id
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
        const query = await db.query('SELECT * FROM Comments WHERE post_id = ?', [post_id]);
        res.json(query);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/categories", async (req, res) => {
    try {
        const db = await getConnection()
        const [categories] = await db.execute('SELECT * FROM Categories')
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

    console.log("HALPPPP PLZ WORK",username);
     console.log(categoryName);
    console.log(title);
    console.log(content);


    console.log(username)
    try {
        const db = await getConnection()

        const [categoryquery] = await db.execute('SELECT category_id FROM Categories WHERE name = ?', [categoryName]) as [any[], any]

        if (categoryquery.length === 0) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const cat_id = categoryquery[0].category_id;
        console.log("STILL NULL?!!",cat_id)

        const [insertResult] = await db.execute('INSERT INTO Posts (username, category_id, title, content) VALUES (?, ?, ?, ?)', [username, cat_id, title, content])
        
        const [newPost] = await db.execute('SELECT * FROM Posts WHERE post_id = ?', [insertResult.insertId]) as [any[], any];
        res.json(newPost[0]);

    } catch (error) {
        console.log("Error, could not add post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
//     post_id INT NOT NULL, // most likely have to call first then put in
//     username VARCHAR(50) NOT NULL, this is from localhost
//     content TEXT NOT NULL, // this will be from user input
router.post("/addcomments")

export default router