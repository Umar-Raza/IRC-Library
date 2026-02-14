import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal sticky bottom-0 w-full footer-center bg-base-100 shadow-[0_-3px_6px_-1px_rgba(0,0,0,0.07)] text-base-content p-4 z-10">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by <Link to="/" className='link-hover hover:text-neutral'>IRC FSD</Link>, Develop by <a href="http://mu-portfolio.web.app" className="link link-hover hover:text-neutral italic">Muhammad Umar</a> </p>
            </aside>
        </footer>
    )
}
