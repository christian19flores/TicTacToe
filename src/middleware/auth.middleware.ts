import express from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

export const isAuthenticated = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send('Unauthorized: Invalid token');
            }

            // req.user = user; // Assuming the JWT contains the user information you want to attach to the request
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// import express from 'express';
// import { getUserBySessionToken } from '../models/user.model';
// import { SESSION_TOKEN } from '../utils/constants';

// export const isAuthenticated = async (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
// ) => {
//     try {
//         const sessionToken = req.cookies[SESSION_TOKEN];
        
//         if (!sessionToken) {
//             return res.status(401).send('Unauthorized');
//         }

//         const result = await getUserBySessionToken(sessionToken);

//         if (!result || result.length === 0) {
//             return res.status(401).send('Unauthorized');
//         }

//         // req.user = result[0];

//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// }