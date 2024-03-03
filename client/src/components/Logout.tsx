import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { Navigate, useNavigate } from "react-router-dom";

interface LogoutProps {
    
}

export default function Logout({}: LogoutProps) {
    let context = useContext(UserContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    const { dispatch } = context;
    
    useEffect(() => {
        localStorage.removeItem('wf-ttt');

        // clear the user context
        dispatch({
            type: 'LOGOUT'
        });
    }, []);

    return (
        <Navigate to="/login" replace />
    );
};
