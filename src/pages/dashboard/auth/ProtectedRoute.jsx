import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// لائبریرین کے لیے
export const ProtectedRouteForLibrarian = ({ children }) => {
    const { user, isLibrarian, loading } = useAuth();
    if (loading) return <div className="flex-1 flex items-center justify-center"><span className="loading loading-spinner loading-lg text-neutral"></span></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!isLibrarian) return <Navigate to="/IRCLibrary" replace />;
    return children;
};

// Reader کے لیے — approved ہونا ضروری ہے
export const ProtectedRouteForReader = ({ children }) => {
    const { user, isLibrarian, isApproved, loading } = useAuth();
    if (loading) return <div className="flex-1 flex items-center justify-center"><span className="loading loading-spinner loading-lg text-neutral"></span></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (isLibrarian) return children;
    if (!isApproved) return <Navigate to="/pending" replace />;
    return children;
};

// Pending page کے لیے — صرف logged-in pending reader کو دکھائیں
export const ProtectedRouteForPending = ({ children }) => {
    const { user, isLibrarian, isApproved, loading } = useAuth();
    if (loading) return <div className="flex-1 flex items-center justify-center"><span className="loading loading-spinner loading-lg text-neutral"></span></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (isLibrarian) return <Navigate to="/librarian-dashboard" replace />;
    if (isApproved) return <Navigate to="/IRCLibrary" replace />;
    return children;
};