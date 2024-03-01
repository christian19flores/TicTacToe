import express from 'express';
import { getUserBySessionToken } from '../models/user.model';
import { SESSION_TOKEN } from '../utils/constants';

export const isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const sessionToken = req.cookies[SESSION_TOKEN];
        
        if (!sessionToken) {
            return res.status(401).send('Unauthorized');
        }

        const result = await getUserBySessionToken(sessionToken);

        if (!result || result.length === 0) {
            return res.status(401).send('Unauthorized');
        }

        // req.user = result[0];

        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}