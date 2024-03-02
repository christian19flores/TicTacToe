export interface UserState {
    username: string;
    email: string;
}

export type UserAction = | { type: 'SET_USER'; payload: { username: string; email: string } };