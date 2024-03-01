import express from 'express';
import { getUsers } from '../models/user.model';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}