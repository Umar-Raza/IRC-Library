import React from 'react'

export const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm px-[30px] lg:px-[150px] w-full flex items-center justify-between sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a>All Books</a></li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <a className="btn btn-neutral btn-ghost text-xl">IRC Library</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a className='btn btn-sm btn-neutral btn-ghost'>All Books</a></li>
                    <li>
                        <details>
                            <summary className='btn btn-sm btn-neutral btn-ghost'>Parent</summary>
                            <ul className="p-2 bg-base-100 w-40 z-1">
                                <li><a className='btn btn-sm btn-neutral btn-ghost'>Submenu 1</a></li>
                                <li><a className='btn btn-sm btn-neutral btn-ghost'>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a className='btn btn-sm btn-neutral btn-ghost'>Item 3</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn btn-sm btn-neutral">Button</a>
            </div>
        </div>
    )
}
