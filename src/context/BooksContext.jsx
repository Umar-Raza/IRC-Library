import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc, where, getCountFromServer, addDoc, writeBatch, onSnapshot } from 'firebase/firestore';
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
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [totalAuthors, setTotalAuthors] = useState(0);

    // To track loaded book IDs for real-time updates
    const loadedBookIds = useRef(new Set());

    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const snapshot = await getCountFromServer(collection(firestore, 'books'));
                setTotalBooks(snapshot.data().count);

                // subjects اور authors کی unique count
                const allSnap = await getDocs(collection(firestore, 'books'));
                const subjects = new Set();
                const authors = new Set();
                allSnap.docs.forEach(d => {
                    const data = d.data();
                    if (data.subject) subjects.add(data.subject.trim());
                    if (data.author) authors.add(data.author.trim());
                });
                setTotalSubjects(subjects.size);
                setTotalAuthors(authors.size);
            } catch (error) {
                console.error("Count error:", error);
            }
        };
        fetchTotalCount();
    }, []);

    //  Real-time status listener —  status field watch
    useEffect(() => {
        if (loadedBookIds.current.size === 0) return;

        const idsArray = Array.from(loadedBookIds.current);

        // Firestore 'in' query max 30 items support
        const chunks = [];
        for (let i = 0; i < idsArray.length; i += 30) {
            chunks.push(idsArray.slice(i, i + 30));
        }

        const unsubscribers = chunks.map(chunk => {
            const q = query(
                collection(firestore, 'books'),
                where('__name__', 'in', chunk)
            );
            return onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'modified') {
                        const updated = { id: change.doc.id, ...change.doc.data() };
                        setBooks(prev => prev.map(b => b.id === updated.id ? { ...b, status: updated.status, reader: updated.reader } : b));
                    }
                });
            });
        });

        return () => unsubscribers.forEach(u => u());
    }, [books.length]);

    const fetchBooks = async (isFirstLoad = true) => {
        if (isFirstLoad) {
            setLoading(true);
            setBooks([]);
            setLastDoc(null);
            loadedBookIds.current.clear();
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

            // IDs track 
            list.forEach(b => loadedBookIds.current.add(b.id));

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

            // UI update
            setBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updateData } : b));
            setUpdatingBookId(null);

            //  Log system
            if (newStatus === 'library') {
                try {
                    const logsRef = collection(firestore, 'bookLogs');
                    const logsQuery = query(logsRef, where('bookId', '==', bookId));
                    const logsSnap = await getDocs(logsQuery);
                    const batch = writeBatch(firestore);
                    logsSnap.docs.forEach(d => batch.delete(d.ref));
                    await batch.commit();
                } catch (logError) {
                    console.error('Log reset error:', logError);
                }
            } else {
                try {
                    await addDoc(collection(firestore, 'bookLogs'), {
                        bookId: bookId,
                        readerName: newStatus,
                        takenAt: new Date(),
                    });
                } catch (logError) {
                    console.error('Log add error:', logError);
                }
            }

            toast.success(`Status updated to: ${newStatus}`);
        } catch (error) {
            toast.error("اسٹیٹس اپڈیٹ ہونے میں ایرر آرہا ہے!");
            setUpdatingBookId(null);
        }
    };

    useEffect(() => {
        fetchBooks(true);
    }, [selectedSubject, sortBy, searchTerm]);

    return (
        <BookContext.Provider value={{
            books, loading, loadingMore, hasMore,
            updateStatus, totalBooks, totalSubjects, totalAuthors,
            fetchMore: fetchBooks, updatingBookId, setBooks, searchTerm, setSearchTerm, selectedSubject, setSelectedSubject, sortBy, setSortBy
        }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBooks = () => useContext(BookContext);