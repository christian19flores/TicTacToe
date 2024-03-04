import express from 'express';
import { getUserByEmail } from '../models/user.model';
import { createGame, findGameById } from '../models/game.model';
import { generateRandomString } from '../utils/crypto';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Needs to create a new game with player_1 populated and a unique game_id that is used to join the game by url
 * 1. Pull 
 * @param req 
 * @param res 
 * @returns 
 */
export const startGame = async (req: express.Request, res: express.Response) => {
    try {
        // @ts-ignore // Thi
        const result = await getUserByEmail(req.user.email);

        if (!result || result.length < 1)
            return res.status(400).send('Invalid user');

        let playerOne = result[0];

        if (!playerOne)
            return res.status(400).send('Invalid user');

        // generate a game_id
        let gameId = await generateRandomString(8);

        const game = await createGame({
            game_id: gameId,
            moves: [],
            player_x: playerOne.id.toString(),
            player_o: '',
            created_at: new Date(),
            updated_at: new Date()
        });


        return res.status(201).json({ message: 'Game created', game: game[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

export const joinGame = async (req: express.Request, res: express.Response) => {
    try {
        const gameId = req.params.gameId;

        // find game by game_id
        let game = await findGameById(gameId);
        // if game is not found, return 404
        if (!game || game.length < 1)
            return res.status(404).json({ message: 'Game not found' });

        // if game is found, return game
        return res.status(200).json({ message: 'Game found', game: game[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}