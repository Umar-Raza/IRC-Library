import { Library, LogIn } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <header className="navbar shadow-sm px-7.5 w-full flex items-center justify-between sticky top-0 z-50 bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/" className='btn btn-sm btn-neutral btn-ghost'>Home</Link></li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-link text-2xl"><Library />IRC Library</Link>
            </div>
            <div className="navbar-center  hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/" className='btn btn-sm btn-neutral btn-ghost text-xl'>Home</Link></li>
                    <li><Link to="/catalog" className='btn btn-sm btn-neutral btn-ghost text-xl'>Catalog</Link></li>

                </ul>
            </div>
            <div className="navbar-end">
                <Link to="/librarian-dashboard" className="btn btn-md btn-neutral">Login <LogIn size={20} /></Link>
            </div>
        </header>
    )
}
