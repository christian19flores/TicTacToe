import { Server as SocketIOServer } from "socket.io";
import { createGame, findGameById, makeMove, updateGameById } from '../models/game.model';
import { generateRandomString } from '../utils/crypto';
import { verifyToken } from "../utils/auth";
import { determineEndingStatus, isUsersTurn, isValidMove } from "../utils/game.util";
import { GameMove } from "db/schema";
import { iterateUserPerformance } from "../models/user.model";

class SocketManager {
    constructor(private io: SocketIOServer) { }

    public init() {
        // ensure that user has valid JWT before connecting

        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('startGame', async () => {
                // @ts-ignore
                console.log("Socket user: ", socket.user);
                const gameId = await generateRandomString(8);
                const game = await createGame({
                    game_id: gameId,
                    moves: [],
                    // @ts-ignore
                    player_x: socket.user.userId.toString(),
                    player_o: '',
                    created_at: new Date(),
                    updated_at: new Date()
                });

                socket.join(gameId);
                this.io.to(gameId).emit('gameStarted', { game: game[0] });
            });

            socket.on('joinGame', async ({ gameId }) => {
                console.log('Joining game:', gameId);
                // @ts-ignore
                const user = socket.user; // User info from JWT
                try {
                    const result = await findGameById(gameId);
                    if (!result || result.length < 1) {
                        socket.emit('error', 'Game not found');
                        return;
                    }

                    const game = result[0];

                    console.log('Game:', game);
                    console.log(game.player_x == user.userId, game.player_o == user.userId);

                    if (game.player_x == user.userId || game.player_o == user.userId) {
                        console.log('User is already part of the game and reconnecting');
                        // Join the game room
                        socket.join(gameId);

                        // Notify all players in the game room about the current game state
                        this.io.to(gameId).emit('gameUpdate', game);
                        return;
                    }

                    // Logic to handle if the game is already full or in progress
                    if (game.status == 'in_progress' || (game.player_x && game.player_o)) {
                        console.log('Game is already full or in progress');
                        socket.emit('error', 'Game is already full or in progress');
                        return;
                    }

                    // If the joining user is not already part of the game
                    if (game.player_x !== user.userId && game.player_o !== user.userId) {
                        console.log('User is not part of the game');
                        // If player X is not set, set it to the joining user
                        if (!game.player_x) {
                            game.player_x = user.userId.toString();
                        } else {
                            // If player O is not set, set it to the joining user
                            game.player_o = user.userId.toString();
                        }

                        // If both players are set, set the game status to in progress
                        if (game.player_x && game.player_o) {
                            game.status = 'in_progress';
                        }

                        // Update the game in the database
                        await updateGameById(game.id, game);

                        // Join the game room
                        socket.join(gameId);

                        // Notify all players in the game room about the current game state
                        this.io.to(gameId).emit('gameUpdate', game);
                    }

                } catch (error) {
                    console.error('Error joining game:', error);
                    socket.emit('error', 'Failed to join game');
                }
            });

            socket.on('makeAMove', async ({ gameId, move }) => {
                console.log(`Move made in game ${gameId}:`, move);

                // Assuming socket.user is the user making the move
                // @ts-ignore
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

                    // Check if it's the user's turn and if the move is valid (implement these checks)
                    if (!await isUsersTurn(user, game)) {
                        socket.emit('error', 'Not your turn');
                        return;
                    }

                    if (!await isValidMove(move, game)) {
                        socket.emit('error', 'Invalid move');
                        return;
                    }

                    // Update the game state with the new move
                    (game as { moves: GameMove[] }).moves.push({
                        move: (game as { moves: GameMove[] }).moves.length + 1,
                        player: user.userId,
                        position: move
                    });

                    // Check if the move ends the game
                    // Check if the move resulted in a win or draw and update the game state
                    let endingStatus = await determineEndingStatus(game);
                    if (endingStatus == 'win' || endingStatus == 'draw') {
                        // Update the game status to 'completed'
                        console.log('Game over');
                        game.status = 'completed';

                        // Update the game winner
                        // @ts-ignore
                        if (endingStatus == 'draw') {
                            game.winner = 'draw';
                        } else {
                            // @ts-ignore
                            game.winner = user.userId;
                        }

                        // Set winner and loser for brevity, a draw will still have a winner and loser
                        let winner = user.userId;
                        let loser = game.player_x == user.userId ? game.player_o : game.player_x;
                        // update players wins, losses, and draws
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

                    // Broadcast the updated game state to all players in the game room
                    this.io.to(gameId).emit('gameUpdate', updatedGameResponse[0]);
                } catch (error) {
                    console.error('Error processing move:', error);
                    socket.emit('error', 'Failed to make move');
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
}

export default SocketManager;