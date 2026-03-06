import { Link } from 'react-router-dom'

export const Footer = () => {

    return (
        <footer className="bg-base-100 border-t border-base-300">
            <div className="border-t border-base-300" />
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