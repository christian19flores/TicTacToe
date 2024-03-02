import React from 'react';
import { UserState, UserAction } from '../types';

interface UserContextType {
    state: UserState;
    dispatch: React.Dispatch<UserAction>;
}

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;