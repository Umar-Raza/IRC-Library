import React from 'react'

export const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal sticky bottom-0 w-full footer-center bg-base-100 shadow-[0_-3px_6px_-1px_rgba(0,0,0,0.07)] text-base-content p-4">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
            </aside>
        </footer>
    )
}
