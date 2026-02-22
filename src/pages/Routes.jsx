import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home/Home.jsx'
// import { Login } from './dashboard/auth/Login/Login.jsx'
import { LibrarianDashboard } from './dashboard/librarianDasboard/LibrarianDashboard.jsx'
import { Navbar } from '@/components/navbar/Navbar.jsx'
import { Footer } from '@/components/footer/Footer.jsx'
import { Toaster } from 'react-hot-toast'
import { ProtectedRouteForLibrarian } from './dashboard/auth/ProtectedRoute.jsx'
import { PublicRouteForLibrarian } from './dashboard/auth/PublicRouteForLibrarian.jsx'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { NoPage } from './noPage/Nopage.jsx'
import { BookProvider } from '@/context/BooksContext.jsx'
import { IRCLibrary } from './ircLibrary/IRCLibrary.jsx'
import { ProtectedRouteForReader } from './dashboard/auth/ProtectedRoute.jsx'
import { Login } from './dashboard/auth/Login/Login.jsx'
const index = () => {
    return (
        <AuthProvider>
            <BookProvider>
                <Navbar />
                <main className='flex-1 flex flex-col'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={
                            <PublicRouteForLibrarian>
                                <Login />
                            </PublicRouteForLibrarian>} />
                        <Route path='/IRCLibrary' element={
                            <ProtectedRouteForReader>
                                <IRCLibrary />
                            </ProtectedRouteForReader>
                        } />
                        <Route path='/librarian-dashboard' element={
                            <ProtectedRouteForLibrarian>
                                <LibrarianDashboard />
                            </ProtectedRouteForLibrarian>} />
                        <Route path='*' element={<NoPage />} />
                    </Routes>
                </main>
                <Toaster />
                <Footer />
            </BookProvider>
        </AuthProvider>
    )
}


export default index;