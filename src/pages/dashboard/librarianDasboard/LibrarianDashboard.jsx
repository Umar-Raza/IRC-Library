import { firestore } from '@/config/Firebase'
import imageCompression from 'browser-image-compression'
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { ChevronDown, Loader, SearchIcon, SearchX } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteReader } from './DeleteReader'
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
  const [newReaderName, setNewReaderName] = useState('')
  const [editingBookId, setEditingBookId] = useState(null)
  const [activeBookId, setActiveBookId] = useState(null)

  // Subject Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [subjectSearch, setSubjectSearch] = useState("")
  const [availableSubjects, setAvailableSubjects] = useState([])
  const dropdownRef = useRef(null)

  // Sort Dropdown state
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef(null)
  const sortOptions = ["نئی کتابیں", "پرانی کتابیں", "ا → ے", "ے → ا"]
  const [sortLabel, setSortLabel] = useState("نئی کتابیں")

  // BooksContext
  const { books, setBooks, loading, loadingMore, hasMore, fetchMore, updateStatus, updatingBookId, searchTerm, setSearchTerm, selectedSubject, setSelectedSubject, sortBy, setSortBy } = useBooks();

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
          searchKeywords: generateKeywords(state.bookName),
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

        toast.success('!کتاب اپڈیٹ ہوگئی ہے');
      } else {
        const now = new Date();
        const newBookData = {
          ...restOfData,
          titlePage: imageUrl,
          searchKeywords: generateKeywords(state.bookName),
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

        toast.success('!کتاب ایڈ ہوگئی ہے');
      }

      document.getElementById('my_modal_4').close()
      setState(initialState)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log(err)
      toast.error('کتاب محفوظ کرنے میں ناکامی ہوئی')
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

  const handleAddNewReaderSubmit = async () => {
    const trimmedName = newReaderName.trim();
    if (!trimmedName) return;

    setIsProcessing(true);
    try {
      await addDoc(collection(firestore, 'readers'), {
        name: trimmedName,
        createdAt: new Date()
      });
      if (activeBookId) {
        await updateStatus(activeBookId, trimmedName);
      }
      setNewReaderName('');
      document.getElementById('reader_modal').close();
      toast.success('New reader added successfully!');
    } catch (err) {
      toast.error("Something went wrong while adding new reader!");
    } finally {
      setIsProcessing(false);
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
          <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
            <button
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
              onClick={() => document.getElementById('issued_books_modal').showModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="text-xs font-semibold font-sans">Issued Books</span>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
              onClick={() => document.getElementById('reader_modal').showModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-xs font-semibold font-sans">Readers</span>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-neutral text-white hover:bg-neutral/80 transition-all shadow-md hover:shadow-lg active:scale-95"
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
                        <span className="loading loading-spinner loading-md"></span>
                        <span>Processing...</span>
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

            {/* سرچ */}
            <div className="flex-1 lg:flex-2 min-w-0">
              <SearchBooks onSearch={(value) => setSearchTerm(value)} />
            </div>

            {/* مضامین ڈراپ ڈاؤن */}
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

            {/* سورٹنگ ڈراپ ڈاؤن */}
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
                  <span>لوڈ ہو رہا ہے</span>
                </>
              ) : 'مزید کتابیں دیکھیں'}
            </button>
          </div>
        )}

      </div>

      {/* Add new reader modal */}
      <dialog id="reader_modal" className="modal font-sans">
        <div className="modal-box max-w-sm">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute btn-error right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Add New Reader</h3>
          <div className="form-control">
            <input
              type="text"
              required
              placeholder="New Reader Name"
              className="input input-bordered input-lg w-full"
              value={newReaderName}
              onChange={(e) => setNewReaderName(e.target.value)}
            />
          </div>

          <div className="mt-4 max-h-40 overflow-y-auto border rounded-lg p-2">
            <p className="text-xs font-bold mb-2 text-gray-500">Existing Readers (Click trash to delete):</p>
            {readers.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-2 animate-pulse">
                  <div className="h-4 w-24 bg-base-300 rounded"></div>
                  <div className="h-8 w-8 bg-base-300 rounded"></div>
                </div>
              ))
            ) : (
              readers.map((reader) => (
                <div key={reader.id} className="flex justify-between items-center p-1 hover:bg-base-200 rounded" dir="rtl">
                  <span className="text-sm">{reader.name}</span>
                  <DeleteReader readerId={reader.id} />
                </div>
              ))
            )}
          </div>
          <div className="modal-action flex justify-center gap-2">
            <button className="btn btn-neutral btn-wide" onClick={handleAddNewReaderSubmit} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  <span>loading...</span>
                </>
              ) : 'Save'}
            </button>
          </div>
        </div>
      </dialog>

      {/* Issued book readers modal */}
      <dialog id="issued_books_modal" className="modal font-sans w-full">
        <div className="modal-box w-11/12 max-w-3xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-error btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-2xl mb-6 text-center text-neutral">Issued Books by Reader</h3>
          <div className="overflow-y-auto max-h-[70vh] mx-auto zain-light rounded-lg shadow" dir="rtl">
            <table className="table w-full">
              <thead>
                <tr className="text-right text-base-100 bg-neutral sticky top-0 z-10">
                  <th className="text-lg w-2.5">ریڈر کا نام</th>
                  <th className="text-lg">جاری کردہ کتابیں</th>
                  <th className="text-lg text-center w-4.5">ایکشن</th>
                </tr>
              </thead>
              <tbody>
                {readers.map((reader) => {
                  const issuedBooks = books.filter(book => book.status === reader.name);
                  return (
                    <tr key={reader.id}>
                      <td className="font-bold text-neutral align-top">{reader.name}</td>
                      <td className="align-top">
                        {issuedBooks.length > 0 ? (
                          <ul className="space-y-2">
                            {issuedBooks.map(book => (
                              <li key={book.id} className="h-6 flex items-center">
                                <span className="text-sm">
                                  {book.bookName} <span className="text-gray-400 text-xs">({book.libraryCode})</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="text-center align-top">
                        {issuedBooks.length > 0 ? (
                          <div className="flex flex-col gap-2 items-center">
                            {issuedBooks.map((book) => (
                              <button
                                key={book.id}
                                className="btn btn-xs btn-success btn-outline btn-dash font-sans h-6 min-h-0 flex items-center gap-1"
                                onClick={() => updateStatus(book.id, 'library')}
                                disabled={updatingBookId === book.id}
                              >
                                {updatingBookId === book.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : "Return"}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button className="btn btn-xs btn-disabled font-sans h-6 min-h-0" disabled>Return</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>

    </div>
  )
};