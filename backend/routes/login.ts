import express from 'express'
import bcrypt from 'bcrypt'
import getConnection from '../src/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2';

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
        const query = await db.query<RowDataPacket[]>(`SELECT username, password_hash, email FROM Users WHERE username = ? OR email = ?`, [username, username]);

        if (!Array.isArray(query[0]) || query[0].length === 0) {
            await db.end();
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        const user = query[0][0]; // Get the first user from results

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

    // password strength check
    if (!isGoogleUser && password) {
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long',
                field: 'password'
            });
        }
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                field: 'password'
            });
        }
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

        const usernameCheck = await db.query<RowDataPacket[]>('SELECT username FROM Users WHERE username = ?', [username])

        if (usernameCheck[0] && usernameCheck[0].length > 0) {
            await db.end();
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
                field: 'username'
            });
        }

        const emailCheck = await db.query<RowDataPacket[]>('SELECT email FROM Users WHERE email = ?', [email])

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

        const result = await db.query<ResultSetHeader>('INSERT INTO Users (username, first_name, email, password_hash) VALUES (?, ?, ?, ?)', [username, firstName, email, passwordhash]);

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

    } catch (error: unknown) {
        console.error('Registration error:', error);

        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            'message' in error &&
            typeof (error as any).code === 'string' &&
            typeof (error as any).message === 'string'
        ) {
            const err = error as { code: string; message: string };

            if (err.code === 'ER_DUP_ENTRY') {
                if (err.message.includes('USERNAME')) {
                    return res.status(400).json({
                    success: false,
                    message: 'Username already exists',
                    field: 'username'
                    });
                } else if (err.message.includes('EMAIL')) {
                    return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    field: 'email'
                    });
                } else if (err.message.includes('FIRST_NAME')) {
                    return res.status(400).json({
                    success: false,
                    message: 'First name already exists',
                    field: 'firstName'
                    });
                }
            }
        }

        // Default fallback error response
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            field: 'general'
        });
    }
})

router.post('/check-google-user', async (req, res) => {
    const { email, google_id, googleId } = req.body;

    // Handle both googleId (from test) and email (from existing functionality)
    const identifier = googleId || email;
    
    if (!identifier) {
        return res.status(400).json({
            success: false,
            message: 'Email or Google ID is required'
        });
    }

    // If googleId is explicitly provided (even if empty), validate it
    if (req.body.hasOwnProperty('googleId')) {
        if (typeof googleId !== 'string' || googleId.trim() === '') {
            return res.status(422).json({
                success: false,
                message: 'Invalid Google ID format'
            });
        }
    }

    try {
        const db = await getConnection();
        let query;
        
        if (req.body.hasOwnProperty('googleId') && googleId.trim() !== '') {
            // Search by google_id - check if column exists first
            try {
                query = await db.query<RowDataPacket[]>('SELECT username, email FROM Users WHERE google_id = ?', [googleId]);
            } catch (columnError: any) {
                if (columnError.code === 'ER_BAD_FIELD_ERROR') {
                    // google_id column doesn't exist, fall back to email search
                    console.log("Google user check error:", columnError);
                    query = await db.query<RowDataPacket[]>('SELECT username, email FROM Users WHERE email = ?', [email]);
                } else {
                    throw columnError;
                }
            }
        } else {
            // Search by email (existing functionality)  
            query = await db.query<RowDataPacket[]>('SELECT username, email FROM Users WHERE email = ?', [email]);
        }
        
        await db.end();
        
        if (query[0] && query[0].length > 0) {
            const user = query[0][0];
            console.log("Google user exists", user.username);

            return res.status(200).json({
                success: true,
                exists: true,
                username: user.username,
                email: user.email
            });
        } else {
            console.log('Google user not found for identifier:', identifier);
            return res.status(404).json({
                success: true,
                exists: false
            });
        }
    } catch (error) {
        console.error('Google user check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database error'
        });
    }
});

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