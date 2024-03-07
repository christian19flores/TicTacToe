import { Fragment, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Menu as Bars, X, Bell } from 'lucide-react'
import UserContext from '../contexts/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

interface NavbarProps {

}

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Leaderboard', href: '/leaderboard', current: false },
]
const userNavigation = [
    { name: 'History', href: '/history' },
    { name: 'Sign out', href: '/logout' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({ }: NavbarProps) {
    let navigate = useNavigate();
    const context = useContext(UserContext);
    const { addToast } = useToast();

    if (!context) throw new Error('useUser must be used within a UserProvider');

    const { state } = context;

    let handleLogout = () => {
        // clear the token
        localStorage.removeItem('wr-ttt');
        // clear the user context
        context.dispatch({
            type: 'LOGOUT',
        });
    }

    let handleNewGame = async () => {
        // send api request
        await fetch('http://localhost:3000/api/v1/game/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('wr-ttt')}`
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (!data.game) {
                    console.error('Error starting a new game');
                    addToast('Error starting a new game', 'error')
                    return;
                }

                // redirect to the game page
                // I am using .href so that there is a full page refresh
                // This is to ensure that the socket connection is re-established
                // and state is re-initialized
                window.location.href = `/game/${data.game.game_id}`;
            })
            .catch((error) => {
                console.error(error);
                addToast('Error starting a new game', 'error')
            });
    }

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="-ml-2 mr-2 flex items-center md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <X className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="./icon.webp"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {state.isAuthenticated && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleNewGame()}
                                        >
                                            New Game
                                        </button>
                                    )}
                                </div>
                                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">

                                    {/* Profile dropdown */}
                                    {!state.isAuthenticated && (
                                        <Link
                                            to="/login"
                                            className="relative inline-flex btn btn-sm btn-primary"
                                        >
                                            Login
                                        </Link>
                                    )}
                                    {state.isAuthenticated && (
                                        <Menu as="div" className="relative">
                                            <div>
                                                <Menu.Button className="relative flex btn btn-sm ">
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    {/* <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" /> */}
                                                    {state.isAuthenticated && (state.username || state.email)}
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigation.map((item) => (
                                                        <Menu.Item key={item.name}>
                                                            {({ active }) => (
                                                                <Link
                                                                    to={item.href}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}

                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pb-3 pt-4">
                            <div className="flex items-center px-5 sm:px-6">
                                <div className="flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-400">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-2 sm:px-3">
                                {userNavigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                                <Disclosure.Button
                                    as="a"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </Disclosure.Button>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};
