import withAuth from "../hoc/withAuth";
import { Clipboard } from "lucide-react";
import TicTacToe from "./TicTacToe";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameState, PlayerState } from "../types";
import io from 'socket.io-client';
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

let socket: any;


interface GameBoardProps {

}



function GameBoard({ }: GameBoardProps) {
    const navigate = useNavigate();
    const toast = useToast();
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used within a UserProvider');

    const { state } = context;

    let { gameId } = useParams<{ gameId: string }>();

    let [gameState, setGameState] = useState<GameState>({
        moves: [],
        player_x: '',
        player_o: '',
        winner: '',
        status: ''
    });

    let [playerState, setPlayerState] = useState<PlayerState>({
        player_char: '',
        isTurn: false
    });

    useEffect(() => {
        socket = io('http://localhost:3000', {
            auth: {
                token: localStorage.getItem('wr-ttt'), // Assuming this is your auth token
            },
            withCredentials: true,
            transports: ["websocket", "polling"],
        });
        socket.on('connect', () => {
            console.log(state)
            console.log('gameId:', gameId)
            console.log('Successfully connected to the server');
            // Emit the startGame event right after connecting
            socket.emit('joinGame', { gameId: gameId }); // Adjust with actual user data
        });

        socket.on('gameStarted', ({ gameId, game }) => {
            console.log('Game started:', game);
            console.log('Game started with ID:', gameId);
        });

        socket.on('error', (error) => {
            console.error('Error:', error);
            if (error === 'Game not found') {
                // Redirect to 404 page
                navigate(`/404?error='${error}'`);
            }

            if (error === 'Game is already full or in progress') {
                // Redirect to game in progress page
                navigate(`/404?error='${error}'`);
            }
        });

        socket.on('gameUpdate', (game: any) => {
            console.log('Game updated:', game);
            setGameState({
                    moves: game.moves,
                    player_x: game.player_x,
                    player_o: game.player_o,
                    winner: game.winner,
                    status: game.status
                });

            setPlayerState({
                player_char: game.player_x === state?.id ? 'X' : 'O',
                isTurn: determineIsTurn(game)
            });

            console.log('Player state:', {
                player_char: game.player_x === state?.id ? 'X' : 'O',
                isTurn: determineIsTurn(game)
            });
        });

        // Cleanup
        return () => {
            socket.disconnect();
        };
    }, []);

    let determineIsTurn = (game: any) => {
        if (game.moves.length === 0) {
            return game.player_x === state?.id;
        }

        let lastMove = game.moves[game.moves.length - 1];
        return lastMove.player !== state?.id;
    }

    let handleMakeMove = (index: number) => {
        console.log('user:', state);
        console.log('Making move:', index);
        socket.emit('makeAMove', { gameId: gameId, move: index });
    }

    let handleCopyLink = () => {
        let link = `http://localhost:5173/game/${gameId}`;
        navigator.clipboard.writeText(link);
        toast.addToast('Link copied to clipboard', 'success');
    }

    return (
        <div className="container mx-auto flex flex-col items-center justify-center">
            <div className="mt-5 max-w-sm flex items-stretch">
                <span className="bg-neutral -mr-2 z-10 flex items-center p-3 rounded-l-lg">
                    Room Link
                </span>

                <input readOnly type="text" className="pl-5 bg-base-200 pr-5 text-right border-none ring-0 outline-none" value={`http://localhost:5173/game/${gameId}`} />

                <button
                    onClick={() => handleCopyLink()}
                    className="btn btn-neutral rounded-l-none border-none"
                >
                    <Clipboard size={24} />
                </button>
            </div>

            <div className="mt-5">
                <TicTacToe playerState={playerState} makeMove={handleMakeMove} state={gameState} />
            </div>

        </div>
    );
};

export default withAuth(GameBoard);