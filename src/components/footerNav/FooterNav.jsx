import { SquareLibrary } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const FooterNav = () => {

    const handleHashNav = (hash) => {
        if (window.location.pathname === '/') {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        } else {
            navigate('/')
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
            }, 300)
        }
    }

    const links = [
        { label: 'Home', to: '/' },
        { label: 'IRC Library', to: '/IRCLibrary' },
        { label: 'About', hash: 'about' },
        { label: 'Register', to: '/readerRegister' },
        { label: 'Contact', hash: 'contact' },
    ]

    return (
        <div className="container mx-auto px-6 sm:px-10 py-10  flex flex-col items-center gap-8 border-t border-base-300">
            <div className='navbar-center flex items-center justify-center gap-3 group font-sans'>
                <SquareLibrary className="text-neutral w-6 h-6 sm:w-9 sm:h-9" />
                <Link to="/">
                    <span className="text-lg sm:text-2xl font-bold text-neutral group-hover:text-[#457b9d] transition-colors">
                        <span className="hidden sm:inline">Islamic Research Center</span>
                        <span className="sm:hidden text-md">IRC</span>
                    </span>
                </Link>
            </div>
            <nav className="flex flex-row flex-nowrap items-center justify-center gap-x-4 sm:gap-x-8">
                {links.map((link, i) =>
                    link.hash ? (
                        <button
                            key={i}
                            onClick={() => handleHashNav(link.hash)}
                            className="text-sm text-base-content/60 hover:text-neutral hover:underline transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                        >
                            {link.label}
                        </button>
                    ) : (
                        <Link
                            key={i}
                            to={link.to}
                            className="text-sm text-base-content/60 hover:text-neutral hover:underline transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    )
                )}
            </nav>
        </div>
    )
}
