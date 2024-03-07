import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
    let navigate = useNavigate();

    let [email, setEmail] = useState('');
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    let [errors, setErrors] = useState({
        email: '',
        username: '',
        password: '',
    });

    let handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Perform form validation
        let validationErrors = {
            email: '',
            username: '',
            password: '',
        };

        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = 'Invalid email format';
        }

        if (!username) {
            validationErrors.username = 'Username is required';
        }

        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters long';
        }

        if (validationErrors.email || validationErrors.username || validationErrors.password) {
            setErrors(validationErrors);
            return;
        }

        fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                username,
                password,
            }),
        })
            .then((resp) => {
                if (resp.status !== 200) {
                    return resp.json().then((data) => {
                        console.log(data);
                    });
                }
                return resp.json();
            })
            .then((data) => {
                navigate('/login');
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
                        Register to play Tic Tac Toe
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-2" onSubmit={handleFormSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Username</span>
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                            {errors.username && (
                                <div className="label">
                                    <span className="label-text-alt text-error">{errors.username}</span>
                                </div>
                            )}
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
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
                                autoComplete="new-password"
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

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="btn btn-block btn-primary"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-400">
                        Already a member?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}