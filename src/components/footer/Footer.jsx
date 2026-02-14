import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <footer className="footer footer-center sticky bottom-0 w-full bg-base-100 shadow-[0_-3px_6px_-1px_rgba(0,0,0,0.07)] text-base-content p-4 z-10">
            <aside>
                <p className="text-xs sm:text-sm leading-relaxed text-center">
                    Copyright © {new Date().getFullYear()} - All right reserved by <Link to="/" className='link-hover hover:text-neutral font-semibold'>IRC FSD</Link>
                    <span className="block sm:inline sm:ml-1">
                        , Developed by <a href="http://mu-portfolio.web.app" className="link link-hover hover:text-neutral italic">Muhammad Umar</a>
                    </span>
                </p>
            </aside>
        </footer>
    )
}
