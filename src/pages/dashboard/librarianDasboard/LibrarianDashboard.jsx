import { firestore } from '@/config/Firebase'
import imageCompression from 'browser-image-compression'
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { ChevronDown, ClipboardList, LibraryBig, Loader, SearchIcon, SearchX, UserCheck } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { SearchBooks } from '@/components/searchBooks/SearchBooks'
import { BooksTable } from '@/components/booksTable/BooksTable'
import { useBooks } from '@/context/BooksContext'

const initialState = {
  bookName: '',
  author: '',
  bookLink: '',
  subject: '',
  libraryCode: '',
  titlePage: null, status: '',
  publisher: '',
}

export const LibrarianDashboard = () => {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)
  const [readers, setReaders] = useState([])
  const [editingBookId, setEditingBookId] = useState(null)
  const [activeBookId, setActiveBookId] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])

  // Subject Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [subjectSearch, setSubjectSearch] = useState("")
  const [availableSubjects, setAvailableSubjects] = useState([])
  const dropdownRef = useRef(null)

  // Sort Dropdown state
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef(null)
  const sortOptions = ["ا → ے", "ے → ا"]
  const [sortLabel, setSortLabel] = useState("ترتیب منتخب کریں")

  // BooksContext
  const { books, setBooks, loading, loadingMore, hasMore, fetchMore, updateStatus, updatingBookId, searchTerm, setSearchTerm, selectedSubject, setSelectedSubject, sortBy, setSortBy } = useBooks();

  // Pending reader requests
  useEffect(() => {
    const q = query(
      collection(firestore, 'readerRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  // For Reader approve 
  const handleApproveReader = async (request) => {
    try {
      // 1. readerRequests to statue approved
      await updateDoc(doc(firestore, 'readerRequests', request.id), {
        status: 'approved'
      });
      // 2. Store in readers collection 
      await addDoc(collection(firestore, 'readers'), {
        name: request.name,
        email: request.email,
        createdAt: new Date()
      });
      toast.success(`${request.name} request approved!`);
    } catch (err) {
      toast.error("Approval failed!");
    }
  };

  // Reader reject to access IRCLibrary 
  const handleRejectReader = async (requestId) => {
    try {
      await updateDoc(doc(firestore, 'readerRequests', requestId), {
        status: 'rejected'
      });
      toast.success("Request rejected!");
    } catch (err) {
      toast.error("Rejection failed!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
        setSubjectSearch("")
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'books'))
        const uniqueSubjects = [
          ...new Set(snapshot.docs.map(doc => doc.data().subject))
        ].filter(Boolean).sort()
        setAvailableSubjects(uniqueSubjects)
      } catch (error) {
        console.error("Subjects load error:", error)
      }
    }
    fetchSubjects()
  }, [])

  const filteredSubjects = availableSubjects.filter(s =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  )

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setState({ ...state, [e.target.name]: e.target.files[0] });
      return;
    }
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const generateKeywords = (name) => {
    if (!name) return [];
    const lowerName = name.toLowerCase().trim();
    const keywords = new Set();
    let fullTerm = "";
    for (const char of lowerName) {
      fullTerm += char;
      keywords.add(fullTerm);
    }
    const words = lowerName.split(/\s+/);
    words.forEach(word => {
      let curr = "";
      for (const char of word) {
        curr += char;
        keywords.add(curr);
      }
    });
    return Array.from(keywords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const { titlePage, createdAt, ...restOfData } = state;
    let imageUrl = state.titlePage;

    if (titlePage && titlePage instanceof File) {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1920, useWebWorker: true };
      let compressedTitlePage = titlePage;
      try {
        compressedTitlePage = await imageCompression(titlePage, options);
      } catch (error) {
        console.log("Compression error:", error);
      }

      const data = new FormData();
      data.append("file", compressedTitlePage, state.bookName || "book_image");
      data.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_uploadPreset);
      data.append("cloud_name", import.meta.env.VITE_APP_CLOUDINARY_cloudName);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      imageUrl = file.secure_url;
    }

    try {
      if (editingBookId) {
        const bookRef = doc(firestore, 'books', editingBookId);
        const updatedBookData = {
          ...restOfData,
          titlePage: imageUrl,
          searchKeywords: [
            ...generateKeywords(state.bookName),
            ...generateKeywords(state.author)
          ],
          updatedAt: new Date()
        };
        await updateDoc(bookRef, updatedBookData);

        setBooks(prevBooks => {
          const updatedList = prevBooks.map(book =>
            book.id === editingBookId ? { ...book, ...updatedBookData } : book
          );
          const uniqueMap = new Map(updatedList.map(item => [item.id, item]));
          return Array.from(uniqueMap.values());
        });

        toast.success('Book Updated Successfully!');
      } else {
        const now = new Date();
        const newBookData = {
          ...restOfData,
          titlePage: imageUrl,
          searchKeywords: [
            ...generateKeywords(state.bookName),
            ...generateKeywords(state.author)
          ],
          createdAt: now,
        };
        const docRef = await addDoc(collection(firestore, 'books'), newBookData);

        const newBookForState = {
          id: docRef.id,
          ...newBookData,
          createdAt: { toDate: () => now }
        };

        setBooks(prevBooks => {
          const combined = [newBookForState, ...prevBooks];
          const uniqueMap = new Map(combined.map(item => [item.id, item]));
          return Array.from(uniqueMap.values());
        });

        toast.success('Book Added Successfully!');
      }

      document.getElementById('my_modal_4').close()
      setState(initialState)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong while saving the book!');
    } finally {
      setIsProcessing(false)
      setEditingBookId(null)
    }
  }

  useEffect(() => {
    const q = query(collection(firestore, 'readers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReaders(list);
    });
    return () => unsubscribe();
  }, []);

  const [issuedBooksList, setIssuedBooksList] = useState([]);
  const [issuedLoading, setIssuedLoading] = useState(false);

  const handleOpenIssuedModal = async () => {
    setIssuedLoading(true);
    document.getElementById('issued_books_modal').showModal();
    try {
      const q = query(
        collection(firestore, 'books'),
        where('status', '!=', 'library')
      );
      const snap = await getDocs(q);
      setIssuedBooksList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      toast.error('Issued books لوڈ نہیں ہوئیں');
    } finally {
      setIssuedLoading(false);
    }
  };

  const [bookLogs, setBookLogs] = useState([]);
  const [logBookName, setLogBookName] = useState('');
  const [logLoading, setLogLoading] = useState(false);
  const [logSelected, setLogSelected] = useState(false);

  const handleOpenLog = async (bookId, bookName) => {
    setLogBookName(bookName);
    setLogLoading(true);
    try {
      const q = query(
        collection(firestore, 'bookLogs'),
        where('bookId', '==', bookId)
      );
      const snap = await getDocs(q);
      const logs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.takenAt?.toDate() - b.takenAt?.toDate());
      setBookLogs(logs);
    } catch (e) {
      console.error('Log error:', e);
      toast.error('Log لوڈ نہیں ہوا');
    } finally {
      setLogLoading(false);
    }
  };


  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setState({
      bookName: book.bookName || '',
      author: book.author || '',
      bookLink: book.bookLink || '',
      subject: book.subject || '',
      libraryCode: book.libraryCode || '',
      titlePage: book.titlePage || null,
      status: book.status || '',
      publisher: book.publisher || '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    document.getElementById('my_modal_4').showModal();
  };

  return (
    <div className="card bg-base-100 shadow-xl my-4 w-[98%] lg:w-[94%] xl:w-[92%] mx-auto border border-base-200">
      <div className="card-body p-3 sm:p-6 md:p-8 zain-light">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="card-title text-2xl font-bold font-sans">Librarian Dashboard</h2>
          <div className="grid grid-cols-4 gap-2 w-full lg:w-auto">
            <button
              className="flex flex-col items-center justify-center cursor-pointer gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
              onClick={() => handleOpenIssuedModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="text-xs font-semibold font-sans">Issued Books</span>
            </button>
            <button
              className="relative flex flex-col items-center justify-center cursor-pointer gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
              onClick={() => document.getElementById('pending_requests_modal').showModal()}
            >
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span className="text-xs font-semibold font-sans">Requests</span>
            </button>
            <button
              className="flex flex-col items-center justify-center cursor-pointer gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
              onClick={() => { setBookLogs([]); setLogBookName(''); setLogSelected(false); document.getElementById('book_log_modal').showModal(); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              <span className="text-xs font-semibold font-sans">Book Log</span>
            </button>
            <button
              className="flex flex-col items-center justify-center cursor-pointer gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
              onClick={() => { setEditingBookId(null); setState(initialState); document.getElementById('my_modal_4').showModal() }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span className="text-xs font-semibold font-sans">Add Book</span>
            </button>
          </div>

          <dialog id="my_modal_4" className="modal" dir='rtl'>
            <div className="modal-box w-11/12 max-w-5xl">
              <button className="btn btn-error btn-soft btn-circle text-lg absolute right-2 top-4" onClick={() => { document.getElementById('my_modal_4').close(); setEditingBookId(null); setState(initialState); }}>✕</button>
              <h1 className="font-bold text-end text-2xl text-neutral font-sans">{editingBookId ? 'Edit Book' : 'Add Books'}</h1>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
                <input type="text" required placeholder="نام کتاب" value={state.bookName} onChange={handleChange} name='bookName' id='bookName' className="input file-input-lg input-bordered w-full" />
                <input type="text" required placeholder="مصنف" value={state.author} name='author' onChange={handleChange} id='author' className="input file-input-lg input-bordered w-full" />
                <input type="text" placeholder="کتاب لنک" value={state.bookLink} name='bookLink' onChange={handleChange} id='bookLink' className="input file-input-lg input-bordered w-full" />
                <input type="text" required placeholder="مضمون" value={state.subject} name='subject' onChange={handleChange} id='subject' className="input file-input-lg input-bordered w-full" />
                <input type="text" required placeholder="لائبریری کوڈ" value={state.libraryCode} name='libraryCode' onChange={handleChange} id='libraryCode' className="input file-input-lg input-bordered w-full" />
                <input type="file" ref={fileInputRef} placeholder="ٹائٹل پیج" name='titlePage' onChange={handleChange} id='titlePage' className="file-input file-input-lg file-input-bordered w-full" />
                <select name='status' required id='status' value={state.status || ""} onChange={handleChange} className="select select-lg select-bordered w-full">
                  <option value="" required disabled={true}>اسٹیٹس</option>
                  <option value="library" defaultValue={true}>لائبریری</option>
                </select>
                <input type="text" placeholder="مکبتہ" value={state.publisher} name='publisher' onChange={handleChange} id='publisher' className="input file-input-lg input-bordered w-full" />
                <div className='mt-3 w-full flex justify-center md:col-span-2 font-sans'>
                  <button dir='ltr' className="btn btn-neutral btn-wide" type='submit' disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Processing</span>
                      </>
                    ) : (
                      editingBookId ? 'Update Book' : 'Add Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
        <div className="rounded-xl p-4 mb-6 border border-base-300" dir="rtl">
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            {/* Search Field */}
            <div className="flex-1 lg:flex-2 min-w-0">
              <SearchBooks onSearch={(value) => setSearchTerm(value)} />
            </div>
            {/* Subjects Dropdown */}
            <div className="relative w-full lg:w-1/4 text-[16px] font-zain-light" ref={dropdownRef}>
              <div
                className="input input-bordered flex items-center text-base-content/60 justify-between cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="truncate">{selectedSubject === "All" || !selectedSubject ? "تمام مضامین" : selectedSubject}</span>
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
                  <ul className="max-h-60 overflow-y-auto p-1">
                    <li
                      className={`p-2 hover:bg-neutral hover:text-white rounded cursor-pointer ${selectedSubject === "All" ? 'bg-neutral text-white' : ''}`}
                      onClick={() => { setSelectedSubject("All"); setIsDropdownOpen(false); setSubjectSearch(""); }}
                    >
                      تمام مضامین
                    </li>
                    {filteredSubjects.length === 0 && subjectSearch !== "" ? (
                      <li className="p-3 text-center text-base-content/50 text-sm">
                        معذرت! <span className="font-bold text-neutral">"{subjectSearch}"</span> کا مضمون نہیں ملا۔
                      </li>
                    ) : (
                      filteredSubjects.map((subject) => (
                        <li
                          key={subject}
                          className={`p-2 hover:bg-neutral hover:text-white rounded cursor-pointer mt-1 ${selectedSubject === subject ? 'bg-neutral text-white' : ''}`}
                          onClick={() => { setSelectedSubject(subject); setIsDropdownOpen(false); setSubjectSearch(""); }}
                        >
                          {subject}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="relative w-full lg:w-1/4 text-[16px] font-zain-light" ref={sortRef}>
              <div
                className="input input-bordered flex items-center justify-between cursor-pointer bg-base-100 pr-4 pl-3"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="truncate text-base-content/60">{sortLabel}</span>
                <ChevronDown size={18} className={`text-base-content/50 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </div>

              {isSortOpen && (
                <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl overflow-hidden">
                  <ul className="p-1">
                    {sortOptions.map((option) => (
                      <li
                        key={option}
                        className={`p-2.5 hover:bg-neutral hover:text-white rounded-lg cursor-pointer transition-colors text-sm mt-1 ${sortLabel === option ? 'bg-neutral text-white' : ''}`}
                        onClick={() => {
                          setSortLabel(option);
                          if (option === "ا → ے") setSortBy('a-z');
                          else setSortBy('newest');
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
        <div className="relative overflow-x-auto">
          {(loading || books.length > 0) ? (
            <BooksTable
              loading={loading}
              books={books || []}
              readers={readers}
              updateStatus={updateStatus}
              handleEditBook={handleEditBook}
              handleOpenLog={handleOpenLog}
              searchTerm={searchTerm}
              isAdmin={true}
            />
          ) : null}

          {!loading && books.length === 0 && (
            <div className="py-20 text-center rounded-xl my-4">
              <SearchX size={64} className="mx-auto mb-4 text-base-content/20" />
              <h3 className="text-3xl font-bold text-base-content/50 zain-light">
                معذرت! کوئی کتاب نہیں ملی۔
              </h3>
            </div>
          )}
        </div>
        {hasMore && books.length > 0 && (
          <div className="flex justify-center my-3">
            <button
              onClick={() => fetchMore(false)}
              className="btn btn-neutral px-10"
              disabled={loading || loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mx-2" />
                  <span>انتظار فرمائیں</span>
                </>
              ) : 'مزید کتب دیکھیں'}
            </button>
          </div>
        )}

      </div>
      {/* Pending Reader Requests Modal */}
      <dialog id="pending_requests_modal" className="modal font-sans">
        <div className="modal-box max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-error btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-xl mb-4 font-sans">Pending Reader Requests</h3>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-10 text-base-content/40">
              <div className="flex justify-center mb-6">
                <div className="bg-neutral/10 p-4 rounded-full">
                  <UserCheck className="w-12 h-12 text-neutral" />
                </div>
              </div>
              <p className='text-1xl'>No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl border border-base-300">
                  <div>
                    <p className="font-bold text-neutral">{req.name}</p>
                    <p className="text-sm text-base-content/50">{req.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm font-sans"
                      onClick={() => handleApproveReader(req)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-error btn-sm btn-outline font-sans"
                      onClick={() => handleRejectReader(req.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </dialog>

      {/* Issued book readers modal */}
      <dialog id="issued_books_modal" className="modal font-sans w-full">
        <div className="modal-box w-11/12 max-w-xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-error btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-xl mb-4 text-neutral">Issued Books</h3>
          <div className="overflow-y-auto max-h-[70vh] space-y-2 zain-light" dir="rtl">
            {issuedLoading ? (
              <div className="flex justify-center py-16">
                <Loader className="w-6 h-6 animate-spin text-neutral" />
              </div>
            ) : issuedBooksList.length === 0 ? (
              <div className="text-center py-16 text-base-content/40">
                <div className="flex justify-center mb-6">
                  <div className="bg-neutral/10 p-4 rounded-full">
                    <LibraryBig className="w-12 h-12 text-neutral" />
                  </div>
                </div>
                <p className="text-neutral/60  font-bold">No Issued Books</p>
              </div>
            ) : (
              issuedBooksList.map((book) => (
                <div key={book.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-base-200/50 rounded-xl border border-base-300 hover:border-neutral transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral text-sm truncate">{book.bookName}</p>
                    <p className="text-xs text-base-content/40 mt-0.5">
                      {book.updatedAt?.toDate
                        ? book.updatedAt.toDate().toLocaleString('ur-PK', { dateStyle: 'medium', timeStyle: 'short' })
                        : '—'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                    {book.status}
                  </span>
                  <button
                    className="btn btn-xs btn-neutral font-sans shrink-0 w-16"
                    onClick={async () => {
                      await updateStatus(book.id, 'library');
                      setIssuedBooksList(prev => prev.filter(b => b.id !== book.id));
                    }}
                    disabled={updatingBookId === book.id}
                  >
                    {updatingBookId === book.id ? <Loader className="w-3 h-3 animate-spin" /> : 'Return'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </dialog>

      {/* Book Log Modal */}
      <dialog id="book_log_modal" className="modal zain-light" >
        <div className="modal-box max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-error btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-xl mb-4">Books Log</h3>

          <div className="relative mb-4" dir="rtl">
            <input
              type="text"
              placeholder="کتاب کا نام لکھیں"
              className="input input-bordered w-full pr-4"
              value={logBookName}
              onChange={(e) => {
                setLogBookName(e.target.value);
                setBookLogs([]);
                setLogSelected(false);
              }}
            />
            {logBookName && !logSelected && (
              <ul className="absolute z-50 w-full bg-base-100 border border-base-300 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                {books
                  .filter(b => b.bookName.toLowerCase().includes(logBookName.toLowerCase()))
                  .slice(0, 8)
                  .map(b => (
                    <li
                      key={b.id}
                      className="px-4 py-2.5 hover:bg-neutral hover:text-white cursor-pointer text-sm transition-colors"
                      onClick={() => { setLogSelected(true); handleOpenLog(b.id, b.bookName); }}
                    >
                      {b.bookName}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {logLoading ? (
            <div className="flex justify-center py-10 ">
              <Loader className="w-6 h-6 animate-spin text-neutral" />
            </div>
          ) : bookLogs.length === 0 && logBookName ? (
            <div className="text-center py-10 text-base-content/40">
              <div className="flex justify-center mb-6">
                <div className="bg-neutral/10 p-4 rounded-full">
                  <ClipboardList className="w-12 h-12 text-neutral" />
                </div>
              </div>
              <p className=" mt-1 text-neutral/60  font-bold">This book has no logs.</p>
            </div>
          ) : bookLogs.length > 0 ? (
            <>
              <p className="text-sm font-bold text-neutral mb-3 truncate text-center zain-bold"  >{logBookName}</p>
              <ol className="relative border-r border-base-300 mr-3 space-y-3">
                {bookLogs.map((log, index) => (
                  <li key={log.id} className="mb-2 mr-6">
                    <span className="absolute -right-3 flex items-center justify-center w-6 h-6 bg-neutral text-white rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="p-3 bg-base-200/50 rounded-xl border border-base-300">
                      <p className="font-bold text-neutral">{log.readerName}</p>
                      <p className="text-xs text-base-content/50 mt-0.5">
                        {log.takenAt?.toDate
                          ? log.takenAt.toDate().toLocaleString('ur-PK', { dateStyle: 'medium', timeStyle: 'short' })
                          : '—'}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="text-center py-6 font-bold text-neutral/60">
              <p>Search Books Name to see logs.</p>
            </div>
          )}
        </div>
      </dialog >
    </div >
  )
};