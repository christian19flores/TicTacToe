import { randomInt } from 'crypto';
import Crypto from '../utils/crypto';
import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { createUser } from '../models/user.model';

let users = [
    {
        id: uuidv4(),
        username: 'Josh',
        email: 'josh@gmail.com',
        password: 'josh123',
    },
    {
        id: uuidv4(),
        username: 'John',
        email: 'john@gmail.com',
        password: 'john123'
    },
    {
        id: uuidv4(),
        username: 'Jane',
        email: 'jane@gmail.com',
        password: 'jane123'
    },
    {
        id: uuidv4(),
        username: 'Jill',
        email: 'jill@gmail.com',
        password: 'jill123'
    },
    {
        id: uuidv4(),
        username: 'Jack',
        email: 'jack@gmail.com',
        password: 'jack123'
    },
    {
        id: uuidv4(),
        username: 'Jared',
        email: 'jared@gmail.com',
        password: 'jared123'
    },
    {
        id: uuidv4(),
        username: 'Jen',
        email: 'jen@gmail.com',
        password: 'jen123'
    },
]

async function seedDatabase() {
    // Seed the database
    console.log('Seeding the database');

    // Insert starting users
    for (let user of users) {
        await createUser({
            id: user.id,
            username: user.username,
            email: user.email,
            password: await Crypto.hashPassword(user.password),
            wins: randomInt(0, 100),
            losses: randomInt(0, 100),
            draws: randomInt(0, 100)
        })
    }

    console.log('Database seeded');
}

seedDatabase()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });