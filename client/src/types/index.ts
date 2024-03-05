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
    player_x: string;
    player_o: string;
    winner: string;
    status: string;
}