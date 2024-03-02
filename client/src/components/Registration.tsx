import { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterProps {

}

export default function Register({ }: RegisterProps) {
    let [email, setEmail] = useState('');
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    let handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                console.log(data);
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
                    <form className="space-y-2" action="#" method="POST">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Username</span>
                                {/* <span className="label-text-alt">Top Right label</span> */}
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="username"
                                autoComplete="username"
                                required
                                className="input input-bordered w-full"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                            {/* <div className="label">
                                <span className="label-text-alt">Bottom Left label</span>
                            </div> */}
                        </label>

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
};
