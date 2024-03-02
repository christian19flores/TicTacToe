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
        let checkSession = async () => {
            let response = await fetch('http://localhost:3000/api/v1/auth/check-session');
            let data = await response.json();
            console.log(data);
            if (data.status === 200) {
                console.log('User is logged in');
                dispatch({
                    type: 'SET_USER',
                    payload: {
                        username: data.user.username,
                        email: data.user.email,
                    }
                });
            }
        }

        checkSession();
    }, []);

    return (
        <div className="h-screen bg-base-100">
            {children}
        </div>
    );
};
