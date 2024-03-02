import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const random = () => {
    return crypto.randomBytes(128).toString('base64');
}

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('-'))
    .update(process.env.SECRET_KEY as string)
    .digest('hex');
}

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}