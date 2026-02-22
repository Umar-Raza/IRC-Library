import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/Firebase";

const AuthContext = createContext();

const LIBRARIAN_EMAIL = "almadinatulilmia.fsd@dawateislami.net";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = () => signOut(auth);

    const isLibrarian = user?.email === LIBRARIAN_EMAIL;

    return (
        <AuthContext.Provider value={{ user, loading, logout, isLibrarian }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);