import express from 'express'
import getConnection from '../db.js'
import { get } from 'http';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

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
        res.json(rows)
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database Error' })
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
    const categoryId = req.body.category_id;
    const title = req.body.title;
    const content = req.body.content;

    console.log("HALPPPP PLZ WORK", username);
    console.log("Category name:", categoryName);
    console.log("Category ID:", categoryId);
    console.log(title);
    console.log(content);

    if (!username || !title || !content) {
        return res.status(400).json({ error: "Missing required fields: username, title, and content" });
    }

    if (!categoryName && !categoryId) {
        return res.status(400).json({ error: "category name or category_id is required" });
    }

    console.log(username)
    try {
        const db = await getConnection()

        let cat_id = categoryId;
        if (categoryName && !categoryId) {
            const [categoryquery] = await db.execute('SELECT category_id FROM Categories WHERE name = ?', [categoryName]) as [any[], any]

            if (categoryquery.length === 0) {
                return res.status(400).json({ error: "Invalid category" });
            }

            cat_id = categoryquery[0].category_id;
        }

        console.log("STILL NULL?!!", cat_id)

        const [insertResult] = await db.execute<ResultSetHeader>('INSERT INTO Posts (username, category_id, title, content) VALUES (?, ?, ?, ?)', [username, cat_id, title, content])

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

router.post("/addcomments", async (req, res) => {
    const { post_id, username, content } = req.body;

    if (!post_id || !username || !content) {
        return res.status(400).json({
            error: 'Missing required fields: post_id, username, and content are required'
        });
    }

    try {
        const db = await getConnection();

        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO Comments (post_id, username, content, created_at) VALUES (?, ?, ?, NOW())',
            [post_id, username, content]
        );
        console.log(result)
        const [newComment] = await db.execute<RowDataPacket[]>(
            'SELECT comment_id, post_id, username, content, created_at FROM Comments WHERE comment_id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment: newComment[0]
        });

    } catch (error) {
        console.error('Error adding comment:', error);

        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            'message' in error &&
            typeof (error as any).code === 'string' &&
            typeof (error as any).message === 'string'
        ) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    error: 'Invalid post_id or username'
                });
            }

            res.status(500).json({
                error: 'Failed to add comment',
                details: error.message
            });
        }
        
    }
});

router.get("/:postId/comments", async (req, res) => {
    const { postId } = req.params;

    try {
        const db = await getConnection();

        // Fetch all comments for this post
        const [comments] = await db.execute(
            `SELECT comment_id, post_id, username, content, created_at 
             FROM Comments 
             WHERE post_id = ? 
             ORDER BY created_at DESC`,
            [postId]
        );

        res.json(comments);

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

router.delete("/deletecomment/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { username } = req.body;

    // Validate input
    if (!commentId || !username) {
        return res.status(400).json({
            error: 'Missing required fields: commentId and username are required'
        });
    }

    try {
        const db = await getConnection();

        const [existingComment] = await db.execute<RowDataPacket[]>(
            'SELECT username, post_id FROM Comments WHERE comment_id = ?',
            [commentId]
        );

        if (existingComment.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user owns this comment
        if (existingComment[0].username !== username) {
            return res.status(403).json({
                error: 'Unauthorized: You can only delete your own comments'
            });
        }

        const postId = existingComment[0].post_id;

        // Delete the comment
        await db.execute(
            'DELETE FROM Comments WHERE comment_id = ?',
            [commentId]
        );

        // Update the comments_count in Posts table
        await db.execute(
            'UPDATE Posts SET comments_count = comments_count - 1 WHERE post_id = ? AND comments_count > 0',
            [postId]
        );

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            post_id: postId
        });

    } catch (error) {
        console.error('Error deleting comment:', error);

        if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as any).message === 'string'
        ) {
            res.status(500).json({
                error: 'Failed to delete comment',
                details: error.message
            });
        }
        
    }
});

router.put('/:postId/edit', async (req, res) => {
    const { postId } = req.params;
    const { title, content, category, username } = req.body;


    // Validate input
    if (!title || !content || !category || !username) {
        return res.status(400).json({ error: 'Missing required fields: title, content, category, or username' });
    }

    try {
        const db = await getConnection();

        const [postResult] = await db.execute(
            'SELECT username FROM Posts WHERE post_id = ?',
            [postId]
        ) as [any[], any];

        if (!postResult.length) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (postResult[0].username !== username) {
            return res.status(403).json({ error: 'Unauthorized: You can only edit your own posts' });
        }

        const [catResult] = await db.execute(
            'SELECT category_id FROM Categories WHERE name = ?',
            [category]
        ) as [any[], any];

        if (!catResult.length) {
            return res.status(400).json({ error: 'Invalid category name: ' + category });
        }

        const categoryId = catResult[0].category_id;

        const [updateResult] = await db.execute(
            'UPDATE Posts SET title = ?, content = ?, category_id = ? WHERE post_id = ?',
            [title, content, categoryId, postId]
        ) as [ResultSetHeader, any];


        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ error: 'Post update failed (no changes applied)' });
        }

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            updated: {
                post_id: postId,
                title,
                content,
                category,
                username
            }
        });

    } catch (error: any) {
        console.error('Error editing post:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


router.delete("/delete/:postId", async (req, res) => {
    const { postId } = req.params;
    const { username } = req.body; // We'll need to send username from frontend

    // Validate input
    if (!postId) {
        return res.status(400).json({ error: 'Missing post ID' });
    }

    try {
        const db = await getConnection();

        // check if the person wrote that post
        const [existingPost] = await db.execute(
            'SELECT username, title FROM Posts WHERE post_id = ?',
            [postId]
        ) as [any[], any];

        if (existingPost.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (username && existingPost[0].username !== username) {
            return res.status(403).json({
                error: 'Unauthorized: You can only delete your own posts'
            });
        }

        // Delete all comments associated with this post first
        await db.execute(
            'DELETE FROM Comments WHERE post_id = ?',
            [postId]
        );

        // Delete the post
        const [deleteResult] = await db.execute(
            'DELETE FROM Posts WHERE post_id = ?',
            [postId]
        ) as [ResultSetHeader, any];

        if (deleteResult.affectedRows === 0) {
            return res.status(500).json({ error: 'Post deletion failed' });
        }

        res.status(200).json({
            success: true,
            message: 'Post and associated comments deleted successfully',
            deletedPost: {
                post_id: postId,
                title: existingPost[0].title
            }
        });

    } catch (error: any) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            error: 'Failed to delete post',
            details: error.message
        });
    }
});


export default router