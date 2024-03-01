// import { InferInsertModel, InferSelectModel, eq } from 'drizzle-orm';
// import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import db from '../db/db';
import { users, type User, type NewUser } from '../db/schema';

// export const users = pgTable('users', {
//     id: serial('id').primaryKey(),
//     username: text('username').notNull(),
//     email: text('email').notNull(),
//     password: text('password').notNull(),
//     salt: text('salt'),
//     session_token: text('session_token'),
// });


export const getUsers = async () => {
    return await db.select({ id: users.id, username: users.username, email: users.email })
        .from(users);
}

export const getUserByEmail = async (email: string) => {
    return await db.select()
        .from(users)
        .where(eq(users.email, email));
}

export const getUserBySessionToken = async (sessionToken: string) => {
    return await db.select()
        .from(users)
        .where(eq(users.session_token, sessionToken));
}

export const createUser = async (newUser: NewUser) => {
    return await db.insert(users)
        .values(newUser)
        .returning({ id: users.id, username: users.username, email: users.email });
}

export const updateUserById = async (id: number, updatedUser: User) => {
    return await db.update(users)
        .set(updatedUser)
        .where(eq(users.id, id))
        .returning({ id: users.id, username: users.username, email: users.email });
}