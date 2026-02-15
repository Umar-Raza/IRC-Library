import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/Firebase";

// 1. کنٹیکسٹ بنانا
const AuthContext = createContext();

// 2. پرووائیڈر بنانا (یہ پوری ایپ کو ڈیٹا فراہم کرے گا)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // فائر بیس کا یہ فنکشن خود بخود چیک کرتا ہے کہ یوزر لاگ ان ہے یا نہیں
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // یہاں آپ اپنی مخصوص ای میل کی شرط بھی لگا سکتے ہیں
            if (currentUser && currentUser.email === "umar@gmail.com") {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // صفائی (Cleanup)
    }, []);

    const logout = () => {
        localStorage.removeItem("librarian"); // لوکل سٹوریج صاف کریں
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. کسٹم ہک (تاکہ استعمال میں آسانی ہو)
export const useAuth = () => useContext(AuthContext);