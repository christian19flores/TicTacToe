import { eq, or } from 'drizzle-orm';
import db from '../db/db';
import { games, type Game, type NewGame } from '../db/schema';

export const createGame = async (newGame: NewGame) => {
    return await db.insert(games)
        .values(newGame)
        .returning({
            id: games.id,
            game_id: games.game_id,
            moves: games.moves,
            player_x: games.player_x,
            player_o: games.player_o,
            created_at: games.created_at,
            updated_at: games.updated_at
        });
}

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

export const findGameById = async (gameId: string) => {
    return await db.select({
        id: games.id,
        game_id: games.game_id,
        status: games.status,
        moves: games.moves,
        winner: games.winner,
        player_x: games.player_x,
        player_o: games.player_o,
        created_at: games.created_at,
        updated_at: games.updated_at
    })
        .from(games)
        .where(eq(games.game_id, gameId));
}