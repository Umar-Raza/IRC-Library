import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, SquareLibrary } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logout successful");
            navigate('/');
        } catch (error) {
            toast.error("Logout failed");
        }
    };
    return (
        <header className="navbar shadow-sm px-3 sm:px-21 w-full flex items-center justify-between sticky top-0 z-50 bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/" className='btn btn-md btn-neutral btn-ghost'>Home</Link></li>
                        <li><Link to="/IRCLibrary" className='btn btn-md btn-neutral btn-ghost'>IRC Library</Link></li>
                    </ul>
                </div>
            </div>

            <div className='navbar-center flex items-center justify-center gap-3 group font-sans'>
                <SquareLibrary className="text-neutral w-6 h-6 sm:w-9 sm:h-9" />
                <Link to="/">
                    <span className="text-lg sm:text-2xl font-bold text-neutral group-hover:text-[#457b9d] transition-colors">
                        <span className="hidden sm:inline">Islamic Research Center Library</span>
                        <span className="sm:hidden text-sm">IRC Library</span>
                    </span>
                </Link>
            </div>

            <div className="navbar-end flex items-end gap-4">
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                            {/* <span className="text-sm font-bold text-neutral leading-none">Librarian</span> */}
                            <span className="text-xs text-base-content/60">{user.email}</span>
                            {user.email === "almadinatulilmia.fsd@dawateislami.net" && (
                                <button className='btn-link cursor-pointer hover:text-neutral' onClick={() => navigate('/librarian-dashboard')}>Librarian Dashboard</button>
                            )}
                            {user.email !== "almadinatulilmia.fsd@dawateislami.net" && (
                                <button className='btn-link cursor-pointer hover:text-neutral' onClick={() => navigate('/IRCLibrary')}>IRC Library</button>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn btn-error btn-dash btn-outline btn-sm sm:btn-md gap-2  transition-all"
                        >
                            <span className="hidden sm:inline">Logout</span>
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="btn btn-neutral btn-dash btn-outline btn-sm sm:btn-md gap-2  transition-all"
                    >
                        <span className="hidden sm:inline">Login</span>
                        <LogIn size={18} />
                    </Link>
                )}
            </div>
        </header>
    )
}
