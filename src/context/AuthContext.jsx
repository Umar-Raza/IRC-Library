import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/config/Firebase";

const AuthContext = createContext();
const LIBRARIAN_EMAIL = "almadinatulilmia.fsd@dawateislami.net";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true); // Only for the first refresh
    const [readerName, setReaderName] = useState(null);
    const [isApproved, setIsApproved] = useState(false);
    const [isNewApproval, setIsNewApproval] = useState(false); // true only at the time of approval

    useEffect(() => {
        let readerUnsubscribe = null;
        let prevApproved = null; // track previous approval state

        const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
            setLoading(true); // Reset loading every time the user changes
            prevApproved = null;

            if (readerUnsubscribe) {
                readerUnsubscribe();
                readerUnsubscribe = null;
            }

            if (currentUser && currentUser.email !== LIBRARIAN_EMAIL) {
                const q = query(
                    collection(firestore, 'readerRequests'),
                    where('email', '==', currentUser.email)
                );

                readerUnsubscribe = onSnapshot(q, (snap) => {
                    if (!snap.empty) {
                        // Get the latest record
                        const sorted = snap.docs
                            .map(d => ({ id: d.id, ...d.data() }))
                            .sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
                        const data = sorted[0];
                        const approved = data.status === 'approved';

                        // Set isNewApproval=true only when status changes from pending to approved
                        if (prevApproved === false && approved === true) {
                            setIsNewApproval(true);
                        } else {
                            setIsNewApproval(false);
                        }

                        prevApproved = approved;
                        setIsApproved(approved);
                        setReaderName(data.name);
                    } else {
                        prevApproved = false;
                        setIsApproved(false);
                        setIsNewApproval(false);
                        setReaderName(null);
                    }
                    setLoading(false);
                    setInitialLoad(false);
                }, (error) => {
                    console.error("Reader status error:", error);
                    setIsApproved(false);
                    setIsNewApproval(false);
                    setReaderName(null);
                    setLoading(false);
                    setInitialLoad(false);
                });

            } else {
                setIsApproved(false);
                setIsNewApproval(false);
                setReaderName(null);
                setLoading(false);
                setInitialLoad(false);
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
        <AuthContext.Provider value={{ user, loading, logout, isLibrarian, readerName, isApproved, isNewApproval }}>
            {initialLoad ? (
                <div className="min-h-screen flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-neutral"></span>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);