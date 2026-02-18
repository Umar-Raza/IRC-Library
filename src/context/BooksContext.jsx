import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { firestore } from '@/config/Firebase';
import toast from 'react-hot-toast';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [updatingBookId, setUpdatingBookId] = useState(null);

    const fetchBooks = async (isFirstLoad = true) => {
        if (isFirstLoad) {
            setLoading(true);
            setBooks([]);
        } else {
            setLoadingMore(true);
        }

        try {
            const booksRef = collection(firestore, 'books');
            let q = query(booksRef, orderBy('createdAt', 'desc'), limit(10));

            if (!isFirstLoad && lastDoc) {
                q = query(booksRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(10));
            }

            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setBooks(prev => {
                const combined = isFirstLoad ? list : [...prev, ...list];
                const uniqueMap = new Map(combined.map(item => [item.id, item]));
                return Array.from(uniqueMap.values());
            });

            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length === 10);
        } catch (error) {
            console.error("Error fetching books:", error);
            toast.error("کتابیں لوڈ کرنے میں مسئلہ ہوا");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    const searchBooksInFirestore = async (term, isNextPage = false) => {
        if (!term.trim()) {
            fetchBooks(true);
            return;
        }

        if (isNextPage) setLoadingMore(true);
        else {
            setLoading(true);
            setBooks([]);
        }

        try {
            let q = query(
                collection(firestore, "books"),
                where("searchKeywords", "array-contains", term.toLowerCase()),
                limit(10)
            );

            if (isNextPage && lastDoc) {
                q = query(
                    collection(firestore, "books"),
                    where("searchKeywords", "array-contains", term.toLowerCase()),
                    startAfter(lastDoc),
                    limit(10)
                );
            }

            const snapshot = await getDocs(q);
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setBooks(prev => {
                const combined = isNextPage ? [...prev, ...results] : results;
                const uniqueMap = new Map(combined.map(item => [item.id, item]));
                return Array.from(uniqueMap.values());
            });

            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length === 10);
        } catch (err) {
            console.error("Search Error:", err);
            toast.error("تلاش کے دوران ایرر آیا");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    useEffect(() => {
        fetchBooks(true);
    }, []);

    const updateStatus = async (bookId, newStatus, readerInfo = null) => {
        setUpdatingBookId(bookId);
        try {
            const bookRef = doc(firestore, 'books', bookId);
            const updateData = {
                status: newStatus,
                reader: readerInfo,
                updatedAt: new Date()
            };
            await updateDoc(bookRef, updateData);
            setBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updateData } : b));
            toast.success(` ${newStatus}: اسٹیٹس اپڈیٹ ہو گیا `);
        } catch (error) {
            toast.error("اسٹیٹس اپڈیٹ ہونے میں ایرر آرہا ہے!");
        } finally {
            setUpdatingBookId(null);
        }
    };

    return (
        <BookContext.Provider value={{
            books, loading, loadingMore, hasMore,
            updateStatus, searchBooksInFirestore,
            fetchMore: fetchBooks, updatingBookId, setBooks,
        }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBooks = () => useContext(BookContext);