import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import { useToast } from "../contexts/ToastContext";

interface LeaderboardProps {

}

const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'aorienstaoirenst@sste.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'kvkvenskevs@arst.com', role: 'Member' },
]

function Leaderboard({ }: LeaderboardProps) {
    let toast = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        let findTop5 = async () => {
            let response = await fetch('http://localhost:3000/api/v1/leaderboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            let data = await response.json();
            if (response.status === 200 && data) {
                setLeaderboard(data);
            } else {
                console.error('Error fetching leaderboard');
                toast.addToast('Could not fetch leaderboard', 'error');
            }
        }

        findTop5();
    }, []);

    return (
        <div className="pt-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-5xl font-semibold text-base-content">Leaderboard</h1>
                    <p className="mt-2 text-sm text-neutral-content">
                        Top 5 users by wins
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-content sm:pl-0">
                                        User
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-content">
                                        Wins
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-content">
                                        Losses
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-content">
                                        Draws
                                    </th>
                                    {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* {people.map((person) => (
                                    <tr key={person.email}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {person.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                Edit<span className="sr-only">, {person.name}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))} */}
                                {leaderboard.map((person: any) => (
                                    <tr key={person.username}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-base-content sm:pl-0">
                                            {person.username}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">{person.wins}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">{person.losses}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">{person.draws}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Leaderboard);