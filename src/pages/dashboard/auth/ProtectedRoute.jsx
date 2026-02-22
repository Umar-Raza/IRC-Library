import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// لائبریرین کے لیے — صرف لائبریرین email والا access کر سکے
export const ProtectedRouteForLibrarian = ({ children }) => {
    const { user, isLibrarian } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!isLibrarian) return <Navigate to="/IRCLibrary" replace />;
    return children;
};

// ریڈر کے لیے — کوئی بھی logged in user access کر سکے
export const ProtectedRouteForReader = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
};