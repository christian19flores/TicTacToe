import express from 'express';
import { createUser, getUserByEmail } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../utils/crypto';

const JWT_SECRET = process.env.JWT_SECRET;


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send('Username, email, and password are required');
        }

        const existingUser = await getUserByEmail(email);
        console.log(existingUser)
        if (!existingUser || existingUser.length > 0) {
            return res.status(400).send('Email already exists');
        }

        const hashedPassword = await hashPassword(password);
        const user = await createUser({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        const result = await getUserByEmail(email);
        if (!result) {
            return res.status(401).send('Invalid email or password');
        }

        const user = result[0];

        if (!comparePassword(password, user.password)) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '14d' });

        res.status(200).json({ 
            message: 'User logged in',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                wins: user.wins,
                losses: user.losses,
                draws: user.draws
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const refreshUser = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header
        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).send('Unauthorized: Invalid token');
            }

            console.log(decoded)
            // @ts-ignore
            let result = await getUserByEmail(decoded.email);

            if (!result) {
                return res.status(401).send('Unauthorized: User not found');
            }

            let user = result[0];

            res.status(200).json({ 
                message: 'User is logged in',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    wins: user.wins,
                    losses: user.losses,
                    draws: user.draws
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const checkSession = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header as 'Bearer <token>'
        if (!token) {
            return res.status(401).json({ message: 'No token provided', authorized: false });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token', authorized: false });
            }
            res.status(200).json({ message: 'Token is valid', authorized: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', authorized: false });
    }
}

// export const checkSession = async (req: express.Request, res: express.Response) => {
//     try {
//         const sessionToken = req.cookies[SESSION_TOKEN];
        
//         if (!sessionToken) {
//             return res.status(401).json({ message: 'No session token found', authorized: false })
//         }

//         const result = await getUserBySessionToken(sessionToken);

//         if (!result || result.length === 0) {
//             return res.status(401).json({ message: 'Invalid session token', authorized: false});
//         }

//         return res.status(200).json({ message: 'Session token is valid', user: result[0], authorized: true});
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal Server Error', authorized: false});
//     }
// }

// export const register = async (req: express.Request, res: express.Response) => {
//     try {
//         const { username, email, password } = req.body;

//         // Could move validation to middleware/ route handler
//         if (!username || !email || !password) {
//             return res.status(400).send('Username, email, and password are required');
//         }

//         const result = await getUserByEmail(email);

//         if (!result || result.length > 0) {
//             return res.status(400).send('Email already exists');
//         }

//         const salt = random();
//         const user = await createUser({ 
//             username, 
//             email,
//             salt,
//             password: authentication(salt, password)
//         });


//         return res.status(200).json(user);

//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');    
//     }
// }

// export const login = async (req: express.Request, res: express.Response) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).send('Email and password are required');
//         }

//         const result = await getUserByEmail(email);

//         if (!result || result.length === 0) {
//             return res.status(400).send('Invalid email or password');
//         }

//         const user = result[0];

//         if (authentication(user.salt, password) !== user.password) {
//             return res.status(400).send('Invalid email or password');
//         }

//         user.session_token = authentication(random(), user.password);

//         const updatedUser = await updateUserById(user.id, user);

//         res.cookie(SESSION_TOKEN, user.session_token, { 
//             domain: DOMAIN,
//             path: '/',
//             expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days
//          });
        
//         return res.status(200).json({ message: 'User logged in', user: updatedUser[0] });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');    
//     }
// }