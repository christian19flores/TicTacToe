export interface UserState {
    id: string;
    username: string;
    email: string;
    isAuthenticated: boolean; // Added to track authentication status
    wins: number;
    losses: number;
    draws: number;
}

export type UserAction =
    | {
        type: 'SET_USER'; 
        payload: {
            id: string;
            username: string;
            email: string,
            wins: number,
            losses: number,
            draws: number
        }
    }
    | { type: 'LOGOUT' }; // Example action for logout


export interface GameMove {
    move: number;
    position: number;
    player: string;
}

export interface PlayerState {
    player_char: string;
    isTurn: boolean;
}

export interface GameState {
    moves: GameMove[];
    playerX: {
        id: string;
        username: string;
        email: string;
        wins: number;
        losses: number;
        draws: number;
    };
    playerO: {
        id: string;
        username: string;
        email: string;
        wins: number;
        losses: number;
        draws: number;
    };
    winner: string;
    status: string;
}