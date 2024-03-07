import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function Login() {
    const context = useContext(UserContext);
    let navigate = useNavigate();

    if (!context) throw new Error('useUser must be used within a UserProvider');

    const { state, dispatch } = context;

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    let [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    let handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Perform form validation
        let validationErrors = {
            email: '',
            password: '',
        };

        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = 'Invalid email format';
        }

        if (!password) {
            validationErrors.password = 'Password is required';
        }

        if (validationErrors.email || validationErrors.password) {
            setErrors(validationErrors);
            return;
        }

        await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((resp) => {
                if (resp.status !== 200) {
                    return resp.json().then((data) => {
                        // handle error
                    });
                }
                return resp.json();
            })
            .then(data => {
                dispatch({
                    type: 'SET_USER',
                    payload: {
                        id: data.user.id,
                        username: data.user.username,
                        email: data.user.email,
                        wins: data.user.wins,
                        losses: data.user.losses,
                        draws: data.user.draws,
                    }
                });

                localStorage.setItem('wr-ttt', data.token);

                // Redirect to leaderboard
                navigate('/leaderboard');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

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
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            {errors.email && (
                                <div className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
                                </div>
                            )}
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Password</span>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            {errors.password && (
                                <div className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </div>
                            )}
                        </label>

                        <div>
                            <button
                                type="submit"
                                className="btn btn-block btn-primary"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>

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
}