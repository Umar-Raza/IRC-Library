import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/config/Firebase";

const AuthContext = createContext();
const LIBRARIAN_EMAIL = "almadinatulilmia.fsd@dawateislami.net";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [readerName, setReaderName] = useState(null);
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        let readerUnsubscribe = null; // reader status listener cleanup

        const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);

            // Old reader status listener cleanup if user changes
            if (readerUnsubscribe) {
                readerUnsubscribe();
                readerUnsubscribe = null;
            }

            if (currentUser && currentUser.email !== LIBRARIAN_EMAIL) {
                // user request status real-time change
                const q = query(
                    collection(firestore, 'readerRequests'),
                    where('email', '==', currentUser.email)
                );

                readerUnsubscribe = onSnapshot(q, (snap) => {
                    if (!snap.empty) {
                        const data = snap.docs[0].data();
                        setIsApproved(data.status === 'approved');
                        setReaderName(data.name);
                    } else {
                        setIsApproved(false);
                        setReaderName(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Reader status error:", error);
                    setIsApproved(false);
                    setReaderName(null);
                    setLoading(false);
                });

            } else {
                setIsApproved(false);
                setReaderName(null);
                setLoading(false);
            }
        });

        return () => {
            authUnsubscribe();
            if (readerUnsubscribe) readerUnsubscribe();
        };
    }, []);

    const logout = () => signOut(auth);
    const isLibrarian = user?.email === LIBRARIAN_EMAIL;

    return (
        <AuthContext.Provider value={{ user, loading, logout, isLibrarian, readerName, isApproved }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);