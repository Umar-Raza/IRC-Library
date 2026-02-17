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


    // 1. یہ فنکشن شروع کی بکس لوڈ کرے گا
    const fetchInitialBooks = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(firestore, "books"),
                orderBy("createdAt", "desc"),
                limit(10) // یا جتنی آپ شروع میں دکھانا چاہیں
            );
            const snapshot = await getDocs(q);
            const initialBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(initialBooks);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Pagination کے لیے
            setHasMore(snapshot.docs.length === 10);
        } catch (error) {
            console.error("Error fetching initial books:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. useEffect میں اب صرف اس فنکشن کو کال کریں
    useEffect(() => {
        fetchInitialBooks();
    }, []);


    // Search books function
    const searchBooksInFirestore = async (term) => {
        if (!term.trim()) {
            // اگر سرچ خالی ہو تو شروع والی بکس دوبارہ لوڈ کریں (fetchMore والا لاجک)
            // یہاں آپ اپنی ابتدائی بکس لوڈ کرنے کا فنکشن کال کر سکتے ہیں
            fetchInitialBooks();
            return;
        }
        setLoading(true); // لوڈر شروع کریں
        try {
            const q = query(
                collection(firestore, "books"),
                where("searchKeywords", "array-contains", term.toLowerCase()),
                limit(20)
            );

            const snapshot = await getDocs(q);
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setBooks(results);
        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            setLoading(false); // لوڈر ختم کریں
        }
    };

    return (
        <BookContext.Provider value={{ books, setBooks, loading, loadingMore, updateStatus, hasMore, fetchMore: () => fetchBooks(false), updatingBookId, searchBooksInFirestore }}>
            {children}
        </BookContext.Provider >
    );
};

export const useBooks = () => useContext(BookContext);