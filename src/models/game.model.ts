import { eq, or, sql, aliasedRelation } from 'drizzle-orm';
import db from '../db/db';
import { games, type Game, type NewGame, users } from '../db/schema';

export const createGame = async (newGame: NewGame) => {
    return await db.insert(games)
        .values(newGame)
        .returning({
            id: games.id,
            game_id: games.game_id,
            moves: games.moves,
            status: games.status,
            playerX: games.playerX,
            playerO: games.playerO,
            created_at: games.created_at,
            updated_at: games.updated_at
        });
}

export const getUserGames = async (userId: string) => {
    return await db.select({
        id: games.id,
        moves: games.moves,
        winner: games.winner,
        playerX: games.playerX,
        playerO: games.playerO,
        created_at: games.created_at,
        updated_at: games.updated_at
    })
        .from(games)
        .where(or(eq(games.playerX, userId), eq(games.playerO, userId)));
}

export const updateGameById = async (id: number, updatedGame: Game) => {
    return await db.update(games)
        .set(updatedGame)
        .where(eq(games.id, id))
        .returning({
            id: games.id,
            moves: games.moves,
            winner: games.winner,
            playerX: games.playerX,
            playerO: games.playerO,
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
        playerX: games.playerX,
        playerO: games.playerO,
        created_at: games.created_at,
        updated_at: games.updated_at
    })
        .from(games)
        .where(eq(games.game_id, gameId));
}

export const makeMove = async (game: any) => {
    // should be similar to updateGameById
    // but should only add a move to the moves array

    return await db.update(games)
        .set(game)
        .where(eq(games.id, game.id))
        .returning({
            id: games.id,
            game_id: games.game_id,
            moves: games.moves,
            status: games.status,
            winner: games.winner,
            playerX: games.playerX,
            playerO: games.playerO,
            created_at: games.created_at,
            updated_at: games.updated_at
        });
}

export const getGameWithUsers = async (gameId: string) => {
    return await db.query.games.findMany({
        where: eq(games.game_id, gameId),
        with: {
            playerX:  {
                columns: {
                    id: true,
                    username: true,
                    email: true,
                    wins: true,
                    losses: true,
                    draws: true
                }
              },
            playerO: {
                columns: {
                    id: true,
                    username: true,
                    email: true,
                    wins: true,
                    losses: true,
                    draws: true
                }
            }
        }
    });
}

// export const getGameWithUsers = async (gameId: number) => {
//     return await db
//       .select({
//         id: games.id,
//         game_id: games.game_id,
//         status: games.status,
//         moves: games.moves,
//         winner: games.winner,
//         playerX: {
//           id: sql<string>`player_x.id`,
//           username: sql<string>`player_x.username`,
//           email: sql<string>`player_x.email`,
//         },
//         playerO: {
//           id: sql<string>`player_o.id`,
//           username: sql<string>`player_o.username`,
//           email: sql<string>`player_o.email`,
//         },
//         created_at: games.created_at,
//         updated_at: games.updated_at,
//       })
//       .from(games)
//       .leftJoin('player_x', eq(games.player_x, users.id))
//       .where(eq(games.id, gameId));
//   };