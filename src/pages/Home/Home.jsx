import React, { useEffect, useState, useRef } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { Loader, SearchIcon, SearchX } from 'lucide-react'
import { firestore } from '@/config/Firebase';
import { BooksTable } from '@/components/booksTable/BooksTable';
import { SearchBooks } from '@/components/searchBooks/SearchBooks';
import { ChevronDown, } from 'lucide-react';
import { useBooks } from '@/context/BooksContext';
export const Home = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('نئی کتابیں');
    const [readers, setReaders] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState("");
    const dropdownRef = useRef(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);
    const sortOptions = ["نئی کتابیں", "پرانی کتابیں", "ا → ے", "ے → ا"];

    //  Books Context
    const { books, loading, loadingMore, hasMore, fetchMore, updateStatus, searchBooksInFirestore, repairAllKeywords } = useBooks();

    useEffect(() => {
        const q = query(collection(firestore, 'readers'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReaders(list);
        });
        return () => unsubscribe();
    }, []);



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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const allSubjects = [...new Set(books.map(book => book.subject))].filter(Boolean);
    const filteredSubjects = allSubjects.filter(s =>
        s.toLowerCase().includes(subjectSearch.toLowerCase())
    );

    return (
        <div className="card bg-base-100 shadow-xl my-4 w-[98%] lg:w-[94%] xl:w-[92%] mx-auto border border-base-200 font-zain-light">
            <div className="card-body">
                <div className="flex flex-row items-center justify-center gap-2 py-4 text-sm sm:text-lg text-neutral" dir="rtl">
                    <span>اسلامک ریسرچ سینٹر فیصل آباد میں کل</span>
                    <span className="font-bold bg-neutral text-white px-2 py-0.5 rounded-lg shrink-0">
                        {loading ? (
                            <Loader className="w-5 h-5  animate-spin mx-1" />
                        ) : (

                            <span> {books.length}</span>
                        )}
                    </span>مجلدات موجود ہیں۔
                </div>
                <div className="bg-base-100 rounded-xl shadow  border border-base-300 p-4 mb-2" dir="rtl">
                    <div className="flex flex-col lg:flex-row items-stretch gap-3">
                        <div className="flex-1 lg:flex-2 min-w-0">
                            <SearchBooks onSearch={(value) => {
                                setSearchTerm(value);
                                searchBooksInFirestore(value);
                            }} />
                        </div>

                        <div className="relative w-full md:w-1/4 text-[16px]" ref={dropdownRef} dir="rtl">
                            <div
                                className="input input-bordered flex items-center text-base-content/60 justify-between cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="truncate">{subjectFilter || "تمام مضامین"}</span>
                                <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl overflow-hidden">
                                    <div className="p-2 border-b border-base-200 bg-base-200/50">
                                        <div className="relative">
                                            <SearchIcon className="absolute right-2 top-2.5 text-base-content/50 z-10" size={16} />
                                            <input
                                                type="text"
                                                className="input input-sm input-bordered w-full pr-8"
                                                placeholder="مضمون تلاش کریں..."
                                                value={subjectSearch}
                                                onChange={(e) => setSubjectSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <ul className="max-h-60 overflow-y-auto p-1 z-999">
                                        <li
                                            className={`p-2 hover:bg-neutral hover:text-white rounded cursor-pointer ${subjectFilter === "" ? 'bg-neutral text-white' : ''}`}
                                            onClick={() => {
                                                setSubjectFilter("");
                                                setIsDropdownOpen(false);
                                                setSubjectSearch("");
                                            }}
                                        >
                                            تمام مضامین
                                        </li>
                                        {filteredSubjects.length > 0 ? (
                                            filteredSubjects.map((subject) => (
                                                <li
                                                    key={subject}
                                                    className={`p-2 hover:bg-neutral hover:text-white rounded cursor-pointer mt-1 ${subjectFilter === subject ? 'bg-neutral text-white' : ''}`}
                                                    onClick={() => {
                                                        setSubjectFilter(subject);
                                                        setIsDropdownOpen(false);
                                                        setSubjectSearch("");
                                                    }}
                                                >
                                                    {subject}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="p-2 text-center text-sm text-base-content/40">کوئی مضمون نہیں ملا</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative w-full md:w-1/4 text-[16px]" ref={sortRef} dir="rtl">
                            <div
                                className="input input-bordered flex items-center justify-between cursor-pointer bg-base-100 pr-4 pl-3"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                            >
                                <span className="truncate text-base-content/60 ">
                                    {sortOrder || "ترتیب منتخب کریں"}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-base-content/50 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {isSortOpen && (
                                <div className="absolute z-100 w-full mt-1 bg-base-100  border border-base-300 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <ul className="p-1">
                                        {sortOptions.map((option) => (
                                            <li
                                                key={option}
                                                className={`p-2.5 hover:bg-neutral hover:text-white rounded-lg cursor-pointer transition-colors text-sm mt-1 ${sortOrder === option ? 'bg-neutral text-white' : 'hover:bg-base-200'}`}
                                                onClick={() => {
                                                    setSortOrder(option);
                                                    setIsSortOpen(false);
                                                }}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative">
                    {!loading && filteredBooks.length === 0 ? (
                        <div className="py-20 text-center bg-base-200/20 rounded-xl">
                            <SearchX size={64} className="mx-auto mb-4 text-base-content/20" />
                            <h3 className="text-3xl font-bold text-base-content/50 noto-naskh-arabic-font">معذرت! کوئی کتاب نہیں ملی۔</h3>
                            <p className="text-xl mt-2 text-base-content/40">الفاظ بدل کر سرچ کریں۔</p>
                        </div>
                    ) : (
                        <BooksTable
                            books={books}
                            loading={loading}
                            isAdmin={false}
                            readers={readers}
                            updateStatus={updateStatus}
                            searchTerm={searchTerm}
                        />

                    )}
                </div>
                <div className="flex justify-center my-3">
                    {hasMore && books.length > 0 && (
                        <button
                            onClick={() => {
                                if (searchTerm.trim()) {
                                    searchBooksInFirestore(searchTerm, true);
                                } else {
                                    fetchMore(false);
                                }
                            }}
                            className="btn btn-neutral px-10"
                            disabled={loading || loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mx-2" />
                                    <span>لوڈ ہو رہا ہے</span>
                                </>
                            ) : 'مزید کتابیں دیکھیں'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}