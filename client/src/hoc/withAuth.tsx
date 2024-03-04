import React, { ComponentType, useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Updated for React Router v6
import UserContext from '../contexts/UserContext';

interface Props {
    // You can extend this interface to include any additional props as needed
}

function withAuth<T extends Props>(WrappedComponent: ComponentType<T>) {
    const WithAuthComponent = (props: Omit<T, keyof Props>) => {
        const { state } = useContext(UserContext);

        if (!state.isAuthenticated  && !localStorage.getItem('wr-ttt')) {
            // Redirect to the login page if not authenticated
            // Using Navigate component from React Router v6 for redirection
            return <Navigate to="/login" replace />;
        }

        return <WrappedComponent {...(props as T)} />;
    };

    // Optionally set display name for better debugging
    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithAuthComponent;
}

export default withAuth;