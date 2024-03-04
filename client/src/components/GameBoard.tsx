import withAuth from "../hoc/withAuth";
import { Clipboard } from "lucide-react";
import TicTacToe from "./TicTacToe";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameMove } from "../types";
import io from 'socket.io-client';
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const socket = io('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('wr-ttt'), // Assuming this is your auth token
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
});


interface GameBoardProps {

}

function GameBoard({ }: GameBoardProps) {
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used within a UserProvider');

    const { state } = context;

    let { id } = useParams<{ id: string }>();

    let [gameState, setGameState] = useState<GameMove[]>([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log(state)
            console.log('Successfully connected to the server');
            // Emit the startGame event right after connecting
            socket.emit('joinGame', {gameId: id}); // Adjust with actual user data
        });

        socket.on('gameStarted', ({ gameId, game }) => {
            console.log('Game started:', game);
            console.log('Game started with ID:', gameId);
        });

        // Cleanup
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="container mx-auto flex flex-col items-center justify-center">
            <div className="mt-5 max-w-sm flex items-stretch">
                <span className="bg-neutral -mr-2 z-10 flex items-center p-3 rounded-l-lg">
                    Room Link
                </span>

                <input readOnly type="text" className="pl-5 bg-base-200 pr-5 text-right border-none ring-0 outline-none" value="http://localhost:3000/room/1234" />

                <button className="btn btn-neutral rounded-l-none border-none">
                    <Clipboard size={24} />
                </button>
            </div>

            <div className="mt-5">
                <TicTacToe state={[]} />
            </div>

        </div>
    );
};

export default withAuth(GameBoard);