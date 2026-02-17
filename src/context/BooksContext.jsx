import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc } from 'firebase/firestore';
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
        if (isFirstLoad && books.length > 0) return;

        if (isFirstLoad) setLoading(true);
        else setLoadingMore(true);

        try {
            const booksRef = collection(firestore, 'books');
            const q = isFirstLoad
                ? query(booksRef, orderBy('createdAt', 'desc'), limit(20))
                : query(booksRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(20));

            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (isFirstLoad) {
                setBooks(list);
            } else {
                setBooks(prev => [...prev, ...list]);
            }

            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length === 20);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchBooks(true);
    }, []);

    // Update status function
    const updateStatus = async (bookId, newStatus) => {
        setUpdatingBookId(bookId); 
        try {
            const bookRef = doc(firestore, 'books', bookId);
            await updateDoc(bookRef, { status: newStatus });

            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, status: newStatus } : book
                )
            );
            toast.success(`${newStatus}: اسٹیٹس اپڈیٹ ہو گیا ہے `);
        } catch (err) {
            toast.error("اپڈیٹ کرنے میں مسئلہ ہوا");
        } finally {
            setUpdatingBookId(null); 
        }
    };
    return (
        <BookContext.Provider value={{ books, setBooks, loading, loadingMore, updateStatus, hasMore, fetchMore: () => fetchBooks(false), updatingBookId }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBooks = () => useContext(BookContext);