import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
            if (err) {
                reject(err);
            }

            resolve(user);
        });
    });
}