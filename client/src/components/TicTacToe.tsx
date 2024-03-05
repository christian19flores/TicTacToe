import { Circle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GameMove, GameState, PlayerState } from "../types";

interface TicTacToeProps {
    playerState: PlayerState;
    state: GameState;
    makeMove: (move: number) => void;
}

export default function TicTacToe({
    playerState = {
        player_char: '',
        isTurn: false
    },
    state = {
        moves: [],
        player_x: '',
        player_o: '',
        winner: '',
        status: ''
    },
    makeMove
}: TicTacToeProps) {

    let [gameBoard, setGameBoard] = useState<string[]>(Array(9).fill(''));
    let [winningCombination, setWinningCombination] = useState<number[] | null>(null);

    // On state change, update the game board
    useEffect(() => {
        if (!state.moves || state.moves.length === 0) return;
        let newGameBoard = Array(9).fill('');
        console.log('State:', state)
        state.moves.forEach((move) => {
            newGameBoard[move.position] = move.player;
        });
        setGameBoard(newGameBoard);

        // Check if state is complete

        // add a line to show the winning moves
        if (state.status == 'complete') {
            console.log('Game over');
            let winningCombination = findWinningCombination();
            if (winningCombination) {
                setWinningCombination(winningCombination);
            }
        }
    }, [state]);

    let handleCellClick = (index: number) => {
        // Make sure player is
        // 1. Using their turn
        // 2. The game is not complete
        // 3. The game is has started
        if (!playerState.isTurn || state.status == 'complete' || state.status == 'pendeng') return;

        // Set the game board on FE to reflect the move
        // This is to give the user immediate feedback
        let newGameBoard = [...gameBoard];
        newGameBoard[index] = playerState.player_char;

        setGameBoard(newGameBoard);

        // Make a move
        makeMove(index);
    }

    let findWinningCombination = () => {
        let winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < winningCombos.length; i++) {
            let [a, b, c] = winningCombos[i];
            if (gameBoard[a] && gameBoard[a] == gameBoard[b] && gameBoard[a] == gameBoard[c]) {
                return winningCombos[i];
            }
        }
        return null;
    }

    let getLineStyle = (winningCombination: number[]) => {
        let lineStyle = {
            position: 'absolute' as 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none' as 'none',
            background: 'red',

        };
        let [x1, y1] = [0, 0];
        let [x2, y2] = [0, 0];

        if (winningCombination[0] == 0 && winningCombination[1] == 1 && winningCombination[2] == 2) {
            [x1, y1] = [0, 50];
            [x2, y2] = [100, 50];
        }
        if (winningCombination[0] == 3 && winningCombination[1] == 4 && winningCombination[2] == 5) {
            [x1, y1] = [50, 0];
            [x2, y2] = [50, 100];
        }
        if (winningCombination[0] == 6 && winningCombination[1] == 7 && winningCombination[2] == 8) {
            [x1, y1] = [100, 50];
            [x2, y2] = [0, 50];
        }
        if (winningCombination[0] == 0 && winningCombination[1] == 3 && winningCombination[2] == 6) {
            [x1, y1] = [50, 0];
            [x2, y2] = [50, 100];
        }
        if (winningCombination[0] == 1 && winningCombination[1] == 4 && winningCombination[2] == 7) {
            [x1, y1] = [50, 0];
            [x2, y2] = [50, 100];
        }
        if (winningCombination[0] == 2 && winningCombination[1] == 5 && winningCombination[2] == 8) {
            [x1, y1] = [50, 0];
            [x2, y2] = [50, 100];
        }
        if (winningCombination[0] == 0 && winningCombination[1] == 4 && winningCombination[2] == 8) {
            [x1, y1] = [0, 0];
            [x2, y2] = [100, 100];
        }
        if (winningCombination[0] == 2 && winningCombination[1] == 4 && winningCombination[2] == 6) {
            [x1, y1] = [100, 0];
            [x2, y2] = [0, 100];
        }

        return lineStyle;
    }

    return (
        <div className="grid grid-cols-3 grid-flow-row bg-white gap-1">
            {gameBoard.map((cell, index) => {
                return (
                    <div
                        key={index}
                        className="bg-base-100 h-24 w-24 flex items-center justify-center"
                        onClick={() => handleCellClick(index)}
                    >
                        {cell == '' ? '' : cell == state.player_x ? (
                            <X size={64} />
                        ) : (
                            <Circle size={45} />
                        )}
                    </div>
                );
            })}

            {winningCombination && <div style={getLineStyle(winningCombination)}></div>}
        </div>
    );
};
