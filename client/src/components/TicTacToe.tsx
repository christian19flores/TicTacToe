import { Circle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GameMove, GameState, PlayerState } from "../types";
import { motion } from "framer-motion";

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

    useEffect(() => {
        if (!state.moves || state.moves.length === 0) return;
        let newGameBoard = Array(9).fill('');
        console.log('State:', state)
        state.moves.forEach((move) => {
            newGameBoard[move.position] = move.player;
        });
        setGameBoard(newGameBoard);

        // Check if state is complete
        if (state.status == 'completed') {
            console.log('Game over');
            let winningCombination = findWinningCombination();
            setWinningCombination(winningCombination);
            console.log('Winning combination:', winningCombination)
        } else {
            setWinningCombination(null);
        }
    }, [state]);

    let handleCellClick = (index: number) => {
        // Make sure player is
        // 1. Using their turn
        // 2. The game is not complete
        // 3. The game is has started
        if (!playerState.isTurn || state.status == 'completed' || state.status == 'pendeng') {
            console.log('Game is not in progress or it is not your turn');
            return;
        } else {
            // Set the game board on FE to reflect the move
            // This is to give the user immediate feedback
            let newGameBoard = [...gameBoard];
            let playerId = playerState.player_char == state.player_x ? state.player_x : state.player_o;
            newGameBoard[index] = playerId as string;

            setGameBoard(newGameBoard);

            // Make a move
            makeMove(index);
        }
    }

    let findWinningCombination = () => {
        let winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < winningCombos.length; i++) {
            let [a, b, c] = winningCombos[i];
            let movesA = state.moves.find(move => move.position === a);
            let movesB = state.moves.find(move => move.position === b);
            let movesC = state.moves.find(move => move.position === c);

            if (movesA && movesB && movesC &&
                movesA.player === movesB.player && movesA.player === movesC.player) {
                return winningCombos[i];
            }
        }
        return null;
    }

    let getLineStyle = (winningCombination: number[]) => {
        let lineStyle: React.CSSProperties = {
            position: 'absolute',
            width: '6px',
            height: '100%',
            backgroundColor: '#ff865b',
            transformOrigin: 'center',
            zIndex: 1,
            borderRadius: '5px',
        };

        if (winningCombination[0] === 0 && winningCombination[1] === 1 && winningCombination[2] === 2) {
            console.log('Top row');
            lineStyle.top = 'calc(16.66% - 4px)';
            lineStyle.left = '0';
            lineStyle.right = '0';
            lineStyle.height = '6px';
            lineStyle.width = '100%';
            lineStyle.transform = 'translateY(-50%)';
        } else if (winningCombination[0] === 3 && winningCombination[1] === 4 && winningCombination[2] === 5) {
            console.log('Middle row');
            lineStyle.top = 'calc(50% - 3px)';
            lineStyle.left = '0';
            lineStyle.right = '0';
            lineStyle.height = '6px';
            lineStyle.width = '100%';
            lineStyle.transform = 'translateY(-50%)';
        } else if (winningCombination[0] === 6 && winningCombination[1] === 7 && winningCombination[2] === 8) {
            console.log('Bottom row');
            lineStyle.top = 'calc(83.33% - 2px)';
            lineStyle.left = '0';
            lineStyle.right = '0';
            lineStyle.height = '6px';
            lineStyle.width = '100%';
            lineStyle.transform = 'translateY(-50%)';
        } else if (winningCombination[0] === 0 && winningCombination[1] === 3 && winningCombination[2] === 6) {
            console.log('Left column');
            lineStyle.top = '0';
            lineStyle.bottom = '0';
            lineStyle.left = 'calc(16.66% - 4px)';
            lineStyle.width = '6px';
            lineStyle.transform = 'translateX(-50%)';
        } else if (winningCombination[0] === 1 && winningCombination[1] === 4 && winningCombination[2] === 7) {
            console.log('Middle column');
            lineStyle.top = '0';
            lineStyle.bottom = '0';
            lineStyle.left = 'calc(50% - 2px)';
            lineStyle.width = '6px';
            lineStyle.transform = 'translateX(-50%)';
        } else if (winningCombination[0] === 2 && winningCombination[1] === 5 && winningCombination[2] === 8) {
            console.log('Right column');
            lineStyle.top = '0';
            lineStyle.bottom = '0';
            lineStyle.left = 'calc(83.33% - 2px)';
            lineStyle.width = '6px';
            lineStyle.transform = 'translateX(-50%)';
        } else if (winningCombination[0] === 0 && winningCombination[1] === 4 && winningCombination[2] === 8) {
            console.log('Diagonal l to r');
            lineStyle.top = '0';
            lineStyle.bottom = '0';
            lineStyle.left = 'calc(50% - 2px)';
            lineStyle.right = '0';
            lineStyle.transform = 'rotate(45deg)';
        } else if (winningCombination[0] === 2 && winningCombination[1] === 4 && winningCombination[2] === 6) {
            console.log('Reverse diagonal');
            lineStyle.top = '0';
            lineStyle.bottom = '0';
            lineStyle.left = 'calc(50% - 2px)';
            lineStyle.right = '0';
            lineStyle.transform = 'rotate(-45deg)';
        }

        return lineStyle;
    }
    const symbolVariants = {
        initial: { scale: 0 },
        animate: {
            scale: 1,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
            },
        },
    };

    const lineVariants = {
        initial: { scale: 0, rotate: 0 },
        initialDiagonal: { scale: 0, rotate: -45 },
        initialReverseDiagonal: { scale: 0, rotate: 45 },
        animate: { scale: 1, rotate: 0, transition: { duration: 0.5 } },
        diagonal: { scale: 1, rotate: -45, transition: { duration: 0.5 } },
        reverseDiagonal: { scale: 1, rotate: 45, transition: { duration: 0.5 } },
    };

    return (
        <div className="grid grid-cols-3 grid-flow-row bg-white gap-1 relative">
            {gameBoard.map((cell, index) => {
                return (
                    <div
                        key={index}
                        className="bg-base-100 h-24 w-24 flex items-center justify-center"
                        onClick={() => handleCellClick(index)}
                    >
                        {state.player_o === '' || state.player_x === '' ? null :
                            cell === state.player_x ? (
                                <motion.div
                                    variants={symbolVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="flex items-center justify-center"
                                >
                                    <X size={64} />
                                </motion.div>
                            ) : cell === state.player_o ? (
                                <motion.div
                                    variants={symbolVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="flex items-center justify-center"
                                >
                                    <Circle size={45} />
                                </motion.div>
                            ) : null}

                    </div>
                );
            })}

            {winningCombination && (
                <motion.div
                    style={getLineStyle(winningCombination)}
                    variants={lineVariants}
                    initial={winningCombination[0] === 0 && winningCombination[1] === 4 && winningCombination[2] === 8
                        ? 'initialDiagonal'
                        : winningCombination[0] === 2 && winningCombination[1] === 4 && winningCombination[2] === 6
                            ? 'initialReverseDiagonal'
                            : 'initial'
                        }
                    animate={
                        winningCombination[0] === 0 && winningCombination[1] === 4 && winningCombination[2] === 8
                            ? 'diagonal'
                            : winningCombination[0] === 2 && winningCombination[1] === 4 && winningCombination[2] === 6
                                ? 'reverseDiagonal'
                                : 'animate'
                    }
                ></motion.div>
            )}
        </div>
    );
};