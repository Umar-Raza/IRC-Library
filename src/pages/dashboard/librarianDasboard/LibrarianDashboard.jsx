import { firestore } from '@/config/Firebase'
import imageCompression from 'browser-image-compression'
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { Loader } from 'lucide-react'
import { SearchX } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  // BooksContext
  const { books, setBooks, loading, loadingMore, hasMore, fetchMore, updateStatus, updatingBookId, searchBooksInFirestore } = useBooks();


  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setState({ ...state, [e.target.name]: e.target.files[0] });
      return;
    }
    setState({ ...state, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Generate search keywords
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

    const { titlePage, createdAt, ...restOfData } = state;
    let imageUrl = state.titlePage;

    // Image Upload Logic
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

  //  Loading readers from database with real-time updates
  useEffect(() => {
    const q = query(collection(firestore, 'readers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReaders(list);
    });
    return () => unsubscribe();
  }, []);


  // Add new reader and update book status
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


  // Edit book function - populate the form with existing data and open modal
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
          <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 w-full lg:w-auto ">
            <button
              className="btn btn-neutral btn-sm md:btn-md flex-1 lg:flex-none"
              onClick={() => document.getElementById('issued_books_modal').showModal()}
            >
              Issued Books
            </button>
            <button className="btn btn-neutral btn-sm md:btn-md flex-1 lg:flex-none" onClick={() => document.getElementById('reader_modal').showModal()}>Manage Readers</button>
            <button className="btn btn-neutral btn-sm md:btn-md flex-1 lg:flex-none" onClick={() => { setEditingBookId(null); setState(initialState); document.getElementById('my_modal_4').showModal() }}>Add Book</button>

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
                <input type="file" ref={fileInputRef} placeholder="ٹائٹل پیج" name='titlePage' onChange={handleChange} id='titlePage' className="file-input file-input-lg file-input-bordered w-full " />
                <select name='status' required id='status' value={state.status || ""} onChange={handleChange} className="select select-lg select-bordered w-full">
                  <option value="" required disabled={true}>اسٹیٹس</option>
                  <option value="library" defaultValue={true}>لائبریری</option>
                </select>
                <input type="text" placeholder="مکبتہ" value={state.publisher} name='publisher' onChange={handleChange} id='publisher' className="input file-input-lg input-bordered w-full " />
                <div className='mt-3 w-full flex justify-center md:col-span-2 font-sans'>
                  <button dir='ltr' className="btn btn-neutral btn-wide" type='submit' disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <span className="loading loading-spinner loading-md "></span>
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

        <div className=" rounded-xl p-4 mb-6 border border-base-300" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <SearchBooks onSearch={searchBooksInFirestore} setSearchTerm={setSearchTerm} />
            </div>
            <span className='md:col-span-3'>
              <select
                className="select select-bordered w-full"
                value={subjectFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setSubjectFilter(val);
                }}
              >
                <option value="">تمام مضامین</option>
                {/* {[...new Set(books.map(book => book.subject))].filter(Boolean).map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))} */}
              </select>
            </span>
            <span className='md:col-span-3'>
              <select
                className="select select-bordered w-full"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option>نئی کتابیں</option>
                <option>پرانی کتابیں</option>
                <option>ا → ے</option>
                <option>ے → ا</option>
              </select>
            </span>
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
          </div>
        )}

      </div>

      {/* Add new reader modal */}
      <dialog id="reader_modal" className="modal font-sans">
        <div className="modal-box max-w-sm " >
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

          {/* Manage Readers modal box */}
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
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </dialog>

      {/* Issued book readers modal */}
      <dialog id="issued_books_modal" className="modal font-sans w-full">
        <div className="modal-box w-11/12 max-w-3xl ">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-error btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-2xl mb-6 text-center text-neutral">Issued Books by Reader</h3>
          <div className="overflow-y-auto max-h-[70vh] mx-auto zain-light rounded-lg shadow " dir="rtl">
            <table className="table w-full" >
              <thead>
                <tr className="text-right text-base-100 bg-neutral sticky top-0 z-10">
                  <th className="text-lg w-2.5">ریڈر کا نام</th>
                  <th className="text-lg ">جاری کردہ کتابیں</th>
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
                                ) : (
                                  "Return"
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button className="btn btn-xs btn-disabled font-sans h-6 min-h-0" disabled>
                            Return
                          </button>
                        )}
                      </td></tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>

    </div >
  )
};
