import { SquareLibrary } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const Footer = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleSubscribe = () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address.')
            return
        }
        toast.success('Subscribed successfully!')
        setEmail('')
    }

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
        <footer className="bg-base-100 border-t border-base-300">

            {/* Top section */}
            <div className="container mx-auto px-6 sm:px-10 py-10 flex flex-col items-center gap-8">

                {/* Logo */}
                <div className='navbar-center flex items-center justify-center gap-3 group font-sans'>
                    <SquareLibrary className="text-neutral w-6 h-6 sm:w-9 sm:h-9" />
                    <Link to="/">
                        <span className="text-lg sm:text-2xl font-bold text-neutral group-hover:text-[#457b9d] transition-colors">
                            <span className="hidden sm:inline">Islamic Research Center</span>
                            <span className="sm:hidden text-md">IRC</span>
                        </span>
                    </Link>
                </div>

                {/* Nav links */}
                <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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

            {/* Divider */}
            <div className="border-t border-base-300" />

            {/* Bottom section */}
            <div className="container mx-auto px-6 sm:px-10 py-5 flex flex-col items-center justify-center gap-4">
                <p className="text-xs sm:text-sm leading-relaxed text-center">
                    Copyright © {new Date().getFullYear()} - All right reserved by{' '}
                    <Link to="/" className='link-hover hover:text-neutral font-semibold'>IRC FSD</Link>
                    <span className="block sm:inline sm:ml-1">
                        , Developed with ❤️ by{' '}
                        <a href="http://mu-portfolio.web.app" target='_blank' className="link link-hover hover:text-neutral font-semibold">
                            Muhammad Umar
                        </a>
                    </span>
                </p>
            </div>
        </footer>
    )
}