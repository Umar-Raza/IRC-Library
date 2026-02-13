import React, { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { SearchX } from 'lucide-react'
import { firestore } from '@/config/Firebase';
import { toast } from 'react-hot-toast';
import { BooksTable } from '@/components/booksTable/BooksTable';
import { SearchBooks } from '@/components/searchBooks/SearchBooks';

export const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('نئی کتابیں');
    const [readers, setReaders] = useState([]);

    useEffect(() => {
        const q = query(collection(firestore, 'readers'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReaders(list);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // ڈیٹا بیس سے رئیل ٹائم ڈیٹا حاصل کرنا
        const q = query(collection(firestore, 'books'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (bookId, newStatus) => {
        try {
            const bookRef = doc(firestore, 'books', bookId);
            await updateDoc(bookRef, { status: newStatus });
            toast.success(`Status Updated!: ${newStatus}`);
        } catch (err) {
            toast.error("Status update failed!");
        }
    };

    // فلٹر اور سورٹنگ لاجک (بالکل ڈیش بورڈ کی طرح)
    const filteredBooks = books
        .filter((book) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                book.bookName?.toLowerCase().includes(searchLower) ||
                book.author?.toLowerCase().includes(searchLower);
            const matchesSubject = subjectFilter === "" || book.subject === subjectFilter;
            return matchesSearch && matchesSubject;
        })
        .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);

            if (sortOrder === 'نئی کتابیں') return dateB.getTime() - dateA.getTime();
            if (sortOrder === 'پرانی کتابیں') return dateA.getTime() - dateB.getTime();
            if (sortOrder === 'ا → ے') return (a.bookName || "").localeCompare((b.bookName || ""), 'ur');
            if (sortOrder === 'ے → ا') return (b.bookName || "").localeCompare((a.bookName || ""), 'ur');
            return 0;
        });

    return (
        <div className="card card-side bg-base-100 shadow-xl m-4 w-[80%] mx-auto min-h-screen">
            <div className="card-body">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="card-title text-3xl font-bold noto-naskh-arabic-font text-neutral">اسلامک ریسرچ سینٹر لائبریری</h2>
                </div>
                <div className="bg-base-100 rounded-xl  shadow border border-base-300 p-4 mb-1" dir="rtl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <SearchBooks onSearch={(value) => setSearchTerm(value)} />
                        <select
                            className="select select-bordered w-full md:w-1/5 text-[16px]"
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                        >
                            <option value="">تمام مضامین</option>
                            {[...new Set(books.map(book => book.subject))].filter(Boolean).map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                        <select
                            className="select select-bordered w-full md:w-1/5 text-[16px]"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option>نئی کتابیں</option>
                            <option>پرانی کتابیں</option>
                            <option>ا → ے</option>
                            <option>ے → ا</option>
                        </select>
                    </div>
                </div>
                <div className="relative">
                    {!loading && filteredBooks.length === 0 ? (
                        <div className="py-20 text-center bg-base-200/20 rounded-xl">
                            <SearchX size={64} className="mx-auto mb-4 text-base-content/20" />
                            <h3 className="text-3xl font-bold text-base-content/50 noto-naskh-arabic-font">معذرت! کوئی کتاب نہیں ملی۔</h3>
                            <p className="text-xl mt-2 text-base-content/40">دوسرے الفاظ استعمال کر کے سرچ کریں۔</p>
                        </div>
                    ) : (
                        <BooksTable
                            books={filteredBooks}
                            loading={loading}
                            isAdmin={false}
                            readers={readers}
                            updateStatus={updateStatus}
                            searchTerm={searchTerm}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}