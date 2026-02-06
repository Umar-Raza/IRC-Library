import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home/Home.jsx'
import { LibrarianLogin } from './dashboard/auth/librarianLogin/LibrarianLogin.jsx'
import { LibrarianDashboard } from './dashboard/librarianDasboard/LibrarianDashboard.jsx'
import { Navbar } from '@/components/navbar/Navbar.jsx'
import { Footer } from '@/components/footer/Footer.jsx'
import { Toaster } from 'react-hot-toast'
const index = () => {
    return (
        <>
            <Navbar />
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/librarian-dashboard' element={<LibrarianDashboard />} />
                </Routes>
            </main>
            <Toaster />
            <Footer />
        </>
    )
}


export default index;