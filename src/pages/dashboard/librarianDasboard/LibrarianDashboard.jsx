import { firestore } from '@/config/Firebase'
import imageCompression from 'browser-image-compression'
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { SquarePlus } from 'lucide-react'
import { SearchX } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteReader } from './DeleteReader'
import { SearchBooks } from '@/components/searchBooks/SearchBooks'
import { BooksTable } from '@/components/booksTable/BooksTable'
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
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [readers, setReaders] = useState([])
  const [books, setBooks] = useState([])
  const [newReaderName, setNewReaderName] = useState('')
  const [editingBookId, setEditingBookId] = useState(null)
  const [activeBookId, setActiveBookId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')



  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setState({ ...state, [e.target.name]: e.target.files[0] });
      return;
    }
    setState({ ...state, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { titlePage, createdAt, ...restOfData } = state;
    // 1. If title page is a file, compress and upload to Cloudinary, then get the URL
    let imageUrl = state.titlePage;

    if (titlePage && titlePage instanceof File) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }

      let compressedTitlePage = titlePage;
      try {
        compressedTitlePage = await imageCompression(titlePage, options);
      } catch (error) {
        console.log("Compression error:", error);
      }

      const data = new FormData();
      data.append("file", compressedTitlePage, state.bookName || "book_image");
      data.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_uploadPreset); // Replace with your Cloudinary preset
      data.append("cloud_name", import.meta.env.VITE_APP_CLOUDINARY_cloudName);    // Replace with your Cloudinary cloud name

      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      imageUrl = file.secure_url;
    }

    try {
      if (editingBookId) {
        // Update existing book
        const bookRef = doc(firestore, 'books', editingBookId);
        await updateDoc(bookRef, {
          ...restOfData,
          titlePage: imageUrl,
        });
        toast.success('!کتاب اپڈیٹ ہوگئی ہے');
      } else {
        // Add new book
        await addDoc(collection(firestore, 'books'), {
          ...restOfData,
          titlePage: imageUrl,
          createdAt: new Date(),
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
      toast.error('Failed to add book')
    } finally {
      setLoading(false)
      setEditingBookId(null)
    }
  }

  // 1. Loading readers from database with real-time updates
  useEffect(() => {
    const q = query(collection(firestore, 'readers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReaders(list);
    });
    return () => unsubscribe();
  }, []);

  // 1. Loading books from database with real-time updates
  useEffect(() => {
    const q = query(collection(firestore, 'books'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(list);
    });
    return () => unsubscribe();
  }, []);

  // 2. Add new reader and update book status
  const handleAddNewReaderSubmit = async () => {
    const trimmedName = newReaderName.trim();
    if (!trimmedName) return;

    setLoading(true);
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
      setLoading(false);
    }
  };

  // 3. Status update Function
  const updateStatus = async (bookId, newStatus) => {
    try {
      const bookRef = doc(firestore, 'books', bookId);
      await updateDoc(bookRef, { status: newStatus });
      toast.success(`Status Updated!: ${newStatus}`);
    } catch (err) {
      toast.error("Status update failed!");
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

  // Filter books based on search term
  const filteredBooks = books
    .filter((book) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        book.bookName?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower);
      const matchesSubject = subjectFilter === "" || subjectFilter === "کتابوں کی قسمیں" || book.subject === subjectFilter;
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

  const handleReturnBook = async (bookId) => {
    try {
      const bookRef = doc(firestore, 'books', bookId);
      await updateDoc(bookRef, { status: 'library' });
      toast.success('کتاب لائبریری میں واپس جمع ہو گئی ہے');
    } catch (err) {
      toast.error('کتاب واپس کرنے میں مسئلہ پیش آیا ہے');
    }
  };

  return (
    <div className="card card-side bg-base-100  shadow-xl m-4 w-[80%] mx-auto min-h-100vh">
      <div className="card-body zain-light">
        <div className="btn-and-heading flex justify-between items-center">
          <h2 className="card-title text-2xl font-bold mt-3 mb-5 font-sans">Librarian Dashboard</h2>
          <div className="flex gap-2 mb-5 font-sans">
            <button
              className="btn btn-neutral"
              onClick={() => document.getElementById('issued_books_modal').showModal()}
            >
              Issued Books List
            </button>
            <button className="btn btn-neutral" onClick={() => document.getElementById('reader_modal').showModal()}>Manage Readers</button>
            <button className="btn btn-neutral " onClick={() => { setEditingBookId(null); setState(initialState); document.getElementById('my_modal_4').showModal() }}>Add New Book<SquarePlus /></button>
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
                  <button dir='ltr' className="btn btn-neutral btn-wide" type='submit' disabled={loading}>
                    {loading ? (
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
        <div className="bg-base-100 rounded-xl shadow p-4 mb-4" dir="rtl">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-2 min-w-0">
              <SearchBooks onSearch={(value) => setSearchTerm(value)} />
            </div>
            <span className='w-full md:w-1/4'>
              <select
                className="select select-bordered "
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">تمام مضامین</option>
                {[...new Set(books.map(book => book.subject))].filter(Boolean).map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </span>
            <span className='w-full md:w-1/4'>
              <select
                className="select select-bordered w-full md:w-1/4"
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
        <BooksTable
          loading={books.length === 0 && !searchTerm}
          books={filteredBooks}
          readers={readers}
          updateStatus={updateStatus}
          handleEditBook={handleEditBook}
          searchTerm={searchTerm}
          isAdmin={true}
        />
        {!loading && books.length > 0 && filteredBooks.length === 0 && (
          <div className="py-20 text-center">
            <SearchX size={64} className="mx-auto mb-4 text-base-content/20" />
            <h3 className="text-3xl font-bold text-base-content/50">  معذرت! الفاظ "{searchTerm}" کے مطابق کتاب یا مصف نہیں ہے۔</h3>
            <h3 className="text-2xl mt-2 font-bold text-base-content/40">
              براہ کرم الفاظ بدل کر سرچ کریں۔
            </h3>
          </div>
        )}
      </div >

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
            <button className="btn btn-neutral btn-wide" onClick={handleAddNewReaderSubmit} disabled={loading}>
              {loading ? (
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
      <dialog id="issued_books_modal" className="modal font-sans w-full">
        <div className="modal-box w-11/12 max-w-3xl ">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-error btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-2xl mb-6 text-center text-neutral">Issued Books by Reader</h3>

          {/* Issued book readers list */}
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
                            {issuedBooks.map(book => (
                              <button
                                key={book.id}
                                className="btn btn-xs btn-success btn-outline btn-dash font-sans h-6 min-h-0"
                                onClick={() => handleReturnBook(book.id)}
                              >
                                Return
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button className="btn btn-xs btn-disabled font-sans h-6 min-h-0" disabled>
                            Return
                          </button>
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

    </div >
  )
};
