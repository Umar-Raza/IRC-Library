import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home/Home.jsx'
import { LibrarianLogin } from './dashboard/auth/librarianLogin/LibrarianLogin.jsx'
import { LibrarianDashboard } from './dashboard/librarianDasboard/LibrarianDashboard.jsx'
import { Navbar } from '@/components/navbar/Navbar.jsx'
import { Footer } from '@/components/footer/Footer.jsx'
import { Toaster } from 'react-hot-toast'
import { ProtectedRouteForLibrarian } from './dashboard/auth/ProtectedRouteForLibrarian.jsx'
import { PublicRouteForLibrarian } from './dashboard/auth/PublicRouteForLibrarian.jsx'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { NoPage } from './noPage/Nopage.jsx'
const index = () => {
    return (
        <AuthProvider>
            <Navbar />
            <main className='flex-1 flex flex-col'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/librarian-login' element={
                        <PublicRouteForLibrarian>
                            <LibrarianLogin />
                        </PublicRouteForLibrarian>} />
                    <Route path='/librarian-dashboard' element={
                        <ProtectedRouteForLibrarian>
                            <LibrarianDashboard />
                        </ProtectedRouteForLibrarian>} />
                    <Route path='*' element={<NoPage />} />
                </Routes>
            </main>
            <Toaster />
            <Footer />
        </AuthProvider>
    )
}


export default index;