import express from 'express';
import { createUser, getUserByEmail } from '../models/user.model';
import jwt from 'jsonwebtoken';
import Crypto from '../utils/crypto';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    /**
     * Needs to create a new user with a unique id
     * /auth/register
     *  POST:
     *      - create a new user
     *      - return the user object
     * Request Body:
     *      required: true
     *      content:
     *         application/json:
     *           schema:
     *              type: object
     *           properties:
     *              username: string
     *              email: string
     *              password: string
     * 
     * Responses:
     *   - return 201 status code
     *      - user object
     *      - id
     *      - username
     *      - email
     *      - wins
     *      - losses
     *      - draws
     * - return 400 status code
     *      - Email already exists
     * - return 500 status code
     *      - Internal Server Error
     * 
     */
    public async register(req: express.Request, res: express.Response) {
        try {
            const { username, email, password } = req.body;
            // Could move validation to middleware/ route handler
            if (!username || !email || !password) {
                return res.status(400).send('Username, email, and password are required');
            }

            const existingUser = await getUserByEmail(email);
            console.log(existingUser);
            if (!existingUser || existingUser.length > 0) {
                return res.status(400).send('Email already exists');
            }

            const hashedPassword = await Crypto.hashPassword(password);
            const user = await createUser({ id: uuidv4(), username, email, password: hashedPassword });

            res.status(201).json({ message: 'User created', user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }


    /**
     * Needs to login a user and return a token
     * /auth/login
     * POST:
     *     - login a user
     *    - return a token
     *   - return the user object
     * Request Body:
     *     required: true
     *    content:
     *      application/json:
     *        schema:
     *          type: object
     *         properties:
     *           email: string
     *          password: string
     * 
     * Responses:
     *   - return 200 status code
     *      - message
     *      - token
     *      - user object
     *          - id
     *          - username
     *          - email
     *          - wins
     *          - losses
     *          - draws
     *   - return 400 status code
     *      - Email and password are required
     *   - return 401 status code
     *      - Invalid email or password
     *   - return 500 status code
     *      - Internal Server Error
     * 
     */
    public async login(req: express.Request, res: express.Response) {
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

            if (!await Crypto.comparePassword(password, user.password)) {
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

    /**
     * Needs to refresh a user's token
     * /auth/refresh-user
     * POST:
     *      - refresh a user's token
     *      - return the user object
     * Request Headers:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                 type: object
     *              properties:
     *                  Authorization: string
     * 
     * Responses:
     *  - return 200 status code
     *      - message
     *      - user object
     *          - id
     *          - username
     *          - email
     *          - wins
     *          - losses
     *          - draws
     * - return 401 status code
     *     - Unauthorized: No token provided
     * - return 403 status code
     *     - Unauthorized: Invalid token
     * - return 401 status code
     *     - Unauthorized: User not found
     * - return 500 status code
     *     - Internal Server Error
     * 
     */
    public async refreshUser(req: express.Request, res: express.Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header
            if (!token) {
                return res.status(401).send('Unauthorized: No token provided');
            }

            jwt.verify(token, JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).send('Unauthorized: Invalid token');
                }

                console.log(decoded);
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

    public async checkSession(req: express.Request, res: express.Response) {
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
}

export default new AuthController();