export interface UserState {
    username: string;
    email: string;
    isAuthenticated: boolean; // Added to track authentication status
    wins: number;
    losses: number;
    draws: number;
}

export type UserAction =
    | { type: 'SET_USER'; payload: { username: string; email: string, wins: number, losses: number, draws: number } }
    | { type: 'LOGOUT' }; // Example action for logout
