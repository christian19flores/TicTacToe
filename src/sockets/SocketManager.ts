import { Server as SocketIOServer } from "socket.io";
import { createGame, findGameById, makeMove, updateGameById } from '../models/game.model';
import Crypto from "../utils/crypto";
import { determineEndingStatus, isUsersTurn, isValidMove } from "../utils/game.util";
import { GameMove } from "db/schema";
import { iterateUserPerformance } from "../models/user.model";

class SocketManager {
    constructor(private io: SocketIOServer) { }

    public init() {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('startGame', this.startGame.bind(this, socket));
            socket.on('joinGame', this.joinGame.bind(this, socket));
            socket.on('makeAMove', this.makeAMove.bind(this, socket));
            socket.on('disconnect', this.onDisconnect.bind(this, socket));
        });
    }

    private async startGame(socket: any) {
        console.log("Socket user: ", socket.user);
        const gameId = await Crypto.generateRandomString(8);
        const game = await createGame({
            game_id: gameId,
            moves: [],
            player_x: socket.user.userId.toString(),
            player_o: '',
            created_at: new Date(),
            updated_at: new Date()
        });

        socket.join(gameId);

        this.io.to(gameId).emit('gameStarted', { game: game[0] });
    }

    private async joinGame(socket: any, { gameId }: { gameId: string }) {
        console.log('Joining game:', gameId);
        const user = socket.user;
        try {

            const result = await findGameById(gameId);

            if (!result || result.length < 1) {
                socket.emit('error', 'Game not found');
                return;
            }

            const game = result[0];

            if (game.player_x == user.userId || game.player_o == user.userId) {
                console.log('User is already part of the game and reconnecting');
                socket.join(gameId);
                this.io.to(gameId).emit('gameUpdate', game);
                return;
            }

            if (game.status == 'in_progress' || (game.player_x && game.player_o)) {
                console.log('Game is already full or in progress');
                socket.emit('error', 'Game is already full or in progress');
                return;
            }

            if (game.player_x !== user.userId && game.player_o !== user.userId) {
                
                if (!game.player_x) {
                    game.player_x = user.userId.toString();
                } else {
                    game.player_o = user.userId.toString();
                }

                if (game.player_x && game.player_o) {
                    game.status = 'in_progress';
                }

                await updateGameById(game.id, game);

                socket.join(gameId);

                this.io.to(gameId).emit('gameUpdate', game);
            }

        } catch (error) {
            console.error('Error joining game:', error);
            socket.emit('error', 'Failed to join game');
        }
    }

    private async makeAMove(socket: any, { gameId, move }: { gameId: string, move: number }) {
        console.log(`Move made in game ${gameId}:`, move);

        const user = socket.user;

        try {

            const result = await findGameById(gameId);

            if (!result || result.length < 1) {
                socket.emit('error', 'Game not found');
                return;
            }

            let game = result[0];

            if (game.status == 'completed') {
                socket.emit('error', 'Game is already completed');
                return;
            }

            if (!await isUsersTurn(user, game)) {
                socket.emit('error', 'Not your turn');
                return;
            }

            if (!await isValidMove(move, game)) {
                socket.emit('error', 'Invalid move');
                return;
            }

            (game as { moves: GameMove[] }).moves.push({
                move: (game as { moves: GameMove[] }).moves.length + 1,
                player: user.userId,
                position: move
            });

            let endingStatus = await determineEndingStatus(game);

            if (endingStatus == 'win' || endingStatus == 'draw') {
                console.log('Game over');
                game.status = 'completed';

                if (endingStatus == 'draw') {
                    game.winner = 'draw';
                } else {
                    game.winner = user.userId;
                }

                let winner = user.userId;
                let loser = game.player_x == user.userId ? game.player_o : game.player_x;

                if (endingStatus == 'draw') {
                    await iterateUserPerformance(winner, 'draw');
                    await iterateUserPerformance(loser, 'draw');
                }

                if (endingStatus == 'win') {
                    await iterateUserPerformance(winner, 'win');
                    await iterateUserPerformance(loser, 'loss');
                }
            }

            const updatedGameResponse = await makeMove(game);

            if (!updatedGameResponse || updatedGameResponse.length < 1) {
                socket.emit('error', 'Failed to make move');
                return;
            }

            this.io.to(gameId).emit('gameUpdate', updatedGameResponse[0]);

        } catch (error) {
            console.error('Error processing move:', error);
            socket.emit('error', 'Failed to make move');
        }
    }

    private onDisconnect(socket: any) {
        console.log('User disconnected:', socket.id);
    }
}

export default SocketManager;