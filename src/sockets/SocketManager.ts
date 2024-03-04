import { Server as SocketIOServer } from "socket.io";
import { createGame, findGameById, updateGameById } from '../models/game.model';
import { generateRandomString } from '../utils/crypto';
import { verifyToken } from "../utils/auth";

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

                    // Logic to handle if the game is already full or in progress
                    if (game.status !== 'waiting' || (game.player_x && game.player_o)) {
                        console.log('Game is already full or in progress');
                        socket.emit('error', 'Game is already full or in progress');
                        return;
                    }

                    // If the joining user is not already part of the game
                    if (game.player_x !== user.id.toString() && !game.player_o) {
                        console.log('Joining game as player O');
                        // Update the game with the second player
                        game.player_o = user.id.toString();
                        // Update game status as needed, e.g., to 'in progress'
                        game.status = 'in_progress';
                        await updateGameById(gameId, game); // Implement this update logic
                    }

                    socket.join(gameId);

                    // Notify all players in the game room about the current game state
                    this.io.to(gameId).emit('gameUpdate', game);
                } catch (error) {
                    console.error('Error joining game:', error);
                    socket.emit('error', 'Failed to join game');
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
}

export default SocketManager;