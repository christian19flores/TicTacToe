import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";

interface MainContainerProps {
    children: React.ReactNode;
}

export default function MainContainer({ children }: MainContainerProps) {
    let context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    const { state, dispatch } = context;

    useEffect(() => {
        // check if the user has session
        let refresh = async () => {
            if (!localStorage.getItem('wf-ttt')) {
                return;
            }

            let response = await fetch('http://localhost:3000/api/v1/auth/refresh-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('wf-ttt')}`
                },
            });
            
            let data = await response.json();
            if (response.status === 200 && data.user) {
                dispatch({
                    type: 'SET_USER',
                    payload: {
                        username: data.user.username,
                        email: data.user.email,
                        wins: data.user.wins,
                        losses: data.user.losses,
                        draws: data.user.draws,
                    }
                });
            }
        }

        refresh();
    }, []);

    return (
        <div className="h-screen bg-base-100">
            {children}
        </div>
    );
};
