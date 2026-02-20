import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc, where, getCountFromServer } from 'firebase/firestore';
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
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState("");
    const [totalBooks, setTotalBooks] = useState(0); 

    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const snapshot = await getCountFromServer(collection(firestore, 'books'));
                setTotalBooks(snapshot.data().count);
            } catch (error) {
                console.error("Count error:", error);
            }
        };
        fetchTotalCount();
    }, []);

    const fetchBooks = async (isFirstLoad = true) => {
        if (isFirstLoad) {
            setLoading(true);
            setBooks([]);
            setLastDoc(null);
        } else {
            setLoadingMore(true);
        }

        try {
            const booksRef = collection(firestore, 'books');
            let constraints = [];

            if (selectedSubject && selectedSubject !== "All" && selectedSubject !== "") {
                constraints.push(where('subject', '==', selectedSubject));
            }

            if (searchTerm && searchTerm.trim() !== "") {
                const searchVal = searchTerm.toLowerCase().trim();
                constraints.push(where('searchKeywords', 'array-contains', searchVal));
            }

            if (sortBy === 'a-z') {
                constraints.push(orderBy('bookName', 'asc'));
            } else {
                constraints.push(orderBy('createdAt', 'desc'));
            }

            if (!isFirstLoad && lastDoc) {
                constraints.push(startAfter(lastDoc));
            }

            constraints.push(limit(10));

            const q = query(booksRef, ...constraints);
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
            setBooks([]);
            toast.error("ڈیٹا لوڈ کرنے میں مسئلہ ہوا");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

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
            toast.success(`Status updated to: ${newStatus}`);
        } catch (error) {
            toast.error("اسٹیٹس اپڈیٹ ہونے میں ایرر آرہا ہے!");
        } finally {
            setUpdatingBookId(null);
        }
    };

    useEffect(() => {
        fetchBooks(true);
    }, [selectedSubject, sortBy, searchTerm]);

    return (
        <BookContext.Provider value={{
            books, loading, loadingMore, hasMore,
            updateStatus, totalBooks, 
            fetchMore: fetchBooks, updatingBookId, setBooks, searchTerm, setSearchTerm, selectedSubject, setSelectedSubject, sortBy, setSortBy
        }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBooks = () => useContext(BookContext);