import withAuth from "../hoc/withAuth";
import { Circle, Clipboard, X } from "lucide-react";
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
        playerX: {
            id: '',
            username: '',
            email: '',
            wins: 0,
            losses: 0,
            draws: 0

        },
        playerO: {
            id: '',
            username: '',
            email: '',
            wins: 0,
            losses: 0,
            draws: 0
        },
        winner: '',
        status: '',
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
            console.log('Successfully connected to game: ', gameId);
            // Emit the startGame event right after connecting
            socket.emit('joinGame', { gameId: gameId }); // Adjust with actual user data
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

        socket.on('joinedGame', (game: any) => {
            console.log('Game joined:', game);
            setGameState({
                moves: game.moves,
                playerX: game.playerX,
                playerO: game.playerO ? game.playerO : {
                    id: '',
                    username: '',
                    email: '',
                    wins: 0,
                    losses: 0,
                    draws: 0
                },
                winner: game.winner,
                status: game.status
            });

            setPlayerState({
                player_char: game.playerX.id === state?.id ? 'X' : 'O',
                isTurn: determineIsTurn(game)
            });
        });

        socket.on('gameUpdate', (game: any) => {
            console.log('Game updated:', game);
            setGameState((prevGameState) => ({
                ...prevGameState,
                moves: game.moves,
                winner: game.winner,
                status: game.status
            }));

            setPlayerState({
                player_char: game.playerX === state?.id ? 'X' : 'O',
                isTurn: determineIsTurn(game)
            });
        });

        socket.on('gameCompleted', (game: any) => {
            setGameState({
                moves: game.moves,
                playerX: game.playerX,
                playerO: game.playerO ? game.playerO : {
                    id: '',
                    username: '',
                    email: '',
                    wins: 0,
                    losses: 0,
                    draws: 0
                },
                winner: game.winner,
                status: game.status
            });
        });

        // Cleanup
        return () => {
            socket.disconnect();
        };
    }, [state.id]);

    let determineIsTurn = (game: any) => {
        if (game.status === 'completed') return false;

        if (game.moves.length === 0) {
            return game.playerX === state?.id || game.playerX.id === state?.id;
        } else {
            let lastMove = game.moves[game.moves.length - 1];
            return lastMove.player !== state?.id;
        }
    }

    let isPlayerTurn = (playerId: string) => {
        // use game state to determine if it's the player's turn
        if (gameState.status === 'completed') return false;
        if (gameState.moves.length === 0) {
            return playerId === gameState.playerX.id ;
        } else {
            let lastMove = gameState.moves[gameState.moves.length - 1];
            return lastMove.player !== playerId;
        }
    }

    let handleMakeMove = (index: number) => {
        socket.emit('makeAMove', { gameId: gameId, move: index });
    }

    let handleCopyLink = () => {
        let link = `http://localhost:5173/game/${gameId}`;
        navigator.clipboard.writeText(link);
        toast.addToast('Link copied to clipboard', 'success');
    }

    return (
        <div className="container max-w-3xl mx-auto flex flex-col items-center justify-center space-y-10">
            <div className="mt-5 flex items-stretch">
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

            <div className="flex flex-row justify-between w-full max-w-xl">

                <div className="indicator basis-2/5">
                    <span className="indicator-item badge badge-info">{gameState.playerX.wins}-{gameState.playerX.losses}-{gameState.playerX.draws}</span>
                    <span className="indicator-item indicator-start badge badge-neutral">
                        <X size={32} className="py-1" />
                    </span>
                    <div className={`${ gameState.winner !== '' &&  gameState.winner === gameState.playerX.id ? 'border border-success' : ''} ${isPlayerTurn(gameState.playerX.id) ? 'border border-base-content' : ''} flex justify-center leading-tight items-center text-base-content rounded-xl text-4xl w-full bg-base-300 place-items-center capitalize`}>
                        {gameState.playerX.username}
                    </div>
                </div>
                <span className="p-3 text-4xl leading-tight basis-1/5 text-center">
                    VS
                </span>
                <div className="indicator basis-2/5">
                    <span className="indicator-item badge badge-info">{gameState.playerO.wins}-{gameState.playerO.losses}-{gameState.playerO.draws}</span>
                    <span className="indicator-item indicator-start badge badge-neutral">
                        <Circle size={25} className="py-1" />
                    </span>
                    <div className={`${ gameState.winner !== '' && gameState.winner === gameState.playerO.id ? 'border border-success' : ''} ${isPlayerTurn(gameState.playerO.id) ? 'border border-base-content' : ''} flex justify-center leading-tight items-center text-base-content rounded-xl text-4xl w-full bg-base-300 place-items-center capitalize`}>
                        {gameState.playerO.username ? (
                            gameState.playerO.username
                        ) : (
                            <span className="loading loading-dots loading-lg"></span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <TicTacToe playerState={playerState} makeMove={handleMakeMove} state={gameState} />
            </div>

        </div>
    );
};

export default withAuth(GameBoard);