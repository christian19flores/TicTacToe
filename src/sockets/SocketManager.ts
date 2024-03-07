import { Server as SocketIOServer } from "socket.io";
import { createGame, findGameById, getGameWithUsers, makeMove, updateGameById } from '../models/game.model';
import Crypto from "../utils/crypto";
import { determineEndingStatus, isUsersTurn, isValidMove } from "../utils/game.util";
import { GameWithMoves } from "../../types/global";
import { iterateUserPerformance } from "../models/user.model";
import { verifyToken } from "../utils/auth";

class SocketManager {
    constructor(private io: SocketIOServer) { }

    public init() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                console.log('No token found')
                return next(new Error('Authentication error'));
            }

            console.log('Token found:', token);
            verifyToken(token)
                .then((user) => {
                    // @ts-ignore
                    socket.user = user;
                    next();
                })
                .catch((error) => {
                    next(new Error('Authentication error'));
                });
        });

        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('joinGame', this.joinGame.bind(this, socket));
            socket.on('makeAMove', this.makeAMove.bind(this, socket));
            socket.on('disconnect', this.onDisconnect.bind(this, socket));
        });
    }

    private async joinGame(socket: any, { gameId }: { gameId: string }) {
        console.log('Joining game:', gameId);
        const user = socket.user;
        try {

            const result = await findGameById(gameId);

            if (!result?.length) { // equivalent to !result || result.length < 1
                this.handleError(socket, 'Game not found');
                return;
            }

            const game = result[0];

            if (game.playerX == user.userId || game.playerO == user.userId) {
                console.log('User is already part of the game and reconnecting');

                let gameWithUserArr = await getGameWithUsers(game.game_id);

                if (!gameWithUserArr?.length) {
                    this.handleError(socket, 'Failed to join game');
                    return;
                }

                socket.join(gameId);
                this.io.to(gameId).emit('joinedGame', gameWithUserArr[0]);
                return;
            }

            if (game.status == 'in_progress' || (game.playerX && game.playerO)) {
                this.handleError(socket, 'Game is already full or in progress');
                return;
            }

            if (game.playerX !== user.userId && game.playerO !== user.userId) {

                // Assign the user to the player X first then player O
                !game.playerX ? game.playerX = user.userId : game.playerO = user.userId;

                // If both players are present, start the game
                if (game.playerX && game.playerO) {
                    game.status = 'in_progress';
                }

                // Update the game with the new player and status
                await updateGameById(game.id, game);

                // return new game state with users data included
                // User data is included to display the username, and w/l/d stats
                let gameWithUsersArr = await getGameWithUsers(game.game_id);

                if (!gameWithUsersArr?.length) {
                    this.handleError(socket, 'Failed to join game');
                    return;
                }

                socket.join(gameId);
                this.io.to(gameId).emit('joinedGame', gameWithUsersArr[0]);
            }

        } catch (error) {
            this.handleError(socket, 'Failed to join game');
        }
    }

    private async makeAMove(socket: any, { gameId, move }: { gameId: string, move: number }) {
        console.log(`Move made in game ${gameId}:`, move);

        const user = socket.user;

        try {

            const result = await findGameById(gameId);

            if (!result?.length) {
                this.handleError(socket, 'Game not found');
                return;
            }

            // @ts-ignore
            let game: GameWithMoves = result[0];

            if (game.status == 'completed') {
                this.handleError(socket, 'Game is already completed');
                return;
            }

            if (!await isUsersTurn(user, game)) {
                this.handleError(socket, 'Not your turn');
                return;
            }

            if (!await isValidMove(move, game)) {
                this.handleError(socket, 'Invalid move');
                return;
            }

            game.moves.push({
                move: game.moves.length + 1,
                player: user.userId,
                position: move
            });

            let endingStatus = await determineEndingStatus(game);

            if (endingStatus == 'win' || endingStatus == 'draw') {
                console.log('Game over');
                game.status = 'completed';

                // assign the winner or draw
                game.winner = endingStatus == 'draw' ? 'draw' : user.userId;

                const winner = user.userId;
                const loser = game.playerX == user.userId ? game.playerO : game.playerX;

                if (endingStatus == 'draw') {
                    await iterateUserPerformance(winner, 'draw');
                    await iterateUserPerformance(loser, 'draw');
                }

                if (endingStatus == 'win') {
                    await iterateUserPerformance(winner, 'win');
                    await iterateUserPerformance(loser, 'loss');
                }

                // return new game state with users
                let gameWithUsersArr = await getGameWithUsers(game.game_id);

                if (!gameWithUsersArr?.length) {
                    this.handleError(socket, 'Failed to make move');
                    return;
                }

                this.io.to(gameId).emit('gameCompleted', gameWithUsersArr[0]);
            }

            const updatedGameResponse = await makeMove(game);

            if (!updatedGameResponse?.length) {
                this.handleError(socket, 'Failed to make move');
                return;
            }

            this.io.to(gameId).emit('gameUpdate', updatedGameResponse[0]);

        } catch (error) {
            this.handleError(socket, 'Failed to make move');
        }
    }

    private onDisconnect(socket: any) {
        console.log('User disconnected:', socket.id);
    }

    private async handleError(socket: any, message: string) {
        console.error(message);
        socket.emit('error', message);
    }
}

export default SocketManager;