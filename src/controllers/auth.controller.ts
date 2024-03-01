import express from 'express';
import { createUser, getUserByEmail, getUserBySessionToken, updateUserById } from '../models/user.model';
import { DOMAIN, SESSION_TOKEN } from '../utils/constants';
import { authentication, random } from '../utils/crypto';

export const checkSession = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.cookies[SESSION_TOKEN];
        
        if (!sessionToken) {
            return res.status(401).json({ message: 'No session token found' })
        }

        const result = await getUserBySessionToken(sessionToken);

        if (!result || result.length === 0) {
            return res.status(401).json({ message: 'Invalid session token' });
        }

        return res.status(200).json(result[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;

        // Could move validation to middleware/ route handler
        if (!username || !email || !password) {
            return res.status(400).send('Username, email, and password are required');
        }

        const result = await getUserByEmail(email);

        if (!result || result.length > 0) {
            return res.status(400).send('Email already exists');
        }

        const salt = random();
        const user = await createUser({ 
            username, 
            email,
            salt,
            password: authentication(salt, password)
        });


        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
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

        if (!result || result.length === 0) {
            return res.status(400).send('Invalid email or password');
        }

        const user = result[0];

        if (authentication(user.salt, password) !== user.password) {
            return res.status(400).send('Invalid email or password');
        }

        user.session_token = authentication(random(), user.password);

        const updatedUser = await updateUserById(user.id, user);

        res.cookie(SESSION_TOKEN, user.session_token, { 
            domain: DOMAIN,
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days
         });
        
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');    
    }
}