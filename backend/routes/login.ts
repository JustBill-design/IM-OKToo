import express from 'express'
import bcrypt from 'bcrypt'
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
        const query = await db.query(`SELECT username, password_hash, email FROM Users WHERE username = ? OR email = ?`, [username, username]);

        console.log('Query length:', query[0]?.length || 0);

        if (!query[0] || query[0].length == 0) {
            await db.end();
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            })
        }
        
        const user = query[0][0]; // Get the first user from results
        console.log("we are testing", user)

        // Check if password is bcrypt hash or plain text
        const isBcryptHash = user.password_hash.startsWith('$2');
        let passwordMatch;

        if (isBcryptHash) {
            // Use bcrypt for already hashed passwords
            passwordMatch = await bcrypt.compare(password, user.password_hash);
            console.log('Using bcrypt comparison');
        } else {
            // Direct comparison for plain text passwords (existing users)
            passwordMatch = password === user.password_hash;
            console.log('Using plain text comparison');
            
            // If it matches, upgrade to bcrypt for future security
            if (passwordMatch) {
                const newHash = await bcrypt.hash(password, 10);
                await db.query('UPDATE Users SET password_hash = ? WHERE username = ?', [newHash, user.username]);
                console.log('Password upgraded to bcrypt for user:', user.username);
            }
        }

        if (!passwordMatch) {
            await db.end();
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        await db.query('UPDATE Users SET last_login = NOW() WHERE username = ?', [user.username]);

        await db.end();

        console.log('Login successful for user:', user.username);
        return res.json({
            success: true,
            message: 'Login successful',
            username: user.username
        });

    } catch (error) {
        console.error('Login validation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

router.post('/register', async (req, res) => {
    console.log('Registration request body:', req.body);
    console.log('Available fields:', Object.keys(req.body));
    
    const { username, firstName, email, password, isGoogleUser, googleData } = req.body;

    if (!username || !firstName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Username, first name, and email are required',
            field: 'general'
        });
    }

    // if user did not use google to signup
    if (!isGoogleUser && !password) {
        return res.status(400).json({
            success: false,
            message: 'Password is required',
            field: 'password'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address',
            field: 'email'
        });
    }

    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Username must be at least 3 characters',
            field: 'username'
        });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({
            success: false,
            message: 'Username can only contain letters, numbers, and underscores',
            field: 'username'
        });
    }

    try {
        const db = await getConnection();

        const usernameCheck = await db.query('SELECT username FROM Users WHERE username = ?', [username])

        if (usernameCheck[0] && usernameCheck[0].length > 0) {
            await db.end();
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
                field: 'username'
            });
        }

        const emailCheck = await db.query('SELECT email FROM Users WHERE email = ?', [email])

        if (emailCheck[0] && emailCheck[0].length > 0) {
            await db.end();
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
                field: 'email'
            });
        }

        let passwordhash;
        if (isGoogleUser) {
            // just some random hash to fill the db side (users dont need)
            const randompassword = Math.random().toString(36).slice(-12);
            passwordhash = await bcrypt.hash(randompassword, 10);
        } else {
            passwordhash = await bcrypt.hash(password, 10);
        }

        const result = await db.query('INSERT INTO Users (username, first_name, email, password_hash) VALUES (?, ?, ?, ?)', [username, firstName, email, passwordhash]);

        await db.end();

        if (result[0] && result[0].affectedRows == 1) {
            console.log(`New user registered: ${username} (${email})`);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                username: username
            });
        } else {
            throw new Error('Failed to insert user');
        }

    } catch (error) {
        console.error('Registration error:', error);

        // Handle specific MySQL errors
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('USERNAME')) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists',
                    field: 'username'
                });
            } else if (error.message.includes('EMAIL')) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    field: 'email'
                });
            } else if (error.message.includes('FIRST_NAME')) {
                return res.status(400).json({
                    success: false,
                    message: 'First name already exists',
                    field: 'firstName'
                });
            }
        }
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            field: 'general'
        });
    }
})

router.post('/check-google-user', async (req, res) => {
    const { email, google_id } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const db = await getConnection();
        const query = await db.query('SELECT username, email FROM Users WHERE email = ?', [email])
        await db.end();
        
        if (query[0] && query[0].length > 0) {
            const user = query[0][0];
            console.log("Google user exists", user.username);

            return res.json({
                success: true,
                exists: true,
                username: user.username,
                email: user.EMAIL
            });
        } else {
            console.log('Google user not found for email:', email);
            return res.json({
                success: true,
                exists: false
            });
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database error occurred'
        });
    }
})

router.post('/update-last-login', async (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({
            success: false,
            message: 'Username is required'
        });
    }

    try {
        const db = await getConnection();
        
        await db.query('UPDATE Users SET last_login = NOW() WHERE username = ?', [username]);
        
        await db.end();

        console.log('Last login updated for user:', username);
        return res.json({
            success: true,
            message: 'Last login updated successfully'
        });

    } catch (error) {
        console.error('Update last login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update last login'
        });
    }
});

export default router