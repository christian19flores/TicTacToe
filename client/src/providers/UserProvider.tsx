import React, { useReducer, ReactNode } from 'react';
import { UserState, UserAction } from '../types';
import UserContext from '../contexts/UserContext';

const initialState: UserState = {
    username: '',
    email: '',
    wins: 0,
    losses: 0,
    draws: 0,
};

function reducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                wins: action.payload.wins,
                losses: action.payload.losses,
                draws: action.payload.draws,
                isAuthenticated: true, // Set authentication to true on login
            };
        case 'LOGOUT':
            return {
                ...state,
                username: '',
                email: '',
                wins: 0,
                losses: 0,
                draws: 0,
                isAuthenticated: false, // Set authentication to false on logout
            };
        default:
            return state;
    }
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }): ReactNode => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};