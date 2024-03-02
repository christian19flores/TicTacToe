import React, { useReducer, ReactNode } from 'react';
import { UserState, UserAction } from '../types';
import UserContext from '../contexts/UserContext';

const initialState: UserState = {
    username: '',
    email: '',
};

function reducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
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