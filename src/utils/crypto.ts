import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}

export const generateRandomString = async (length: number): Promise<string> => {
    // Generate a random set of bytes
    let bytes = crypto.randomBytes(length);
    // Convert those bytes to a base64 string
    let base64 = bytes.toString('base64');
    // Remove non-alphanumeric characters and slice to the desired length
    let gameId = base64.replace(/[^a-zA-Z0-9]/g, '').slice(0, length);

    // In rare cases, the resulting string might be shorter than expected, so regenerate if necessary
    if (gameId.length < length) {
        return generateRandomString(length);
    }

    return gameId.toLocaleUpperCase();
}