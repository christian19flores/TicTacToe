import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

interface LoginProps {

}

export default function Login({ }: LoginProps) {
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used within a UserProvider');

    const {state, dispatch} = context;

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    let handleFormSubmit = async () => {
        console.log('Form submitted');
        let resp = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        let data = await resp.json();

        console.log(resp);
        if (resp.status !== 200) {
            console.log(data);
            return;
        }

        dispatch({
            type: 'SET_USER',
            payload: {
                username: data.user.username,
                email: data.user.email
            }
        })

        console.log(data);
        console.log('User logged in');
    }

    useEffect(() => {
        console.log('Email changed');
        console.log(state.email);
    }, [state.email]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="./icon.webp"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Sign in to play Tic Tac Toe
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Email</span>
                                {/* <span className="label-text-alt">Top Right label</span> */}
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input input-bordered w-full"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            {/* <div className="label">
                                <span className="label-text-alt">Bottom Left label</span>
                            </div> */}
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Password</span>
                                {/* <span className="label-text-alt">Top Right label</span> */}
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="input input-bordered w-full"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            {/* <div className="label">
                                <span className="label-text-alt">Bottom Left label</span>
                            </div> */}
                        </label>

                        <div>
                            <button
                                onClick={() => handleFormSubmit() }
                                className="btn btn-block btn-primary"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-400">
                        Not a member?{' '}
                        <Link to="/register" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
                            Make a new account
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};
function dispatch(arg0: { type: string; payload: { username: any; email: any; }; }) {
    throw new Error("Function not implemented.");
}

