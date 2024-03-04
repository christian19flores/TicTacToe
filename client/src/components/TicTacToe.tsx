import { Circle, X } from "lucide-react";
import { useState } from "react";
import { GameMove } from "../types";

interface TicTacToeProps {
    state: GameMove[];
}

export default function TicTacToe({ }: TicTacToeProps) {

    let [gameBoard, setGameBoard] = useState<string[]>(Array(9).fill(''));

    let handleCellClick = (index: number) => {
        let newGameBoard = [...gameBoard];
        
        let rand = Math.floor(Math.random() * 2);
        newGameBoard[index] = rand == 0 ? 'X' : 'O';
        
        setGameBoard(newGameBoard);
    }

    return (
        <div className="grid grid-rows-3 grid-flow-col bg-white gap-1">
            {gameBoard.map((cell, index) => {
                return (
                    <div
                        key={index}
                        className="bg-base-100 h-24 w-24 flex items-center justify-center"
                        onClick={() => handleCellClick(index)}
                    >
                        {cell == '' ? '' : cell == 'X' ? (
                            <X size={64} />
                        ) : (
                            <Circle size={45} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
