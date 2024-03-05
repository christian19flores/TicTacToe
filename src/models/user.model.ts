import { eq } from 'drizzle-orm';
import db from '../db/db';
import { users, type User, type NewUser } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

export const getUsers = async () => {
    return await db.select({ id: users.id, username: users.username, email: users.email })
        .from(users);
}

export const getUserByEmail = async (email: string) => {
    return await db.select()
        .from(users)
        .where(eq(users.email, email));
}

export const createUser = async (newUser: NewUser) => {
    return await db.insert(users)
        .values(newUser)
        .returning({ id: users.id, username: users.username, email: users.email });
}

export const updateUserById = async (id: string, updatedUser: User) => {
    return await db.update(users)
        .set(updatedUser)
        .where(eq(users.id, id))
        .returning({ id: users.id, username: users.username, email: users.email });
}

export const iterateUserPerformance = async (id: string, result: string) => {
    const user = await db.select({ id: users.id, wins: users.wins, losses: users.losses, draws: users.draws })
        .from(users)
        .where(eq(users.id, id));

    const updatedUser = {
        wins: user[0].wins,
        losses: user[0].losses,
        draws: user[0].draws
    };

    if (result === 'win') {
        updatedUser.wins += 1;
    } else if (result === 'loss') {
        updatedUser.losses += 1;
    } else {
        updatedUser.draws += 1;
    }

    return await db.update(users)
        .set(updatedUser)
        .where(eq(users.id, id))
        .returning({ id: users.id, wins: users.wins, losses: users.losses, draws: users.draws });
}
