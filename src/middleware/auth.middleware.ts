import express from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment



export const isAuthenticated = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const authHeader = req.headers.authorization as string;

        if (!authHeader) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }
        
        jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
            if (err) {
                return res.status(403).send('Unauthorized: Invalid token');
            }

            // @ts-ignore
            req.user = user;
            
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};