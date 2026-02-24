import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// لائبریرین کے لیے
export const ProtectedRouteForLibrarian = ({ children }) => {
    const { user, isLibrarian } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!isLibrarian) return <Navigate to="/IRCLibrary" replace />;
    return children;
};

// Reader کے لیے — approved ہونا ضروری ہے
export const ProtectedRouteForReader = ({ children }) => {
    const { user, isLibrarian, isApproved } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    // لائبریرین کو access ہے
    if (isLibrarian) return children;

    // Reader approved نہیں ہے
    if (!isApproved) return <Navigate to="/pending" replace />;

    return children;
};