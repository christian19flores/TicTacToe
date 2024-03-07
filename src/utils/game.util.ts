export const isUsersTurn = async (user:any, game: any) => {
    if (game.moves.length === 0) {
        return user.userId === game.playerX;
    }
    const lastMove = game.moves[game.moves.length - 1];
    return lastMove && lastMove.player !== user.userId;
}

export const isValidMove = async (move: number, game: any) => {
    return game.moves.every((m: any) => m.position !== move);
}

export const isEndingMove = async (game: any) => {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    const moves = game.moves;
    const playerMoves = {
        X: moves.filter((m: any) => m.player === game.playerX).map((m: any) => m.position),
        O: moves.filter((m: any) => m.player === game.playerO).map((m: any) => m.position)
    };
    return winningCombos.some((combo: any) => {
        return combo.every((position: any) => playerMoves.X.includes(position)) ||
            combo.every((position: any) => playerMoves.O.includes(position));
    });
}

// take in the game and determine if the game has ended
// if it has ended return 'win' or 'draw'
export const determineEndingStatus = async (game: any) => {
    if (await isEndingMove(game)) {
        return 'win';
    }
    if (game.moves.length === 9) {
        return 'draw';
    }
    return 'in_progress';
}
