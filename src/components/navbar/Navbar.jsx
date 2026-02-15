import { useAuth } from '@/context/AuthContext';
import { Library, LogIn, LogOut } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logout successful");
            navigate('/librarian-login');
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <header className="navbar shadow-sm px-10 w-full flex items-center  justify-between sticky top-0 z-50 bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/" className='btn btn-sm btn-neutral btn-ghost'>Home</Link></li>
                        <li><Link to="/" className='btn btn-sm btn-neutral btn-ghost'>Social Media </Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-link text-2xl"><Library />IRC Library</Link>
            </div>
            <div className="navbar-center">
                <ul className="menu menu-horizontal">
                    <li><Link to="/" className='btn btn-sm btn-neutral btn-ghost text-xl'>Home</Link></li>
                    <li><Link to="/" className='btn btn-sm btn-neutral btn-ghost text-xl'>Social Media</Link></li>
                </ul>
            </div>

            <div className="navbar-end flex items-end gap-4">
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                            {/* <span className="text-sm font-bold text-neutral leading-none">Librarian</span> */}
                            <span className="text-xs text-base-content/60">{user.email}</span>
                            <button className='btn-link cursor-pointer hover:text-neutral' onClick={() => navigate('/librarian-dashboard')}>Librarian Dashboard</button>
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
                        to="/librarian-login"
                        className="btn btn-neutral btn-dash btn-outline btn-sm sm:btn-md gap-2  transition-all"
                    >
                        Login
                        <LogIn size={18} />
                    </Link>
                )}
            </div>
        </header>
    )
}
