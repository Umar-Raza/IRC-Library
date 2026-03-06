import { useAuth } from '@/context/AuthContext';
import { LogIn, SquareLibrary } from 'lucide-react'
import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

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
        <header className={`navbar px-3 sm:px-21 w-full flex items-center justify-between fixed top-0 z-50 bg-base-100 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
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
                        {/* <li><Link to="/IRCLibrary" className='btn btn-md btn-neutral btn-ghost'>About</Link></li>
                        <li><Link to="/IRCLibrary" className='btn btn-md btn-neutral btn-ghost'>Contact</Link></li> */}
                        <li><button onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className='btn btn-md btn-neutral btn-ghost justify-center'>About</button></li>
                        <li><button onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className='btn btn-md btn-neutral btn-ghost justify-center'>Contact</button></li>

                        
                    </ul>
                </div>
            </div>
            <div className='navbar-center flex items-center justify-center gap-3 group font-sans'>
                <SquareLibrary className="text-neutral w-6 h-6 sm:w-9 sm:h-9" />
                <Link to="/">
                    <span className="text-lg sm:text-2xl font-bold text-neutral group-hover:text-[#457b9d] transition-colors">
                        <span className="hidden sm:inline">Islamic Research Center</span>
                        <span className="sm:hidden text-md">IRC</span>
                    </span>
                </Link>
            </div>

            <div className="navbar-end flex items-end gap-4">
                {user ? (
                    <div className="dropdown dropdown-end dropdown-bottom">
                        <div tabIndex={0} role="button" className="btn p-0 mask mask-squircle avatar">
                            <div className="w-10 mask mask-squircle bg-neutral text-neutral-content flex items-center justify-center">
                                <span className="text-sm font-bold">
                                    {user.displayName
                                        ? user.displayName.split(' ').map(name => name.charAt(0).toUpperCase()).join('')
                                        : user.email.charAt(0).toUpperCase()
                                    }
                                </span>
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-65 p-2 shadow max-h-60">
                            <div className="px-3 py-2 text-xs text-base-content/60 truncate">{user.email}</div>
                            <li>
                                {user.email === "almadinatulilmia.fsd@dawateislami.net" ? (
                                    <a onClick={() => navigate('/librarian-dashboard')}>Librarian Dashboard</a>
                                ) : (
                                    <a onClick={() => navigate('/IRCLibrary')}>IRC Library</a>
                                )}
                            </li>
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="btn btn-neutral btn-md gap-2 transition-all"
                    >
                        <span className="hidden sm:inline">Login</span>
                        <LogIn size={18} />
                    </Link>
                )}
            </div>
        </header>
    )
}
