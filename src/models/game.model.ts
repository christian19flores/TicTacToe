import { eq, or } from 'drizzle-orm';
import db from '../db/db';
import { games, type Game, type NewGame } from '../db/schema';

export const getUserGames = async (userId: string) => {
    return await db.select({
        id: games.id,
        moves: games.moves,
        winner: games.winner,
        player_x: games.player_x,
        player_o: games.player_o,
        created_at: games.created_at,
        updated_at: games.updated_at
    })
        .from(games)
        .where(or(eq(games.player_x, userId), eq(games.player_o, userId)));
}

export const updateGameById = async (id: number, updatedGame: Game) => {
    return await db.update(games)
        .set(updatedGame)
        .where(eq(games.id, id))
        .returning({
            id: games.id,
            moves: games.moves,
            winner: games.winner,
            player_x: games.player_x,
            player_o: games.player_o,
            created_at: games.created_at,
            updated_at: games.updated_at
        });
}