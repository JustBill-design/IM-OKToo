import express from 'express'
import getConnection from '../src/db'

const router = express.Router();

router.post('/getElderly', async(req, res) => {
    const { username } = req.body;
    try {
        const db = await getConnection();
        const data = await db.query(`
            SELECT e.fullname, e.age, e.medical_condition, e.allergies 
            FROM Assignment AS a
            JOIN Elderly AS e ON a.elderly_name = e.fullname
            WHERE a.caretaker_name = ?;`,
            [username]
        );
        await db.end();
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.status(200).json(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Error getting elderly data:', error);
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        // res.status(500).send('Error getting elderly data')
        res.status(200).json([]);
    }
});

router.post('/addElderly', async(req, res) => {
    const {username, newElder } = req.body;
    try {
        const db = await getConnection();
        // check if elderly already exists
        const existingElderly = await db.query(
            'SELECT fullname FROM Elderly WHERE fullname = ?',
            [newElder.fullname]
        );
        if (existingElderly.length > 0) {
            // if elderly exists, create assignment
            console.log("existing elderly, creating assignment only")
            await db.query(`
                INSERT INTO Assignment (caretaker_name, elderly_name)
                VALUES (?, ?)`,
                [username, newElder.fullname]
            );
        } else {
            console.log("adding elderly...")
            await db.query(`
                INSERT INTO Elderly (fullname, age, medical_condition, allergies)
                VALUES (?, ?, ?, ?)`, 
                [newElder.fullname, newElder.age, newElder.medical_condition, newElder.allergies]
            );
            await db.query(`
                INSERT INTO Assignment (caretaker_name, elderly_name)
                VALUES (?, ?)`, 
                [username, newElder.fullname]
            );
        }
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.status(200).send('Successfully added!');
    } catch (error) {
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.status(500).send('Error adding elderly');
    }
});

/*
router.post('/editElderly', async(req, res) => {
    const {current_name, changes} = req.body;
    const fields = ['age', 'medical_condition', 'allergies', 'fullname'];

    try {
        const db = await getConnection();

        for (const field of fields) {
            if (changes[field] !== null) {
                await db.query(
                    `UPDATE Elderly SET ? = ? WHERE fullname = ?`,
                    [field, changes[field], current_name]
                )
            }
        }   
        await db.end();
        // res.status(200).json({message:'Successfully updated!'});
        res.status(200).send('Successfully updated!');
    } catch (error) {
        // res.status(500).json({message:'Error updating details'})
        res.status(500).send('Error updating details');
    }
});
*/

router.post('/editElderly', async(req, res) => {
    const { current_name, changes } = req.body;
    
    try {
        const db = await getConnection();
        
        // Build dynamic query based on changes
        const updateFields = [];
        const updateValues = [];
        
        for (const [field, value] of Object.entries(changes)) {
            if (value !== null && value !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(value);
            }
        }
        
        if (updateFields.length > 0) {
            updateValues.push(current_name); // Add WHERE condition value
            
            const query = `UPDATE Elderly SET ${updateFields.join(', ')} WHERE fullname = ?`;
            await db.query(query, updateValues);
            
            // If fullname was changed, update assignment table too
            if (changes.fullname && changes.fullname !== current_name) {
                await db.query(
                    'UPDATE Assignment SET elderly_name = ? WHERE elderly_name = ?',
                    [changes.fullname, current_name]
                );
            }
        }
        
        await db.end();
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.status(200).send('Successfully updated!');
    } catch (error) {
        console.error('Error updating elderly:', error);
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.status(500).send('Error updating details');
    }
});

export default router

// // change username
// router.patch('/api/me/username', async(req, res) => {
//     const {id, un}  = req.body;
//     const username = un.trim();

//     if (!username) {
//         return res.status(400).json({
//             ok: false,
//             message: 'New username is required.'
//         });
//     }

//     try {
//         const db = await getConnection();

//         // check if username already exists
//         const existingUser = await db.query(`
//             SELECT user_id FROM Users
//             WHERE user_id = ? AND username = ?
//             `, [id, username]);
//         if (existingUser.length > 0) {
//             await db.end();
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Username already taken.'
//             });
//         }

//         // update username
//         const result = await db.query(`
//             UPDATE Users
//             SET username = ?
//             WHERE user_id = ?
//             `, [username, id]);
//         await db.end();
//         // if (result === 0)
//     }
// });